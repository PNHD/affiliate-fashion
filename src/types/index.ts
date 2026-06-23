// ── Product ──
export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  currency: string;
  images: string[];
  affiliate_url: string;
  source_url: string | null;
  source_type: SourceType;
  video_id: string | null;
  category: string | null;
  tags: string[];
  is_active: boolean;
  click_count: number;
  created_at: string;
  updated_at: string;
}

export type SourceType = "shopee" | "tiktok" | "lazada" | "manual" | "other";

// ── Video ──
export interface Video {
  id: string;
  title: string;
  description: string | null;
  platform: "tiktok" | "youtube" | "other";
  platform_url: string;
  embed_url: string | null;
  thumbnail_url: string | null;
  author_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Site settings (singleton row, id = 1) ──
export interface SiteSettings {
  id: number;
  display_name: string | null;
  bio: string | null;
  tiktok_url: string | null;
  avatar_url: string | null;
  updated_at: string;
}

// ── Video-Product junction ──
export interface VideoProduct {
  video_id: string;
  product_id: string;
  position: number;
}

// ── Scraping ──
export interface ScrapeResult {
  title: string;
  description: string | null;
  price: number | null;
  currency: string;
  images: string[];
  source_url: string;
  source_type: SourceType;
  category: string | null;
  error?: string;
}

// ── Product Input (for forms) ──
export interface ProductInput {
  title: string;
  description: string | null;
  price: number | null;
  currency: string;
  images: string[];
  affiliate_url: string;
  source_url: string | null;
  source_type: SourceType;
  video_id: string | null;
  category: string | null;
  tags: string[];
  is_active: boolean;
}

// ── API ──
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
