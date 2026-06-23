// Development mock data — used only when Supabase is not configured
// In production, data comes from API routes connected to Supabase
import type { ProductView, VideoView } from "./data-adapter";

const img = (seed: string, w = 600, h = 800) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const MOCK_PRODUCTS: ProductView[] = [
  {
    id: "p1",
    name: "Oversized Linen Blazer in Sand",
    price: 89.99,
    salePrice: 64.99,
    description:
      "A relaxed-tailored blazer in washed Italian linen. Notched lapels, single-button closure, and a fully lined interior.",
    images: [img("blazer-sand-1"), img("blazer-sand-2"), img("blazer-sand-3")],
    source: "shopee",
    sourceUrl: "#",
    videoIds: ["v1", "v4"],
    tags: ["blazer", "linen", "minimal"],
    createdAt: "2026-06-15T00:00:00Z",
  },
  {
    id: "p2",
    name: "Wide-Leg Pleated Trousers Ivory",
    price: 72.0,
    description:
      "High-rise wide-leg trousers with sharp front pleats. Fluid drape that moves with you.",
    images: [img("trousers-ivory-1"), img("trousers-ivory-2")],
    source: "tiktok",
    sourceUrl: "#",
    videoIds: ["v2"],
    tags: ["trousers", "tailored", "summer"],
    createdAt: "2026-06-18T00:00:00Z",
  },
  {
    id: "p3",
    name: "Japanese Selvedge Denim Jacket",
    price: 128.0,
    salePrice: 98.0,
    description:
      "13.5oz Japanese selvedge denim. Classic trucker silhouette with custom brass hardware.",
    images: [img("denim-jacket-1"), img("denim-jacket-2")],
    source: "shopee",
    sourceUrl: "#",
    videoIds: ["v3"],
    tags: ["denim", "jacket", "japanese"],
    createdAt: "2026-06-10T00:00:00Z",
  },
  {
    id: "p4",
    name: "Silk-Blend Midi Dress Noir",
    price: 145.0,
    description:
      "Bias-cut midi dress in silk-satin blend. Cowl neck, adjustable straps, invisible zip.",
    images: [img("dress-noir-1"), img("dress-noir-2")],
    source: "lazada",
    sourceUrl: "#",
    videoIds: ["v1", "v5"],
    tags: ["dress", "silk", "evening"],
    createdAt: "2026-06-20T00:00:00Z",
  },
  {
    id: "p5",
    name: "Cashmere Crewneck Sweater Oatmeal",
    price: 195.0,
    description:
      "Rib-knit crewneck in Mongolian cashmere. Relaxed fit, dropped shoulders.",
    images: [img("sweater-oatmeal-1"), img("sweater-oatmeal-2")],
    source: "shopee",
    sourceUrl: "#",
    videoIds: ["v4"],
    tags: ["sweater", "cashmere", "winter"],
    createdAt: "2026-06-22T00:00:00Z",
  },
];

export const MOCK_VIDEOS: VideoView[] = [
  {
    id: "v1",
    title: "Quiet Luxury Office Look",
    thumbnail: img("video-office", 360, 640),
    embedUrl: "#",
    platform: "tiktok",
    productIds: ["p1", "p4"],
    views: 12400,
    createdAt: "2026-06-14T00:00:00Z",
  },
  {
    id: "v2",
    title: "Summer Trousers 3 Ways",
    thumbnail: img("video-trousers", 360, 640),
    embedUrl: "#",
    platform: "tiktok",
    productIds: ["p2"],
    views: 8700,
    createdAt: "2026-06-17T00:00:00Z",
  },
  {
    id: "v3",
    title: "Denim Jacket Fit Check",
    thumbnail: img("video-denim", 360, 640),
    embedUrl: "#",
    platform: "shopee",
    productIds: ["p3"],
    views: 15300,
    createdAt: "2026-06-09T00:00:00Z",
  },
  {
    id: "v4",
    title: "Layered in Neutrals",
    thumbnail: img("video-neutrals", 360, 640),
    embedUrl: "#",
    platform: "tiktok",
    productIds: ["p1", "p5"],
    views: 22100,
    createdAt: "2026-06-21T00:00:00Z",
  },
];

// Helpers
export function getProductById(id: string) {
  return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
}

export function getVideosForProduct(productId: string) {
  return MOCK_VIDEOS.filter((v) => v.productIds.includes(productId));
}
