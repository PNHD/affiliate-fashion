"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

interface Video {
  title: string;
  author_name: string;
  platform_url: string;
}
interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  sourceUrl: string;
}
interface LookData {
  video: Video;
  products: Product[];
}
interface OtherLook {
  id: string;
  title: string;
  thumbnail_url: string | null;
}

const formatVND = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);

const getTikTokEmbedUrl = (url: string) => {
  const match = url.match(/\/video\/(\d+)/) || url.match(/\/(\d{15,})/);
  return match ? `https://www.tiktok.com/player/v1/${match[1]}` : null;
};

export default function LookDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [look, setLook] = useState<LookData | null>(null);
  const [otherLooks, setOtherLooks] = useState<OtherLook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const [lookRes, otherRes] = await Promise.all([
          fetch(`/api/looks/${id}`),
          fetch("/api/videos?limit=12"),
        ]);
        const lookData = await lookRes.json();
        const otherData = await otherRes.json();

        if (lookData.success) setLook(lookData.data);
        else setError(true);

        if (otherData.success)
          setOtherLooks(
            otherData.data.filter((l: OtherLook) => l.id !== id).slice(0, 6),
          );
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBuyClick = (product: Product) => {
    fetch("/api/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: product.id }),
    }).catch(() => {});
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#FDF6F0] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FF3D81] border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (error || !look) {
    return (
      <main className="min-h-screen bg-[#FDF6F0] flex flex-col items-center justify-center gap-4 px-6 text-center text-[#1A1A1A]">
        <h1 className="font-['Bricolage_Grotesque',sans-serif] text-4xl font-bold">
          Không tìm thấy look
        </h1>
        <Link
          href="/"
          className="rounded-full bg-[#1A1A1A] px-6 py-3 font-bold text-white transition-colors hover:bg-[#FF3D81]"
        >
          ← Về trang chủ
        </Link>
      </main>
    );
  }

  const embedUrl = getTikTokEmbedUrl(look.video.platform_url);

  return (
    <main className="min-h-screen bg-[#FDF6F0] text-[#1A1A1A] font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-10 md:pt-28 md:pb-16">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-base font-bold mb-6 hover:text-[#FF3D81] transition-colors group"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span> Quay lại
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[40%_1fr] gap-8 lg:gap-12">
          {/* LEFT: video */}
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] flex flex-col justify-center items-center w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-[320px] aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl shadow-[#FF3D81]/20 border-4 border-white"
            >
              {isVideoLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-10 h-10 border-4 border-[#FF3D81] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={look.video.title}
                  allow="encrypted-media; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                  onLoad={() => setIsVideoLoading(false)}
                  className="absolute inset-0 w-full h-full border-0"
                  scrolling="no"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-white p-4 text-center">
                  Video không tải được.
                  <a href={look.video.platform_url} target="_blank" rel="noopener noreferrer" className="underline ml-2">
                    Xem trên TikTok
                  </a>
                </div>
              )}
            </motion.div>
            <div className="mt-4 text-center max-w-[320px]">
              <h1 className="font-['Bricolage_Grotesque',sans-serif] text-2xl md:text-3xl font-bold leading-tight">
                {look.video.title}
              </h1>
              {look.video.author_name && (
                <p className="text-sm font-bold text-[#FF3D81] mt-1">{look.video.author_name}</p>
              )}
            </div>
          </div>

          {/* RIGHT: products */}
          <div className="flex flex-col gap-6 lg:pt-4">
            <motion.h2
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-['Bricolage_Grotesque',sans-serif] text-4xl md:text-5xl font-bold flex flex-wrap items-center gap-x-3"
            >
              Mặc gì <span className="text-[#FF3D81]">trong look này</span>
            </motion.h2>

            {look.products.length === 0 ? (
              <div className="border-4 border-dashed border-[#00EBC7] rounded-3xl p-8 bg-white/50 text-center mt-4">
                <h3 className="font-['Bricolage_Grotesque',sans-serif] text-3xl mb-4">Chưa gắn món nào</h3>
                <p className="text-[#1A1A1A]/60">Thiên Kim đang cập nhật sản phẩm. Check lại sau nha!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 md:gap-6">
                {look.products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-2xl shadow-sm border border-black/5 hover:shadow-xl hover:shadow-[#FF3D81]/10 transition-shadow duration-300"
                  >
                    <div className="w-full sm:w-28 h-40 sm:h-28 rounded-xl overflow-hidden bg-gradient-to-br from-[#FF3D81]/15 to-[#00EBC7]/15 flex-shrink-0">
                      {product.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                    </div>

                    <div className="flex flex-col justify-between flex-1 py-1 min-w-0">
                      <div>
                        <h3 className="font-bold text-lg md:text-xl leading-tight">{product.name}</h3>
                        {product.price > 0 && (
                          <p className="text-2xl font-['Bricolage_Grotesque',sans-serif] font-bold mt-1 text-[#1A1A1A]">
                            {formatVND(product.price)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:justify-center justify-end gap-2">
                      <motion.a
                        href={product.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        onClick={() => handleBuyClick(product)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full sm:w-auto px-8 py-3 bg-[#FF3D81] text-white font-bold text-center rounded-xl shadow-md hover:bg-[#1A1A1A] transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-[#00EBC7]"
                        aria-label={`Mua ${product.name}`}
                      >
                        Mua
                      </motion.a>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* OTHER LOOKS */}
        {otherLooks.length > 0 && (
          <section className="mt-16 md:mt-24 border-t border-black/10 pt-10">
            <h2 className="font-['Bricolage_Grotesque',sans-serif] text-3xl md:text-4xl font-bold mb-6">Looks khác</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {otherLooks.map((l) => (
                <Link key={l.id} href={`/looks/${l.id}`} className="flex-shrink-0 w-36 md:w-44 group">
                  <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden bg-gradient-to-br from-[#FF3D81]/20 to-[#00EBC7]/20">
                    {l.thumbnail_url ? (
                      <img
                        src={l.thumbnail_url}
                        alt={l.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center p-3 text-center text-sm font-bold text-[#1A1A1A]/60">
                        {l.title}
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-semibold truncate">{l.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
