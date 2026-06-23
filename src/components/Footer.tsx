import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-brand-border dark:border-dark-border">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <Link href="/" className="group inline-flex items-center gap-2">
            <span className="font-display text-2xl font-semibold tracking-tight text-brand-ink dark:text-dark-text">
              Thiên Kim
            </span>
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-accent dark:bg-dark-accent" />
          </Link>
          <p className="max-w-sm text-body-sm text-brand-stone dark:text-dark-muted">
            Lookbook OOTD — outfit inspo mỗi ngày ✨
          </p>
          <p className="mt-4 text-caption text-brand-stone/60 dark:text-dark-muted/60">
            &copy; {new Date().getFullYear()} Thiên Kim
          </p>
        </div>
      </div>
    </footer>
  );
}
