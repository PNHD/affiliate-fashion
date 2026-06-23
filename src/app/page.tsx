"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import ProductCard from "@/components/ProductCard";
import VideoCard from "@/components/VideoCard";
import HorizontalScroll from "@/components/HorizontalScroll";
import { ProductGridSkeleton } from "@/components/Skeleton";
import { ErrorState } from "@/components/States";
import { useProducts, useVideos } from "@/lib/api-hooks";
import { staggerContainer, staggerItem, fadeIn, scaleIn } from "@/lib/motion";

export default function HomePage() {
  const { products, loading, error, retry } = useProducts({ limit: 12 });
  const { videos, loading: vLoading } = useVideos({ limit: 4 });

  const featuredProducts = products.slice(0, 8);

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute -right-32 top-1/4 h-[500px] w-[500px] rounded-full bg-brand-accent/5 dark:bg-dark-accent/5 blur-3xl" />

        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 pt-24 pb-16 lg:grid-cols-2 lg:px-12">
          {/* Text column */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:pr-12"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-block text-caption font-semibold uppercase tracking-[0.2em] text-brand-accent dark:text-dark-accent"
            >
              AI-Curated Fashion
            </motion.span>

            <h1 className="mt-5 font-display text-display-lg font-semibold text-brand-ink dark:text-dark-text">
              Style that
              <br />
              <span className="italic text-brand-accent dark:text-dark-accent">earns</span> as
              it inspires
            </h1>

            <p className="mt-6 max-w-lg text-body-lg text-brand-stone dark:text-dark-muted">
              AI-generated outfit videos paired with shoppable affiliate links. Every look
              is a doorway — your audience clicks, you earn commission.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-brand-ink px-7 py-4 text-body-sm font-medium text-white transition-all hover:bg-brand-ink/85 dark:bg-dark-text dark:text-dark-base dark:hover:bg-dark-text/85"
              >
                Shop the look
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/videos"
                className="inline-flex items-center gap-2 rounded-full border border-brand-border dark:border-dark-border px-7 py-4 text-body-sm font-medium text-brand-ink dark:text-dark-text transition-all hover:border-brand-ink dark:hover:border-dark-text"
              >
                Watch videos
              </Link>
            </motion.div>
          </motion.div>

          {/* Video column — 9:16 TikTok-style embed */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative mx-auto w-full max-w-[320px] lg:max-w-[360px]"
          >
            <div className="relative aspect-[9/16] overflow-hidden rounded-[2rem] bg-black shadow-elevated ring-1 ring-white/10">
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-brand-stone/20 via-transparent to-brand-ink/40 p-6">
                <img
                  src="https://picsum.photos/seed/fashion-hero/360/640"
                  alt="Featured AI fashion video"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1 text-brand-ink">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="absolute bottom-20 left-4 z-10 rounded-full bg-white/90 px-3 py-1.5 text-caption font-medium text-brand-ink shadow-md backdrop-blur-sm">
                  + Shop this outfit
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 -z-10 h-32 w-32 rounded-full bg-brand-accent/10 dark:bg-dark-accent/10 blur-2xl" />
            <div className="absolute -right-4 -top-4 -z-10 h-24 w-24 rounded-full bg-brand-accent/8 dark:bg-dark-accent/8 blur-xl" />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FEATURED PRODUCTS — Horizontal scroll
          ═══════════════════════════════════════════════════ */}
      {loading ? (
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <ProductGridSkeleton count={8} />
          </div>
        </section>
      ) : error ? (
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <ErrorState onRetry={retry} />
          </div>
        </section>
      ) : featuredProducts.length > 0 ? (
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <ScrollReveal>
              <HorizontalScroll
                title="Featured Products"
                subtitle="Handpicked pieces from the latest videos"
              >
                {featuredProducts.map((product, i) => (
                  <div key={product.id} className="w-[260px] flex-shrink-0 sm:w-[280px]">
                    <ProductCard product={product} index={i} />
                  </div>
                ))}
              </HorizontalScroll>
            </ScrollReveal>
          </div>
        </section>
      ) : null}

      {/* ═══════════════════════════════════════════════════
          LATEST VIDEOS — Grid
          ═══════════════════════════════════════════════════ */}
      {videos.length > 0 && (
        <section className="py-16 lg:py-24 bg-surface-muted dark:bg-dark-card">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <ScrollReveal>
              <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-display text-display-md text-brand-ink dark:text-dark-text">
                    Latest Videos
                  </h2>
                  <p className="mt-2 text-body-sm text-brand-stone dark:text-dark-muted">
                    AI-generated outfits, styled and ready to shop
                  </p>
                </div>
                <Link
                  href="/videos"
                  className="group inline-flex items-center gap-2 text-body-sm font-medium text-brand-accent dark:text-dark-accent transition-colors hover:text-brand-accent-hover dark:hover:text-dark-accent-hover"
                >
                  View all videos
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="transition-transform group-hover:translate-x-0.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </ScrollReveal>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6"
            >
              {videos.map((video, i) => (
                <motion.div key={video.id} variants={staggerItem}>
                  <VideoCard video={video} index={i} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          NEWSLETTER / SOCIAL CTA
          ═══════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-12">
          <ScrollReveal>
            <span className="text-caption font-semibold uppercase tracking-[0.2em] text-brand-accent dark:text-dark-accent">
              Stay Inspired
            </span>

            <h2 className="mt-4 font-display text-display-md font-semibold text-brand-ink dark:text-dark-text">
              Get the latest looks in your inbox
            </h2>

            <p className="mt-3 text-body-base text-brand-stone dark:text-dark-muted">
              Weekly drops. Zero spam. Just the pieces worth knowing about.
            </p>

            <motion.form
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              onSubmit={(e) => e.preventDefault()}
              className="mt-8 mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 rounded-full border border-brand-border dark:border-dark-border bg-white dark:bg-dark-card px-6 py-4 text-body-sm text-brand-ink dark:text-dark-text placeholder:text-brand-stone/40 dark:placeholder:text-dark-muted/40 outline-none transition-all focus:border-brand-accent dark:focus:border-dark-accent focus:ring-2 focus:ring-brand-accent/10 dark:focus:ring-dark-accent/10"
              />
              <button
                type="submit"
                className="rounded-full bg-brand-accent px-7 py-4 text-body-sm font-medium text-white transition-all hover:bg-brand-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover"
              >
                Subscribe
              </button>
            </motion.form>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
