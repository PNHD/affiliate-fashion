"use client";

import { useEffect, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import type { SiteSettings } from "@/types";

export default function SettingsPage() {
  const [s, setS] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setS(d.data);
      });
  }, []);

  const save = async () => {
    if (!s) return;
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        display_name: s.display_name,
        bio: s.bio,
        tiktok_url: s.tiktok_url,
      }),
    });
    const d = await res.json();
    setSaving(false);
    setMsg(d.success ? "Đã lưu ✓" : "Lỗi: " + (d.error || ""));
  };

  const upload = async (file: File) => {
    setUploading(true);
    setMsg("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/settings/avatar", { method: "POST", body: fd });
    const d = await res.json();
    setUploading(false);
    if (d.success) setS((prev) => (prev ? { ...prev, avatar_url: d.url } : prev));
    else setMsg("Lỗi upload: " + (d.error || ""));
  };

  if (!s) return <div className="text-gray-400">Đang tải…</div>;

  const field =
    "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none";

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>

      {/* Avatar */}
      <div className="mb-6 flex items-center gap-4">
        <div className="h-20 w-20 overflow-hidden rounded-full bg-gray-100">
          {s.avatar_url && (
            <img src={s.avatar_url} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Đổi avatar
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
            }}
          />
        </label>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Tên hiển thị
          </label>
          <input
            value={s.display_name ?? ""}
            onChange={(e) => setS({ ...s, display_name: e.target.value })}
            className={field}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            value={s.bio ?? ""}
            onChange={(e) => setS({ ...s, bio: e.target.value })}
            rows={4}
            className={`${field} resize-none`}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Link TikTok
          </label>
          <input
            value={s.tiktok_url ?? ""}
            onChange={(e) => setS({ ...s, tiktok_url: e.target.value })}
            placeholder="https://www.tiktok.com/@..."
            className={field}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Lưu
        </button>
        {msg && <span className="text-sm text-gray-600">{msg}</span>}
      </div>
    </div>
  );
}
