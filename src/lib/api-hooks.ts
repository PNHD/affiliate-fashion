"use client";

import { useState, useEffect, useCallback } from "react";
import { adaptProduct, adaptVideo, type ProductView, type VideoView } from "./data-adapter";
import type { SiteSettings } from "@/types";

// ── Products hook ──
export function useProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
  sourceType?: string;
  videoId?: string;
}) {
  const [products, setProducts] = useState<ProductView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [total, setTotal] = useState(0);

  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError(false);

    const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (params?.search) qs.set("search", params.search);
    if (params?.category) qs.set("category", params.category);
    if (params?.sort) qs.set("sort", params.sort ?? "newest");
    if (params?.sourceType && params.sourceType !== "all")
      qs.set("source_type", params.sourceType);
    if (params?.videoId) qs.set("video_id", params.videoId);

    fetch(`/api/products?${qs}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data.map((p: any) => adaptProduct(p)));
          setTotal(data.pagination?.total ?? 0);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [page, limit, params?.search, params?.category, params?.sort, params?.sourceType, params?.videoId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, total, retry: fetchProducts };
}

// ── Single product hook ──
export function useProduct(id: string) {
  const [product, setProduct] = useState<ProductView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const videos = data.data.videos?.map((v: any) => v.id) ?? [];
          setProduct(adaptProduct(data.data, videos));
        } else {
          setProduct(null);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading, error, retry: () => setError(false) };
}

// ── Videos hook ──
export function useVideos(params?: { page?: number; limit?: number }) {
  const [videos, setVideos] = useState<VideoView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchVideos = useCallback(() => {
    setLoading(true);
    setError(false);

    const qs = new URLSearchParams({
      page: String(params?.page ?? 1),
      limit: String(params?.limit ?? 50),
    });

    fetch(`/api/videos?${qs}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setVideos(data.data.map((v: any) => adaptVideo(v)));
          setTotal(data.pagination?.total ?? 0);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params?.page, params?.limit]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return { videos, loading, error, total, retry: fetchVideos };
}

// ── Site settings hook (creator header) ──
export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setSettings(d.data);
      })
      .catch(() => {});
  }, []);

  return settings;
}
