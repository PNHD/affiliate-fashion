"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { hoverScale } from "@/lib/motion";
import { SOURCE_CONFIG, type Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const source = SOURCE_CONFIG[product.source];
  const discount = product.salePrice
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0;

  return (
    <motion.div
      variants={hoverScale}
      initial="rest"
      whileHover="hover"
      className="group relative flex flex-col overflow-hidden rounded-card bg-white dark:bg-dark-card shadow-card transition-shadow hover:shadow-card-hover"
    >
      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-surface-muted dark:bg-dark-cardHover">
          <motion.img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading={index < 6 ? "eager" : "lazy"}
          />

          {/* Discount badge */}
          {discount > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-red-500/90 px-2.5 py-1 text-caption font-medium text-white backdrop-blur-sm">
              -{discount}%
            </span>
          )}

          {/* Quick CTA overlay */}
          <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center pb-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="rounded-full bg-white/90 dark:bg-dark-base/90 px-5 py-2.5 text-body-sm font-medium text-brand-ink dark:text-dark-text shadow-elevated backdrop-blur-md">
              View details
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col justify-between p-5">
          {/* Source badge */}
          <span
            className={`mb-3 inline-flex w-fit rounded px-2 py-0.5 text-caption font-medium ${source.color}`}
          >
            {source.label}
          </span>

          {/* Name */}
          <h3 className="font-display text-body-base font-medium leading-snug text-brand-ink dark:text-dark-text line-clamp-2">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-body-lg font-semibold text-brand-ink dark:text-dark-text">
              ${product.salePrice?.toFixed(2) ?? product.price.toFixed(2)}
            </span>
            {product.salePrice && (
              <span className="text-body-sm text-brand-stone/50 dark:text-dark-muted/50 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
