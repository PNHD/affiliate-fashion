import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

// ── Empty State ──
export function EmptyState({
  title = "Nothing here yet",
  description = "Try adjusting your filters or check back later.",
  icon,
}: {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      {icon || (
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          className="mb-6 text-brand-border dark:text-dark-border"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      )}
      <h3 className="font-display text-display-sm text-brand-ink dark:text-dark-text">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-body-sm text-brand-stone dark:text-dark-muted">
        {description}
      </p>
    </motion.div>
  );
}

// ── Error State ──
export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        className="mb-6 text-red-300 dark:text-red-700"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
      <h3 className="font-display text-display-sm text-brand-ink dark:text-dark-text">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-body-sm text-brand-stone dark:text-dark-muted">
        {description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-ink px-6 py-3 text-body-sm font-medium text-white transition-all hover:bg-brand-ink/80 dark:bg-dark-text dark:text-dark-base dark:hover:bg-dark-text/80"
        >
          Try again
        </button>
      )}
    </motion.div>
  );
}
