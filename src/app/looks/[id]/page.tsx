"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import ScrollReveal from "@/components/ScrollReveal";
import HorizontalScroll from "@/components/HorizontalScroll";
import { EmptyState } from "@/components/States";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  fadeIn,
  scaleIn,
} from "@/lib/motion";

// ── Types ──

interface LookVideo {
  title: string;
  author_name: string;
  platform_url: string;
}

interface LookProduct {
  id: string;
  name: string;
  price: number;
  images: string[];
  sourceUrl: string;
}

interface LookData {
  video: LookVideo;
  products: LookProduct[];
}

interface OtherLook {
  id: string;
  title: string;
  thumbnail_url: string | null;
}

// ── Helpers ──

function toTikTokEmbedUrl(url: string): string {
  const match = url.match(/\/video\/(\d+)/) || url.match(/\/(\d{15,})/);
  if (match) return `https://www.tiktok.com/embed/v2/${match[1]}`;
  return url;
}

function formatVND(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function trackClick(productId: string) {
  fetch("/api/click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId }),
  }).catch(() => {});
}

// ═══════════════════════════════════════════════════════════════════
//  Loader
// ═══════════════════════════════════════════════════════════════════

function LookDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-28 pb-24 lg:px-12">
      <div className="skeleton mb-10 h-4 w-32 rounded" />
      <div className="grid gap-10 lg:grid-cols-[420px_1fr] lg:gap-16">
        <div className="mx-auto w-full max-w-[360px] lg:sticky lg:top-28 lg:max-w-none">
          <div className="skeleton aspect-[9/16] w-full rounded-card" />
          <div className="mt-4 space-y-2 hidden lg:block">
            <div className="skeleton h-6 w-3/4 rounded" />
            <div className="skeleton h-4 w-1/2 rounded" />
          </div>
        </div>
        <div className="space-y-8">
          <div className="hidden lg:block space-y-2">
            <div className="skeleton h-5 w-24 rounded" />
            <div className="skeleton h-10 w-2/3 rounded" />
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex gap-4 rounded-card bg-white dark:bg-dark-card p-4 shadow-subtle"
              >
                <div className="skeleton aspect-square w-24 rounded flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-5 w-1/3 rounded" />
                  <div className="skeleton h-9 w-24 rounded-full mt-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  Error
// ═══════════════════════════════════════════════════════════════════

function LookError({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-32 text-center"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.2}
          className="text-red-400 dark:text-red-500"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <h2 className="font-display text-display-sm text-brand-ink dark:text-dark-text">
        Không tải được look
      </h2>
      <p className="mt-2 max-w-sm text-body-sm text-brand-stone dark:text-dark-muted">
        Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.
      </p>
      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-ink px-7 py-3.5 text-body-sm font-medium text-white transition-all hover:bg-brand-ink/85 dark:bg-dark-text dark:text-dark-base dark:hover:bg-dark-text/85"
      >
        Thử lại
      </button>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  Product Row — "Shop this look"
// ═══════════════════════════════════════════════════════════════════

function ProductRow({ product, index }: { product: LookProduct; index: number }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      variants={staggerItem}
      className="group flex gap-4 rounded-card bg-white dark:bg-dark-card p-4 shadow-subtle transition-shadow hover:shadow-card"
    >
      <div className="relative aspect-square w-24 flex-shrink-0 overflow-hidden rounded bg-surface-muted dark:bg-dark-cardHover sm:w-28">
        {product.images[0] && !imgError ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading={index < 6 ? "eager" : "lazy"}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-stone/30 dark:text-dark-muted/30">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <h3 className="font-display text-body-base font-medium leading-snug text-brand-ink dark:text-dark-text line-clamp-2">
            {product.name}
          </h3>
          {product.price > 0 && (
            <p className="mt-1 font-semibold text-brand-accent dark:text-dark-accent text-body-base">
              {formatVND(product.price)}
            </p>
          )}
        </div>

        <motion.a
          href={product.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick(product.id)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-2.5 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-accent px-5 py-2 text-body-sm font-semibold text-white transition-colors hover:bg-brand-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
          aria-label={`Mua ${product.name}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Mua
        </motion.a>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  Page
// ═══════════════════════════════════════════════════════════════════

export default function LookDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [look, setLook] = useState<LookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showMobileVideo, setShowMobileVideo] = useState(false);
  const [otherLooks, setOtherLooks] = useState<OtherLook[]>([]);

  const fetchLook = useCallback(() => {
    if (!id) return;
    setLoading(true);
    setError(false);

    fetch(`/api/looks/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        if (data.success) setLook(data.data);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchLook();
  }, [fetchLook]);

  // Other looks for the bottom strip (real data, current look excluded).
  useEffect(() => {
    fetch("/api/videos?limit=12")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setOtherLooks(
            d.data
              .filter((v: { id: string }) => v.id !== id)
              .slice(0, 8)
              .map((v: { id: string; title: string; thumbnail_url: string | null }) => ({
                id: v.id,
                title: v.title,
                thumbnail_url: v.thumbnail_url,
              })),
          );
        }
      })
      .catch(() => {});
  }, [id]);

  if (loading) return <LookDetailSkeleton />;
  if (error || !look) return <LookError onRetry={fetchLook} />;

  const { video, products } = look;
  const embedUrl = toTikTokEmbedUrl(video.platform_url);
  const hasProducts = products.length > 0;
  const displayTitle = video.title || "Xem outfit này";

  const videoBlock = (
    <div className="relative mx-auto w-full max-w-[380px] lg:max-w-none">
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-card bg-black shadow-elevated">
        <iframe
          src={embedUrl}
          title={`${video.author_name} — ${video.title}`}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
          loading="eager"
        />
      </div>
      <div className="mt-4 hidden lg:block">
        <h1 className="font-display text-display-sm font-semibold leading-tight text-brand-ink dark:text-dark-text">
          {displayTitle}
        </h1>
        {video.author_name && (
          <p className="mt-1.5 text-body-sm text-brand-stone dark:text-dark-muted">
            {video.author_name}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-7xl px-6 pt-28 pb-24 lg:px-12"
    >
      {/* Breadcrumb */}
      <ScrollReveal>
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-body-sm">
          <Link
            href="/"
            className="text-brand-stone/60 dark:text-dark-muted/60 transition-colors hover:text-brand-ink dark:hover:text-dark-text"
          >
            Lookbook
          </Link>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="text-brand-border dark:text-dark-border">
            <path d="M9 18l6-6-6-6" />
          </svg>
          <span className="text-brand-ink dark:text-dark-text truncate max-w-[200px]">
            {video.author_name || "Look"}
          </span>
        </nav>
      </ScrollReveal>

      {/* Desktop layout */}
      <div className="hidden lg:grid lg:grid-cols-[420px_1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">{videoBlock}</div>

        <div>
          <ScrollReveal>
            <div className="mb-8">
              <p className="text-caption font-semibold uppercase tracking-[0.2em] text-brand-accent dark:text-dark-accent">
                Mặc gì trong look này
              </p>
              <p className="mt-3 text-body-base text-brand-stone dark:text-dark-muted">
                {hasProducts
                  ? `${products.length} sản phẩm trong video`
                  : "Sản phẩm trong outfit này"}
              </p>
            </div>
          </ScrollReveal>

          {hasProducts ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {products.map((product, i) => (
                <ProductRow key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          ) : (
            <ScrollReveal>
              <EmptyState
                title="Chưa gắn món nào"
                description="Outfit này chưa có sản phẩm nào được liên kết. Hãy quay lại sau nhé."
              />
            </ScrollReveal>
          )}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden">
        <ScrollReveal>
          <div className="mb-6">
            <AnimatePresence mode="wait">
              {!showMobileVideo ? (
                <motion.div
                  key="collapsed"
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="flex items-start gap-4"
                >
                  <button
                    onClick={() => setShowMobileVideo(true)}
                    className="relative aspect-[9/16] w-[120px] flex-shrink-0 overflow-hidden rounded-card bg-black shadow-card"
                    aria-label={`Xem video — ${video.title}`}
                  >
                    <iframe
                      src={embedUrl}
                      title={video.title}
                      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
                      allow="autoplay; encrypted-media"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-elevated backdrop-blur-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 text-brand-ink">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </button>

                  <div className="flex-1 min-w-0 pt-1">
                    <h1 className="font-display text-display-sm font-semibold leading-tight text-brand-ink dark:text-dark-text">
                      {displayTitle}
                    </h1>
                    {video.author_name && (
                      <p className="mt-1 text-body-sm text-brand-stone dark:text-dark-muted">
                        {video.author_name}
                      </p>
                    )}
                    <button
                      onClick={() => setShowMobileVideo(true)}
                      className="mt-3 inline-flex items-center gap-1.5 text-body-sm font-medium text-brand-accent dark:text-dark-accent"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <polyline points="15 3 21 3 21 9" />
                        <polyline points="9 21 3 21 3 15" />
                        <line x1="21" y1="3" x2="14" y2="10" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                      </svg>
                      Xem to
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="expanded" variants={scaleIn} initial="hidden" animate="visible" exit="hidden">
                  <div className="flex items-center justify-between mb-3">
                    <h1 className="font-display text-display-sm font-semibold text-brand-ink dark:text-dark-text truncate">
                      {displayTitle}
                    </h1>
                    <button
                      onClick={() => setShowMobileVideo(false)}
                      className="ml-2 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-brand-border dark:border-dark-border text-brand-stone dark:text-dark-muted transition-colors hover:border-brand-ink hover:text-brand-ink dark:hover:border-dark-text dark:hover:text-dark-text"
                      aria-label="Thu nhỏ video"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  {videoBlock}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>

        <div className="mb-5">
          <p className="text-caption font-semibold uppercase tracking-[0.2em] text-brand-accent dark:text-dark-accent">
            Mặc gì trong look này
          </p>
        </div>

        {hasProducts ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="space-y-3"
          >
            {products.map((product, i) => (
              <ProductRow key={product.id} product={product} index={i} />
            ))}
          </motion.div>
        ) : (
          <EmptyState
            title="Chưa gắn món nào"
            description="Outfit này chưa có sản phẩm nào được liên kết."
          />
        )}
      </div>

      {/* Other looks (real data) */}
      {otherLooks.length > 0 && (
        <section className="mt-24 lg:mt-32">
          <ScrollReveal>
            <HorizontalScroll title="Looks khác" subtitle="Khám phá thêm outfit từ Thiên Kim">
              {otherLooks.map((l) => (
                <Link
                  key={l.id}
                  href={`/looks/${l.id}`}
                  className="group w-[200px] flex-shrink-0 sm:w-[220px]"
                >
                  <div className="relative aspect-[9/16] overflow-hidden rounded-card bg-surface-muted dark:bg-dark-cardHover shadow-card transition-shadow group-hover:shadow-card-hover">
                    {l.thumbnail_url ? (
                      <img
                        src={l.thumbnail_url}
                        alt={l.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-accent/10 to-brand-stone/10 p-4 text-center text-body-sm text-brand-stone dark:text-dark-muted">
                        {l.title}
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-body-sm font-medium text-brand-stone dark:text-dark-muted line-clamp-1">
                    {l.title}
                  </p>
                </Link>
              ))}
            </HorizontalScroll>
          </ScrollReveal>
        </section>
      )}
    </motion.div>
  );
}
