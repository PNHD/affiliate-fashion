import type { Variants, Transition } from "framer-motion";

// ── Easing presets ──
const easeOutQuad: Transition["ease"] = [0.25, 0.46, 0.45, 0.94];
const easeOut: Transition["ease"] = "easeOut";

// ── Scroll-triggered fade + slide up ──
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 32,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: easeOutQuad,
    } as Transition,
  },
};

// ── Fade in only ──
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: easeOut } as Transition,
  },
};

// ── Scale in from 95% ──
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easeOutQuad,
    } as Transition,
  },
};

// ── Stagger container ──
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    } as Transition,
  },
};

// ── Stagger child ──
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOutQuad,
    } as Transition,
  },
};

// ── Hover scale (for cards) ──
export const hoverScale: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.3, ease: easeOut } as Transition,
  },
};

// ── Page transition ──
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOutQuad,
    } as Transition,
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.3 } as Transition,
  },
};

// ── Reveal on scroll options ──
export const scrollRevealProps = {
  variants: fadeInUp,
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, margin: "-80px" },
} as const;
