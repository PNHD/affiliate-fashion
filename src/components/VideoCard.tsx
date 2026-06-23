"use client";

import { motion } from "framer-motion";
import { hoverScale } from "@/lib/motion";
import type { Video } from "@/lib/types";

interface VideoCardProps {
  video: Video;
  index?: number;
}

export default function VideoCard({ video, index = 0 }: VideoCardProps) {
  const formattedViews =
    video.views >= 1_000_000
      ? `${(video.views / 1_000_000).toFixed(1)}M`
      : video.views >= 1_000
        ? `${(video.views / 1_000).toFixed(1)}K`
        : video.views;

  return (
    <motion.div
      variants={hoverScale}
      initial="rest"
      whileHover="hover"
      className="group relative flex flex-col overflow-hidden rounded-card bg-white dark:bg-dark-card shadow-card transition-shadow hover:shadow-card-hover"
    >
      {/* Thumbnail — 9:16 TikTok aspect */}
      <div className="relative aspect-[9/16] overflow-hidden bg-surface-muted dark:bg-dark-cardHover">
        <motion.img
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading={index < 4 ? "eager" : "lazy"}
        />

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 scale-75">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-1 text-brand-ink">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Platform badge */}
        <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-caption font-medium text-white backdrop-blur-sm">
          {video.platform === "tiktok" ? "TikTok" : "Shopee"}
        </span>

        {/* Views */}
        <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-caption text-white backdrop-blur-sm">
          {formattedViews} views
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display text-body-base font-medium leading-snug text-brand-ink dark:text-dark-text line-clamp-2">
          {video.title}
        </h3>
        <p className="mt-1 text-caption text-brand-stone dark:text-dark-muted">
          {video.productIds.length} product{video.productIds.length !== 1 ? "s" : ""} featured
        </p>
      </div>
    </motion.div>
  );
}
