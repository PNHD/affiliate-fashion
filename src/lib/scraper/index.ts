import * as cheerio from "cheerio";
import type { ScrapeResult, SourceType } from "@/types";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "vi-VN,vi;q=0.9,en;q=0.8",
    },
    // Vercel free tier: 10s max for serverless
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.text();
}

// ── Shopee ──
async function scrapeShopee(url: string): Promise<ScrapeResult> {
  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  const result: ScrapeResult = {
    title: "",
    description: null,
    price: null,
    currency: "VND",
    images: [],
    source_url: url,
    source_type: "shopee",
    category: null,
  };

  // 1. Try JSON-LD structured data (most reliable)
  const jsonLd = $('script[type="application/ld+json"]').html();
  if (jsonLd) {
    try {
      const parsed = JSON.parse(jsonLd);
      if (parsed.name) result.title = parsed.name;
      if (parsed.description) result.description = parsed.description;
      if (parsed.offers?.price) result.price = parseFloat(parsed.offers.price);
      if (parsed.offers?.priceCurrency)
        result.currency = parsed.offers.priceCurrency;
      if (parsed.image) {
        result.images = Array.isArray(parsed.image)
          ? parsed.image
          : [parsed.image];
      }
    } catch {
      // JSON-LD parse failed, fall through
    }
  }

  // 2. Fallback to OG/meta tags
  if (!result.title) {
    result.title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text() ||
      "Unknown Product";
  }
  if (!result.description) {
    result.description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      null;
  }
  if (result.images.length === 0) {
    const ogImage = $('meta[property="og:image"]').attr("content");
    if (ogImage) result.images = [ogImage];
  }

  // 3. Try to extract price from visible elements
  if (!result.price) {
    const priceText =
      $('[class*="price"]').first().text() ||
      $('[class*="Price"]').first().text() ||
      $('[data-testid*="price"]').first().text();
    const priceMatch = priceText.match(/[\d.,]+/);
    if (priceMatch) result.price = parseFloat(priceMatch[0].replace(/\./g, ""));
  }

  // 4. Extract more images from product gallery
  if (result.images.length <= 1) {
    $('img[class*="product"]').each((_, el) => {
      const src = $(el).attr("src");
      if (src && src.startsWith("http") && !result.images.includes(src)) {
        result.images.push(src);
      }
    });
  }

  // Validate minimum data
  if (!result.title || result.title === "Unknown Product") {
    return { ...result, error: "Could not extract product title" };
  }

  return result;
}

// ── TikTok ──
async function scrapeTikTok(url: string): Promise<ScrapeResult> {
  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  const result: ScrapeResult = {
    title: "",
    description: null,
    price: null,
    currency: "VND",
    images: [],
    source_url: url,
    source_type: "tiktok",
    category: null,
  };

  // 1. OG tags
  result.title =
    $('meta[property="og:title"]').attr("content") || "TikTok Video";

  result.description =
    $('meta[property="og:description"]').attr("content") || null;

  const ogImage = $('meta[property="og:image"]').attr("content");
  if (ogImage) result.images = [ogImage];

  // 2. Extract potential product links from description
  // TikTok descriptions often contain "Link in bio" or direct Shopee links
  if (result.description) {
    const shopeeLinks = result.description.match(
      /https?:\/\/shopee\.\w+\/[^\s]+/gi,
    );
    const lazadaLinks = result.description.match(
      /https?:\/\/www\.lazada\.\w+\/[^\s]+/gi,
    );
    // Store discovered links in description for admin to review
    const discovered = [
      ...(shopeeLinks || []),
      ...(lazadaLinks || []),
    ].join("\n");
    if (discovered) {
      result.description = `${result.description}\n\n--- Discovered links ---\n${discovered}`;
    }
  }

  // TikTok scrape is inherently limited — admin must verify
  return result;
}

// ── Lazada ──
async function scrapeLazada(url: string): Promise<ScrapeResult> {
  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  const result: ScrapeResult = {
    title: "",
    description: null,
    price: null,
    currency: "VND",
    images: [],
    source_url: url,
    source_type: "lazada",
    category: null,
  };

  // OG tags
  result.title =
    $('meta[property="og:title"]').attr("content") ||
    $("title").text() ||
    "Unknown Product";

  result.description =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="description"]').attr("content") ||
    null;

  const ogImage = $('meta[property="og:image"]').attr("content");
  if (ogImage) result.images = [ogImage];

  if (!result.title || result.title === "Unknown Product") {
    return { ...result, error: "Could not extract product title" };
  }

  return result;
}

// ── Generic / Auto-detect ──
async function scrapeGeneric(url: string): Promise<ScrapeResult> {
  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  const result: ScrapeResult = {
    title:
      $('meta[property="og:title"]').attr("content") ||
      $("title").text() ||
      "Unknown",
    description:
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      null,
    price: null,
    currency: "VND",
    images: [],
    source_url: url,
    source_type: "other",
    category: null,
  };

  const ogImage = $('meta[property="og:image"]').attr("content");
  if (ogImage) result.images = [ogImage];

  return result;
}

// ── Router ──
function detectSourceType(url: string): SourceType {
  if (url.includes("shopee.")) return "shopee";
  if (url.includes("tiktok.com")) return "tiktok";
  if (url.includes("lazada.")) return "lazada";
  return "other";
}

export async function scrapeUrl(url: string): Promise<ScrapeResult> {
  const sourceType = detectSourceType(url);

  switch (sourceType) {
    case "shopee":
      return scrapeShopee(url);
    case "tiktok":
      return scrapeTikTok(url);
    case "lazada":
      return scrapeLazada(url);
    default:
      return scrapeGeneric(url);
  }
}
