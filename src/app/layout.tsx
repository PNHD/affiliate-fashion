import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import RootLayoutClient from "./RootLayoutClient";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maison — AI-Curated Fashion",
  description:
    "Discover curated fashion products from AI-styled outfit videos. Click, shop, and get the look.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-cream dark:bg-dark-base text-brand-ink dark:text-dark-text">
        <ThemeProvider>
          <RootLayoutClient>
            {children}
            <Toaster position="top-center" richColors />
          </RootLayoutClient>
        </ThemeProvider>
      </body>
    </html>
  );
}
