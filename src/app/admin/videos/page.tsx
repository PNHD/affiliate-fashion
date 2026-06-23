"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Loader2, Trash2, ExternalLink, Video } from "lucide-react";
import type { Video as VideoType } from "@/types";

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    const res = await fetch("/api/videos?limit=50");
    const data = await res.json();
    if (data.success) setVideos(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    await fetch(`/api/videos/${id}`, { method: "DELETE" });
    setVideos((v) => v.filter((x) => x.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Videos</h2>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Video className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No videos yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Videos will appear here when linked to products
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              {video.thumbnail_url ? (
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                  <Video className="h-8 w-8 text-gray-300" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1 capitalize">
                  {video.platform}
                  {video.author_name && ` · ${video.author_name}`}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <a
                    href={video.platform_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" /> Watch
                  </a>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
