import Link from "next/link";

const FOOTER_LINKS = {
  Shop: [
    { href: "/products", label: "All Products" },
    { href: "/products?source=shopee", label: "Shopee Finds" },
    { href: "/products?source=tiktok", label: "TikTok Picks" },
  ],
  Watch: [
    { href: "/videos", label: "Latest Videos" },
    { href: "/videos?sort=popular", label: "Most Popular" },
  ],
  Company: [
    { href: "#", label: "About" },
    { href: "#", label: "Contact" },
    { href: "#", label: "Privacy" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-brand-border dark:border-dark-border">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="group inline-flex items-center gap-2">
              <span className="font-display text-2xl font-semibold tracking-tight text-brand-ink dark:text-dark-text">
                Maison
              </span>
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-accent dark:bg-dark-accent" />
            </Link>
            <p className="mt-5 max-w-sm text-body-sm text-brand-stone dark:text-dark-muted leading-relaxed">
              AI-curated fashion. Real outfits, real products. Every piece styled and linked — earn while you inspire.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-body-sm font-semibold uppercase tracking-widest text-brand-ink dark:text-dark-text">
                {title}
              </h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-brand-stone dark:text-dark-muted transition-colors hover:text-brand-accent dark:hover:text-dark-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-brand-border dark:border-dark-border pt-8 sm:flex-row">
          <p className="text-caption text-brand-stone/60 dark:text-dark-muted/60">
            &copy; {new Date().getFullYear()} Maison. All rights reserved.
          </p>
          <p className="text-caption text-brand-stone/40 dark:text-dark-muted/40">
            Designed with intention. Built for discovery.
          </p>
        </div>
      </div>
    </footer>
  );
}
