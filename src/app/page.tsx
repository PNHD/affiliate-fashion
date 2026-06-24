"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// Types
interface Settings {
  display_name: string;
  bio: string;
  tiktok_url: string;
  avatar_url: string | null;
}
interface Look {
  id: string;
  title: string;
  thumbnail_url: string | null;
}

export default function HomePage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [looks, setLooks] = useState<Look[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, looksRes] = await Promise.all([
          fetch("/api/settings"),
          fetch("/api/videos?limit=50"),
        ]);
        const settingsData = await settingsRes.json();
        const looksData = await looksRes.json();

        if (settingsData.success) setSettings(settingsData.data);
        if (looksData.success) setLooks(looksData.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const initials = (settings?.display_name || "TK").slice(0, 2).toUpperCase();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#FDF6F0] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FF3D81] border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDF6F0] text-[#1A1A1A] font-['Plus_Jakarta_Sans',sans-serif] overflow-x-hidden">
      {/* === HERO === */}
      <section className="relative px-5 pt-28 pb-12 md:pt-32 md:pb-20 max-w-6xl mx-auto">
        <div className="absolute top-20 right-5 w-32 h-32 bg-[#00EBC7] rounded-full blur-3xl opacity-50 -z-10" />
        <div className="absolute top-32 left-5 w-40 h-40 bg-[#FF3D81] rounded-full blur-3xl opacity-30 -z-10" />

        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-12">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="relative flex-shrink-0"
          >
            <div className="absolute inset-0 bg-[#FF3D81] rounded-full rotate-6 transition-transform duration-300 hover:rotate-12" />
            <div className="absolute inset-0 bg-[#00EBC7] rounded-full -rotate-6 transition-transform duration-300 hover:-rotate-12" />
            {settings?.avatar_url ? (
              <img
                src={settings.avatar_url}
                alt={settings.display_name || "Avatar"}
                className="relative w-32 h-32 md:w-44 md:h-44 rounded-full object-cover border-4 border-[#FDF6F0] z-10"
              />
            ) : (
              <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-[#FDF6F0] z-10 flex items-center justify-center bg-[#1A1A1A] text-white font-['Bricolage_Grotesque',sans-serif] text-4xl font-bold">
                {initials}
              </div>
            )}
          </motion.div>

          <div className="text-center md:text-left flex-1">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm md:text-base font-bold uppercase tracking-[0.2em] text-[#FF3D81] mb-2"
            >
              OOTD Lookbook
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 80 }}
              className="font-['Bricolage_Grotesque',sans-serif] text-5xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight"
            >
              {settings?.display_name || "Thiên Kim"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4 text-lg md:text-xl text-[#1A1A1A]/80 max-w-md mx-auto md:mx-0 whitespace-pre-line"
            >
              {settings?.bio || "Chào bé, welcome to my closet! ✨"}
            </motion.p>

            {settings?.tiktok_url && (
              <motion.a
                href={settings.tiktok_url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 mt-6 bg-[#1A1A1A] text-white px-6 py-3 rounded-full font-bold text-base shadow-lg hover:bg-[#FF3D81] transition-colors duration-300"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V8.72a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.15z"/></svg>
                TikTok
              </motion.a>
            )}
          </div>
        </div>
      </section>

      {/* === LOOKS GRID === */}
      <section className="px-5 pb-24 max-w-7xl mx-auto">
        <h2 className="font-['Bricolage_Grotesque',sans-serif] text-4xl md:text-5xl font-bold mb-8 flex items-center gap-3">
          Looks Mới Nhất
          <span className="inline-block w-4 h-4 md:w-6 md:h-6 bg-[#00EBC7] rounded-full" />
        </h2>

        {looks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-4 border-dashed border-[#FF3D81]/30 rounded-3xl bg-white/50">
            <h3 className="font-['Bricolage_Grotesque',sans-serif] text-3xl mb-4">Chưa có look nào…</h3>
            <p className="text-[#1A1A1A]/60">Thiên Kim sẽ cập nhật sớm thôi!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {looks.map((look, index) => (
              <motion.div
                key={look.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: (index % 4) * 0.1 }}
              >
                <Link href={`/looks/${look.id}`} className="block group">
                  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FF3D81]/20 to-[#00EBC7]/20 ${
                    index % 5 === 0 ? 'aspect-[3/4]' :
                    index % 3 === 0 ? 'aspect-square' : 'aspect-[4/5]'
                  }`}>
                    {look.thumbnail_url ? (
                      <img
                        src={look.thumbnail_url}
                        alt={look.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-4 text-center">
                        <span className="font-['Bricolage_Grotesque',sans-serif] font-bold text-[#1A1A1A]/70 text-lg leading-tight">{look.title}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">{look.title}</h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
