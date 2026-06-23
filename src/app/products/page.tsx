"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import { ProductGridSkeleton } from "@/components/Skeleton";
import { EmptyState, ErrorState } from "@/components/States";
import { useProducts } from "@/lib/api-hooks";
import { staggerContainer, staggerItem } from "@/lib/motion";
import type { SortOption } from "@/lib/data-adapter";

type SourceFilter = "all" | "shopee" | "tiktok" | "lazada";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low → High" },
  { value: "price-high", label: "Price: High → Low" },
];

const SOURCE_FILTERS: { value: SourceFilter; label: string }[] = [
  { value: "all", label: "All Sources" },
  { value: "shopee", label: "Shopee" },
  { value: "tiktok", label: "TikTok" },
  { value: "lazada", label: "Lazada" },
];

export default function ProductsPage() {
  const { products, loading, error, retry } = useProducts({ limit: 100 });

  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // ── Client-side filter + sort ──
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (sourceFilter !== "all") {
      result = result.filter((p) => p.source === sourceFilter);
    }

    switch (sort) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
    }

    return result;
  }, [products, search, sourceFilter, sort]);

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* ── Page Header ── */}
        <ScrollReveal>
          <div className="mb-10">
            <span className="text-caption font-semibold uppercase tracking-[0.2em] text-brand-accent dark:text-dark-accent">
              Browse
            </span>
            <h1 className="mt-2 font-display text-display-lg font-semibold text-brand-ink dark:text-dark-text">
              All Products
            </h1>
            <p className="mt-3 max-w-xl text-body-base text-brand-stone dark:text-dark-muted">
              Every piece featured in our AI-generated fashion videos. Click through to
              shop on your favorite platform.
            </p>
          </div>
        </ScrollReveal>

        {/* ── Filters Bar ── */}
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-stone/50 dark:text-dark-muted/50"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-brand-border dark:border-dark-border bg-white dark:bg-dark-card py-3.5 pl-12 pr-5 text-body-sm text-brand-ink dark:text-dark-text placeholder:text-brand-stone/40 dark:placeholder:text-dark-muted/40 outline-none transition-all focus:border-brand-accent dark:focus:border-dark-accent"
            />
          </div>

          {/* Desktop filters + sort */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <div className="flex rounded-full border border-brand-border dark:border-dark-border p-1">
              {SOURCE_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setSourceFilter(f.value)}
                  className={`rounded-full px-4 py-2 text-body-sm font-medium transition-all ${
                    sourceFilter === f.value
                      ? "bg-brand-ink text-white dark:bg-dark-text dark:text-dark-base"
                      : "text-brand-stone hover:text-brand-ink dark:text-dark-muted dark:hover:text-dark-text"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-full border border-brand-border dark:border-dark-border bg-white dark:bg-dark-card py-3 px-4 text-body-sm text-brand-ink dark:text-dark-text outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex w-fit items-center gap-2 rounded-full border border-brand-border dark:border-dark-border px-5 py-3 text-body-sm font-medium text-brand-ink dark:text-dark-text lg:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
            </svg>
            Filters & Sort
          </button>
        </div>

        {/* ── Mobile filters ── */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 overflow-hidden lg:hidden"
            >
              <div className="space-y-4 rounded-card border border-brand-border dark:border-dark-border bg-white dark:bg-dark-card p-5">
                <div>
                  <p className="mb-2 text-caption font-semibold uppercase tracking-wider text-brand-stone dark:text-dark-muted">
                    Source
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SOURCE_FILTERS.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => setSourceFilter(f.value)}
                        className={`rounded-full px-4 py-2 text-body-sm font-medium transition-all ${
                          sourceFilter === f.value
                            ? "bg-brand-ink text-white dark:bg-dark-text dark:text-dark-base"
                            : "bg-surface-muted text-brand-stone hover:text-brand-ink dark:bg-dark-cardHover dark:text-dark-muted dark:hover:text-dark-text"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-caption font-semibold uppercase tracking-wider text-brand-stone dark:text-dark-muted">
                    Sort by
                  </p>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    className="w-full rounded-full border border-brand-border dark:border-dark-border bg-surface-muted dark:bg-dark-cardHover py-3 px-4 text-body-sm text-brand-ink dark:text-dark-text outline-none"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results count ── */}
        {!loading && !error && (
          <p className="mb-6 text-body-sm text-brand-stone dark:text-dark-muted">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
          </p>
        )}

        {/* ── Product Grid ── */}
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : error ? (
          <ErrorState onRetry={retry} />
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            title="No products found"
            description={
              search.trim()
                ? `Nothing matches "${search}". Try a different search term.`
                : "No products match the current filters. Try adjusting them."
            }
          />
        ) : (
          <motion.div
            key={`${search}-${sourceFilter}-${sort}`}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6"
          >
            {filteredProducts.map((product, i) => (
              <motion.div key={product.id} variants={staggerItem}>
                <ProductCard product={product} index={i} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
