"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";

interface HorizontalScrollProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function HorizontalScroll({ children, title, subtitle }: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    updateScrollState();
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = containerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div>
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-8 flex items-end justify-between">
          <div>
            {title && (
              <h2 className="font-display text-display-md text-brand-ink dark:text-dark-text">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-2 text-body-sm text-brand-stone dark:text-dark-muted">
                {subtitle}
              </p>
            )}
          </div>

          {/* Scroll arrows (desktop only) */}
          <div className="hidden gap-3 sm:flex">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border dark:border-dark-border text-brand-stone transition-all hover:border-brand-ink hover:text-brand-ink disabled:opacity-30 disabled:cursor-not-allowed dark:text-dark-muted dark:hover:border-dark-text dark:hover:text-dark-text"
              aria-label="Scroll left"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border dark:border-dark-border text-brand-stone transition-all hover:border-brand-ink hover:text-brand-ink disabled:opacity-30 disabled:cursor-not-allowed dark:text-dark-muted dark:hover:border-dark-text dark:hover:text-dark-text"
              aria-label="Scroll right"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Scroll container */}
      <div
        ref={containerRef}
        className="scroll-container"
      >
        {children}
      </div>

      {/* Mobile scroll hint */}
      <p className="mt-3 text-center text-caption text-brand-stone/40 dark:text-dark-muted/40 sm:hidden">
        Swipe to browse &rarr;
      </p>
    </div>
  );
}
