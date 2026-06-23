"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useVideos, useSettings } from "@/lib/api-hooks";
import { staggerContainer, staggerItem } from "@/lib/motion";

function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.3v13.05a2.59 2.59 0 1 1-2.59-2.59c.27 0 .53.04.78.12v-3.36a5.95 5.95 0 0 0-.78-.05A5.95 5.95 0 1 0 15.6 16.1V9.4a7.56 7.56 0 0 0 4.4 1.4V7.5a4.28 4.28 0 0 1-3.4-1.68z" />
    </svg>
  );
}

export default function HomePage() {
  const settings = useSettings();
  const { videos, loading } = useVideos({ limit: 50 });

  return (
    <div className="pt-24">
      {/* ── Creator header ── */}
      <section className="mx-auto max-w-2xl px-6 pb-14 text-center">
        <div className="mx-auto h-28 w-28 overflow-hidden rounded-full bg-surface-muted ring-4 ring-brand-accent/15 dark:bg-dark-cardHover">
          {settings?.avatar_url ? (
            <img
              src={settings.avatar_url}
              alt={settings.display_name ?? "avatar"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-3xl text-brand-stone dark:text-dark-muted">
              {(settings?.display_name ?? "TK").slice(0, 2)}
            </div>
          )}
        </div>

        <h1 className="mt-5 font-display text-display-md font-semibold text-brand-ink dark:text-dark-text">
          {settings?.display_name ?? "Thiên Kim"}
        </h1>

        {settings?.bio && (
          <p className="mx-auto mt-3 max-w-md whitespace-pre-line text-body-base text-brand-stone dark:text-dark-muted">
            {settings.bio}
          </p>
        )}

        {settings?.tiktok_url && (
          <a
            href={settings.tiktok_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-ink px-6 py-3 text-body-sm font-medium text-white transition-all hover:bg-brand-ink/85 dark:bg-dark-text dark:text-dark-base dark:hover:bg-dark-text/85"
          >
            <TikTokIcon />
            TikTok
          </a>
        )}
      </section>

      {/* ── Look grid ── */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-12">
        <h2 className="mb-8 font-display text-display-sm font-semibold text-brand-ink dark:text-dark-text">
          Lookbook
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-card bg-surface-muted dark:bg-dark-cardHover"
              />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="rounded-card border border-dashed border-brand-border py-20 text-center text-brand-stone dark:border-dark-border dark:text-dark-muted">
            Chưa có look nào. Vào trang admin để thêm look đầu tiên ✨
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6"
          >
            {videos.map((v) => (
              <motion.div key={v.id} variants={staggerItem}>
                <Link href={`/looks/${v.id}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-card bg-surface-muted dark:bg-dark-cardHover">
                    {v.thumbnail ? (
                      <img
                        src={v.thumbnail}
                        alt={v.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-accent/10 to-brand-stone/10 p-4 text-center text-body-sm text-brand-stone dark:text-dark-muted">
                        {v.title}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <p className="mt-3 line-clamp-2 text-body-sm font-medium text-brand-ink dark:text-dark-text">
                    {v.title}
                  </p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
