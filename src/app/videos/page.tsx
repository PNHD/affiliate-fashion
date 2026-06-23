"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import VideoCard from "@/components/VideoCard";
import { ProductGridSkeleton } from "@/components/Skeleton";
import { EmptyState, ErrorState } from "@/components/States";
import { useVideos } from "@/lib/api-hooks";
import { staggerContainer, staggerItem } from "@/lib/motion";

export default function VideosPage() {
  const { videos, loading, error, retry } = useVideos({ limit: 50 });

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <ScrollReveal>
          <div className="mb-10">
            <span className="text-caption font-semibold uppercase tracking-[0.2em] text-brand-accent dark:text-dark-accent">
              Watch
            </span>
            <h1 className="mt-2 font-display text-display-lg font-semibold text-brand-ink dark:text-dark-text">
              AI Fashion Videos
            </h1>
            <p className="mt-3 max-w-xl text-body-base text-brand-stone dark:text-dark-muted">
              Every outfit styled by AI, every product shoppable. Watch, click, shop.
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <ProductGridSkeleton count={6} />
        ) : error ? (
          <ErrorState onRetry={retry} />
        ) : videos.length === 0 ? (
          <EmptyState
            title="No videos yet"
            description="Videos will appear here once linked to products."
          />
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6"
          >
            {videos.map((video, i) => (
              <motion.div key={video.id} variants={staggerItem}>
                <VideoCard video={video} index={i} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
