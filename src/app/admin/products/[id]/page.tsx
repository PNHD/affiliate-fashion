"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import type { Product, ProductInput } from "@/types";
import { ArrowLeft, Loader2, Save, Trash2, Plus, Eye } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProductInput>({
    title: "",
    description: null,
    price: null,
    currency: "VND",
    images: [],
    affiliate_url: "",
    source_url: null,
    source_type: "manual",
    video_id: null,
    category: null,
    tags: [],
    is_active: true,
  });
  const [tagInput, setTagInput] = useState("");
  const [looks, setLooks] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    fetch("/api/videos?limit=50")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setLooks(d.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const p = data.data;
          setForm({
            title: p.title,
            description: p.description,
            price: p.price,
            currency: p.currency,
            images: p.images,
            affiliate_url: p.affiliate_url,
            source_url: p.source_url,
            source_type: p.source_type,
            video_id: p.video_id,
            category: p.category,
            tags: p.tags,
            is_active: p.is_active,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/admin/products");
    } else {
      const data = await res.json();
      alert(data.error || "Failed to save");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this product permanently?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.push("/admin/products");
  };

  const addTag = () => {
    if (tagInput && !form.tags.includes(tagInput)) {
      setForm({ ...form, tags: [...form.tags, tagInput] });
      setTagInput("");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
            {form.video_id && (
              <Link
                href={`/looks/${form.video_id}`}
                target="_blank"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                <Eye className="h-3 w-3" /> Xem look trên web
              </Link>
            )}
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
          />
        </div>

        {/* Look this item belongs to */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thuộc Look nào
          </label>
          <select
            value={form.video_id ?? ""}
            onChange={(e) =>
              setForm({ ...form, video_id: e.target.value || null })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none bg-white"
          >
            <option value="">— Chưa gắn look —</option>
            {looks.map((l) => (
              <option key={l.id} value={l.id}>
                {l.title.slice(0, 60)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={form.description || ""}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value || null })
            }
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              value={form.price ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: e.target.value ? parseFloat(e.target.value) : null,
                })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
            >
              <option value="VND">VND</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Affiliate Link *
          </label>
          <input
            type="url"
            value={form.affiliate_url}
            onChange={(e) =>
              setForm({ ...form, affiliate_url: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
          />
        </div>

        <ImageUploader
          images={form.images}
          onChange={(imgs) => setForm({ ...form, images: imgs })}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              value={form.category || ""}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value || null })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          tags: form.tags.filter((t) => t !== tag),
                        })
                      }
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setForm({ ...form, is_active: !form.is_active })}
            className={`relative w-10 h-6 rounded-full transition-colors ${
              form.is_active ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                form.is_active ? "translate-x-4" : ""
              }`}
            />
          </button>
          <span className="text-sm text-gray-600">
            {form.is_active ? "Active (visible)" : "Hidden"}
          </span>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </button>
          <Link
            href="/admin/products"
            className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
