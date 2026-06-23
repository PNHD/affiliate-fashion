"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Video, MousePointerClick, TrendingUp, Plus, ArrowRight } from "lucide-react";

interface Stats {
  totalProducts: number;
  activeProducts: number;
  totalVideos: number;
  totalClicks: number;
  clicksToday: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setStats(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: "Total Products",
      value: stats?.totalProducts ?? "-",
      sub: `${stats?.activeProducts ?? 0} active`,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Videos",
      value: stats?.totalVideos ?? "-",
      icon: Video,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Total Clicks",
      value: stats?.totalClicks ?? "-",
      icon: MousePointerClick,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Clicks Today",
      value: stats?.clicksToday ?? "-",
      icon: TrendingUp,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">
            Overview of your affiliate shop
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse"
            >
              <div className="h-4 w-20 bg-gray-200 rounded mb-3" />
              <div className="h-8 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div
                className={`inline-flex p-2 rounded-lg ${card.color} mb-3`}
              >
                <card.icon className="h-5 w-5" />
              </div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              {card.sub && (
                <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quick links */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <Link
          href="/admin/products"
          className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-gray-400" />
            <span className="font-medium text-gray-900">Manage Products</span>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </Link>
        <Link
          href="/admin/videos"
          className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Video className="h-5 w-5 text-gray-400" />
            <span className="font-medium text-gray-900">Manage Videos</span>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </Link>
      </div>
    </div>
  );
}
