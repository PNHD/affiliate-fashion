import type { Product as ApiProduct, Video as ApiVideo } from "@/types";

// ── View types matching GLM 5.2 design (unchanged component interface) ──

export interface ProductView {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  description: string;
  images: string[];
  source: "shopee" | "tiktok" | "lazada" | "manual" | "other";
  sourceUrl: string;
  videoIds: string[];
  tags: string[];
  createdAt: string;
}

export interface VideoView {
  id: string;
  title: string;
  thumbnail: string;
  embedUrl: string;
  platform: "tiktok" | "shopee" | "youtube" | "other";
  productIds: string[];
  views: number;
  createdAt: string;
}

// ── Sort + Filter types (GLM's) ──

export type SortOption = "newest" | "price-low" | "price-high";

// ── Source badge config ──
export const SOURCE_CONFIG = {
  shopee: {
    label: "Shopee",
    color:
      "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  },
  tiktok: {
    label: "TikTok",
    color:
      "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  lazada: {
    label: "Lazada",
    color:
      "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  manual: {
    label: "Manual",
    color: "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  },
  other: {
    label: "Other",
    color: "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  },
} as const;

// ── Adapters: Supabase API → GLM View ──

export function adaptProduct(
  api: ApiProduct,
  videoIds: string[] = [],
): ProductView {
  return {
    id: api.id,
    name: api.title,
    price: api.price ?? 0,
    description: api.description ?? "",
    images: api.images,
    source: api.source_type,
    sourceUrl: api.affiliate_url,
    videoIds,
    tags: api.tags,
    createdAt: api.created_at,
  };
}

export function adaptVideo(api: ApiVideo): VideoView {
  return {
    id: api.id,
    title: api.title,
    thumbnail: api.thumbnail_url ?? "",
    embedUrl: api.embed_url ?? api.platform_url,
    platform: api.platform === "youtube" ? "youtube" : "tiktok",
    productIds: [],
    views: 0,
    createdAt: api.created_at,
  };
}
