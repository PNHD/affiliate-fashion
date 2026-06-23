import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  price: z.number().positive().nullable().optional(),
  currency: z.string().default("VND"),
  images: z.array(z.string().url()).default([]),
  affiliate_url: z.string().url("Must be a valid URL"),
  source_url: z.string().url().nullable().optional(),
  source_type: z
    .enum(["shopee", "tiktok", "lazada", "manual", "other"])
    .default("manual"),
  video_id: z.string().uuid().nullable().optional(),
  category: z.string().nullable().optional(),
  tags: z.array(z.string()).default([]),
  is_active: z.boolean().default(true),
});

export const productUpdateSchema = productSchema.partial();

export const scrapeRequestSchema = z.object({
  url: z.string().url("Must be a valid URL"),
});

export const videoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  platform: z.enum(["tiktok", "youtube", "other"]),
  platform_url: z.string().url(),
  embed_url: z.string().url().nullable().optional(),
  thumbnail_url: z.string().url().nullable().optional(),
  author_name: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
});

export const videoUpdateSchema = videoSchema.partial();

export const settingsSchema = z.object({
  display_name: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  tiktok_url: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
});

export const clickEventSchema = z.object({
  product_id: z.string().uuid(),
  referrer: z.string().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
export type VideoInput = z.infer<typeof videoSchema>;
