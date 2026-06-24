"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";

// ── Types ──
interface Video {
  title: string;
  author_name: string;
  platform_url: string;
}
interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  sourceUrl: string;
}
interface Look {
  video: Video;
  products: Product[];
}
interface OtherLook {
  id: string;
  title: string;
  thumbnail_url: string | null;
}

// ── Motion ──
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// ── Helpers ──
const getTikTokEmbedUrl = (url: string) => {
  const m = url.match(/video\/(\d+)/) || url.match(/\/(\d{15,})/);
  return m ? `https://www.tiktok.com/embed/v2/${m[1]}` : url;
};
const formatVND = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
const trackClick = (id: string) =>
  fetch("/api/click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: id }),
  }).catch(() => {});

// ── Product thumbnail with graceful fallback ──
function Thumb({ src, alt }: { src?: string; alt: string }) {
  const [err, setErr] = useState(false);
  if (!src || err)
    return (
      <div className="flex h-full w-full items-center justify-center text-brand-stone/30 dark:text-dark-muted/30">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      </div>
    );
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setErr(true)}
      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
    />
  );
}

export default function LookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [look, setLook] = useState<Look | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [otherLooks, setOtherLooks] = useState<OtherLook[]>([]);

  const fetchLook = useCallback(() => {
    if (!id) return;
    setIsLoading(true);
    setError(false);
    fetch(`/api/looks/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((d) => (d.success ? setLook(d.data) : setError(true)))
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    fetchLook();
  }, [fetchLook]);

  useEffect(() => {
    fetch("/api/videos?limit=12")
      .then((r) => r.json())
      .then((d) => {
        if (d.success)
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
      })
      .catch(() => {});
  }, [id]);

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream dark:bg-dark-base">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
          <p className="font-display text-lg italic text-brand-stone dark:text-dark-muted">
            Đang tải look...
          </p>
        </motion.div>
      </div>
    );
  }

  // ── Error ──
  if (error || !look) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-cream px-6 text-center dark:bg-dark-base">
        <p className="font-display text-2xl text-brand-ink dark:text-dark-text">Không tải được look</p>
        <button
          onClick={fetchLook}
          className="rounded-full bg-brand-ink px-6 py-3 text-body-sm font-medium text-white transition-all hover:bg-brand-ink/85 dark:bg-dark-text dark:text-dark-base"
        >
          Thử lại
        </button>
        <Link href="/" className="text-body-sm text-brand-accent hover:underline">
          ← Về Lookbook
        </Link>
      </div>
    );
  }

  const embedUrl = getTikTokEmbedUrl(look.video.platform_url);
  const hasProducts = look.products.length > 0;

  return (
    <main className="min-h-screen bg-brand-cream text-brand-ink antialiased dark:bg-dark-base dark:text-dark-text">
      <div className="mx-auto max-w-7xl px-4 py-8 pt-24 sm:px-6 md:py-16 lg:px-8 lg:py-24 lg:pt-28">
        {/* Breadcrumb */}
        <Link
          href="/"
          className="mb-8 inline-block text-body-sm text-brand-stone/70 transition-colors hover:text-brand-ink dark:text-dark-muted/70 dark:hover:text-dark-text"
        >
          ← Lookbook
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start lg:gap-16">
          {/* LEFT — sticky video */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex justify-center lg:sticky lg:top-28"
          >
            <div className="relative aspect-[9/16] w-full max-w-sm overflow-hidden rounded-3xl border border-black/5 bg-stone-200 shadow-elevated dark:border-white/5 dark:bg-dark-card">
              {isVideoLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
                </div>
              )}
              <iframe
                src={embedUrl}
                title={look.video.title}
                allow="encrypted-media; picture-in-picture; web-share; fullscreen"
                allowFullScreen
                onLoad={() => setIsVideoLoading(false)}
                className="absolute inset-0 h-full w-full border-0"
                scrolling="no"
              />
            </div>
          </motion.section>

          {/* RIGHT — details + products */}
          <motion.section variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-8 lg:py-4">
            {/* Header */}
            <motion.div variants={fadeUp} className="flex flex-col gap-2 border-b border-brand-border pb-8 dark:border-dark-border">
              {look.video.author_name && (
                <p className="text-sm font-medium uppercase tracking-widest text-brand-accent dark:text-dark-accent">
                  {look.video.author_name}
                </p>
              )}
              <h1 className="font-display text-3xl font-medium tracking-tight text-brand-ink dark:text-dark-text md:text-4xl lg:text-5xl">
                {look.video.title || "Xem outfit này"}
              </h1>
            </motion.div>

            {/* Products */}
            <div className="flex flex-col gap-6">
              <motion.h2 variants={fadeUp} className="font-display text-2xl italic text-brand-stone dark:text-dark-muted">
                Mặc gì trong look này
              </motion.h2>

              {!hasProducts ? (
                <motion.div
                  variants={fadeUp}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-border bg-white/50 px-6 py-16 text-center dark:border-dark-border dark:bg-dark-card/50"
                >
                  <h3 className="mb-2 font-display text-2xl text-brand-ink dark:text-dark-text">Chưa gắn món nào</h3>
                  <p className="max-w-xs text-brand-stone dark:text-dark-muted">
                    Outfit này đang được cập nhật sản phẩm. Quay lại sau nhé!
                  </p>
                </motion.div>
              ) : (
                <motion.ul variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-4">
                  {look.products.map((product) => (
                    <motion.li
                      key={product.id}
                      variants={fadeUp}
                      className="group flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-3 shadow-subtle transition-shadow duration-300 hover:shadow-card dark:border-white/5 dark:bg-dark-card/60 sm:gap-6 sm:p-4"
                    >
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-surface-muted dark:bg-dark-cardHover sm:h-24 sm:w-24">
                        <Thumb src={product.images[0]} alt={product.name} />
                      </div>

                      <div className="min-w-0 flex-grow">
                        <h3 className="truncate text-base font-medium text-brand-ink dark:text-dark-text sm:text-lg">
                          {product.name}
                        </h3>
                        {product.price > 0 && (
                          <p className="mt-1 text-sm font-light text-brand-stone dark:text-dark-muted sm:text-base">
                            {formatVND(product.price)}
                          </p>
                        )}
                      </div>

                      <motion.a
                        href={product.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        onClick={() => trackClick(product.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-shrink-0 rounded-full bg-brand-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-brand-accent-hover focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-cream dark:bg-dark-accent dark:hover:bg-dark-accent-hover dark:focus:ring-offset-dark-base sm:px-7 sm:py-3 sm:text-base"
                        aria-label={`Mua ${product.name}`}
                      >
                        Mua
                      </motion.a>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </div>
          </motion.section>
        </div>

        {/* OTHER LOOKS */}
        {otherLooks.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mt-20 border-t border-brand-border pt-10 dark:border-dark-border lg:mt-32"
          >
            <h2 className="mb-6 font-display text-2xl text-brand-ink dark:text-dark-text">Looks khác</h2>
            <div className="scroll-container">
              {otherLooks.map((l) => (
                <Link
                  key={l.id}
                  href={`/looks/${l.id}`}
                  className="group relative h-44 w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-surface-muted dark:bg-dark-cardHover sm:h-56 sm:w-40"
                >
                  {l.thumbnail_url ? (
                    <img
                      src={l.thumbnail_url}
                      alt={l.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-3 text-center text-caption text-brand-stone dark:text-dark-muted">
                      {l.title}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </main>
  );
}
