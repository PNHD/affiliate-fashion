"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import ScrollReveal from "@/components/ScrollReveal";
import ProductCard from "@/components/ProductCard";
import VideoCard from "@/components/VideoCard";
import { ProductDetailSkeleton } from "@/components/Skeleton";
import { EmptyState, ErrorState } from "@/components/States";
import { useProduct, useProducts } from "@/lib/api-hooks";
import { SOURCE_CONFIG, type ProductView } from "@/lib/data-adapter";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { product, loading, error, retry } = useProduct(id);
  const { products: allProducts } = useProducts({ limit: 50 });

  const [selectedImage, setSelectedImage] = useState(0);

  // Related: same tags, excluding current product
  const relatedProducts = useMemo(() => {
    if (!product || !allProducts.length) return [];
    return allProducts
      .filter(
        (p) =>
          p.id !== product.id &&
          p.tags.some((t) => product.tags.includes(t)),
      )
      .slice(0, 4);
  }, [product, allProducts]);

  if (loading) {
    return (
      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <ProductDetailSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <ErrorState onRetry={retry} />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <EmptyState
            title="Product not found"
            description="This product may have been removed or the link is incorrect."
          />
        </div>
      </div>
    );
  }

  const source = SOURCE_CONFIG[product.source] ?? SOURCE_CONFIG.other;
  const displayPrice = product.salePrice ?? product.price;
  const discount = product.salePrice
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0;

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Breadcrumb */}
        <ScrollReveal>
          <nav className="mb-8 flex items-center gap-2 text-body-sm text-brand-stone dark:text-dark-muted">
            <Link
              href="/"
              className="hover:text-brand-accent dark:hover:text-dark-accent transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href="/products"
              className="hover:text-brand-accent dark:hover:text-dark-accent transition-colors"
            >
              Products
            </Link>
            <span>/</span>
            <span className="text-brand-ink dark:text-dark-text truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </ScrollReveal>

        {/* ── Product Detail Grid ── */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image Gallery */}
          <ScrollReveal>
            <div className="space-y-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-card bg-surface-muted dark:bg-dark-cardHover">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={product.images[selectedImage] || product.images[0]}
                    alt={product.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full w-full object-cover"
                  />
                </AnimatePresence>

                {discount > 0 && (
                  <span className="absolute left-4 top-4 rounded-full bg-red-500/90 px-3 py-1.5 text-caption font-medium text-white backdrop-blur-sm">
                    -{discount}%
                  </span>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative aspect-[3/4] w-20 overflow-hidden rounded-card transition-all ${
                        selectedImage === i
                          ? "ring-2 ring-brand-accent dark:ring-dark-accent"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Product Info */}
          <ScrollReveal delay={0.15}>
            <div className="flex flex-col justify-center">
              <span
                className={`mb-4 inline-flex w-fit rounded px-2.5 py-1 text-caption font-medium ${source.color}`}
              >
                {source.label}
              </span>

              <h1 className="font-display text-display-md font-semibold text-brand-ink dark:text-dark-text">
                {product.name}
              </h1>

              <div className="mt-5 flex items-baseline gap-3">
                <span className="font-display text-3xl font-semibold text-brand-ink dark:text-dark-text">
                  ${displayPrice.toFixed(2)}
                </span>
                {product.salePrice != null && product.salePrice > 0 && product.salePrice !== product.price && (
                  <span className="text-lg text-brand-stone/50 dark:text-dark-muted/50 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {product.description && (
                <p className="mt-6 text-body-base text-brand-stone dark:text-dark-muted leading-relaxed">
                  {product.description}
                </p>
              )}

              {product.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-surface-muted dark:bg-dark-cardHover px-3 py-1.5 text-caption font-medium text-brand-stone dark:text-dark-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={product.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    fetch("/api/click", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ product_id: product.id }),
                    });
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-accent px-8 py-4 text-body-sm font-semibold text-white transition-all hover:bg-brand-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover shadow-card hover:shadow-card-hover"
                >
                  Buy on {source.label}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </a>
                <button className="inline-flex items-center gap-2 rounded-full border border-brand-border dark:border-dark-border px-8 py-4 text-body-sm font-medium text-brand-ink dark:text-dark-text transition-all hover:border-brand-ink dark:hover:border-dark-text">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  Save
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <section className="mt-24">
            <ScrollReveal>
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="font-display text-display-sm font-semibold text-brand-ink dark:text-dark-text">
                    You might also like
                  </h2>
                  <p className="mt-2 text-body-sm text-brand-stone dark:text-dark-muted">
                    Similar style, similar pieces
                  </p>
                </div>
                <Link
                  href="/products"
                  className="hidden sm:flex items-center gap-2 text-body-sm font-medium text-brand-accent dark:text-dark-accent hover:text-brand-accent-hover dark:hover:text-dark-accent-hover transition-colors"
                >
                  View all
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </ScrollReveal>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
              {relatedProducts.map((p, i) => (
                <ScrollReveal key={p.id} delay={i * 0.08}>
                  <ProductCard product={p} index={i} />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
