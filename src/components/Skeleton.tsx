// ── Product Card Skeleton ──
export function ProductCardSkeleton() {
  return (
    <div className="group rounded-card bg-white dark:bg-dark-card overflow-hidden">
      <div className="skeleton aspect-[3/4] w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/3 rounded" />
      </div>
    </div>
  );
}

// ── Video Card Skeleton ──
export function VideoCardSkeleton() {
  return (
    <div className="group rounded-card bg-white dark:bg-dark-card overflow-hidden">
      <div className="skeleton aspect-[9/16] w-full" />
      <div className="p-4 space-y-2">
        <div className="skeleton h-4 w-5/6 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
      </div>
    </div>
  );
}

// ── Product Detail Skeleton ──
export function ProductDetailSkeleton() {
  return (
    <>
      <div className="skeleton h-4 w-48 rounded mb-8" />
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-4">
          <div className="skeleton aspect-[3/4] w-full rounded-card" />
          <div className="flex gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton aspect-[3/4] w-20 rounded-card" />
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <div className="skeleton h-5 w-20 rounded" />
          <div className="skeleton h-10 w-3/4 rounded" />
          <div className="skeleton h-8 w-1/3 rounded" />
          <div className="space-y-2">
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-5/6 rounded" />
            <div className="skeleton h-4 w-2/3 rounded" />
          </div>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-7 w-16 rounded-full" />
            ))}
          </div>
          <div className="skeleton h-14 w-48 rounded-full mt-8" />
        </div>
      </div>
    </>
  );
}

// ── Product Grid Skeleton ──
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
