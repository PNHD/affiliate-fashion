import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          cream: "#FAF9F6",
          ink: "#171717",
          stone: "#6B6760",
          border: "#E8E5E0",
          accent: "#C2704A",
          "accent-hover": "#A85A3A",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F5F4F1",
          hover: "#F0EEE9",
        },
        dark: {
          base: "#0F0F0F",
          card: "#1A1A1A",
          cardHover: "#242424",
          text: "#F0EFEC",
          muted: "#8B8880",
          border: "#2A2A2A",
          accent: "#D48563",
          "accent-hover": "#E09A7A",
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 8vw, 6rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem, 5vw, 4rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "display-sm": ["clamp(1.35rem, 2vw, 1.75rem)", { lineHeight: "1.2" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
        "body-base": ["1rem", { lineHeight: "1.65" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6" }],
        caption: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.04em" }],
      },
      spacing: {
        "golden-sm": "1rem",          // 16px
        "golden-md": "1.625rem",      // 26px  ~φ×16
        "golden-lg": "2.625rem",      // 42px  ~φ×26
        "golden-xl": "4.25rem",       // 68px  ~φ×42
        "golden-2xl": "6.875rem",     // 110px ~φ×68
      },
      borderRadius: {
        subtle: "2px",
        card: "4px",
      },
      boxShadow: {
        card: "0 2px 24px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 4px 32px rgba(0, 0, 0, 0.07)",
        elevated: "0 8px 48px rgba(0, 0, 0, 0.06)",
        subtle: "0 1px 2px rgba(0, 0, 0, 0.03)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "scale-in": "scaleIn 0.4s ease-out forwards",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
