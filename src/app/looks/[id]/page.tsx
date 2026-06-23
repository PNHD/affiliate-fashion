"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import TikTokEmbed from "@/components/TikTokEmbed";
import { useProducts } from "@/lib/api-hooks";
import { formatPrice } from "@/lib/utils";
import type { Video } from "@/types";

export default function LookPage() {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const { products } = useProducts({ videoId: id, limit: 50 });

  useEffect(() => {
    fetch(`/api/videos/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setVideo(d.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const trackClick = (productId: string) =>
    fetch("/api/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId }),
    });

  if (loading)
    return (
      <div className="pt-32 text-center text-brand-stone dark:text-dark-muted">
        Đang tải…
      </div>
    );

  if (!video)
    return (
      <div className="pt-32 text-center">
        <p className="text-brand-stone dark:text-dark-muted">
          Không tìm thấy look này.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-brand-accent dark:text-dark-accent hover:underline"
        >
          ← Về trang chủ
        </Link>
      </div>
    );

  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-6 lg:px-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-body-sm text-brand-stone transition-colors hover:text-brand-ink dark:text-dark-muted dark:hover:text-dark-text"
        >
          ← Lookbook
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,360px)_1fr]">
          {/* Video */}
          <div className="mx-auto w-full max-w-[360px]">
            <TikTokEmbed url={video.platform_url} />
          </div>

          {/* Shoppable items */}
          <div>
            <h1 className="font-display text-display-sm font-semibold text-brand-ink dark:text-dark-text">
              {video.title}
            </h1>
            {video.author_name && (
              <p className="mt-1 text-body-sm text-brand-stone dark:text-dark-muted">
                {video.author_name}
              </p>
            )}

            <h2 className="mb-4 mt-8 text-caption font-semibold uppercase tracking-[0.15em] text-brand-accent dark:text-dark-accent">
              Mặc gì trong look này
            </h2>

            {products.length === 0 ? (
              <p className="text-body-sm text-brand-stone dark:text-dark-muted">
                Chưa gắn món nào cho look này.
              </p>
            ) : (
              <ul className="space-y-3">
                {products.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center gap-4 rounded-card border border-brand-border p-3 dark:border-dark-border"
                  >
                    <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-surface-muted dark:bg-dark-cardHover">
                      {p.images[0] && (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-body-sm font-medium text-brand-ink dark:text-dark-text">
                        {p.name}
                      </p>
                      {p.price > 0 && (
                        <p className="mt-0.5 text-body-sm font-semibold text-brand-accent dark:text-dark-accent">
                          {formatPrice(p.price)}
                        </p>
                      )}
                    </div>
                    <a
                      href={p.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackClick(p.id)}
                      className="flex-shrink-0 rounded-full bg-brand-accent px-5 py-2.5 text-caption font-semibold text-white transition-all hover:bg-brand-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover"
                    >
                      Mua
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
