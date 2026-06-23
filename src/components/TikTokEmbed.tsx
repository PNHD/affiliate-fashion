"use client";

// Clean 9:16 TikTok player via the official embed player URL (no script needed).
function videoId(url: string): string | null {
  const m = url.match(/\/video\/(\d+)/) || url.match(/\/(\d{15,})/);
  return m ? m[1] : null;
}

export default function TikTokEmbed({ url }: { url: string }) {
  const id = videoId(url);

  if (!id) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex aspect-[9/16] items-center justify-center rounded-2xl bg-black text-sm text-white/80"
      >
        Xem trên TikTok ↗
      </a>
    );
  }

  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-black shadow-elevated">
      <iframe
        src={`https://www.tiktok.com/player/v1/${id}`}
        className="absolute inset-0 h-full w-full"
        allow="autoplay; fullscreen; encrypted-media"
        allowFullScreen
        title="TikTok video"
      />
    </div>
  );
}
