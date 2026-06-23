"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ProductInput } from "@/types";
import { ArrowLeft, Loader2, Plus, Trash2, Upload } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  const [imageInput, setImageInput] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.affiliate_url) return;

    setLoading(true);
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/admin/products/${data.data.id}`);
    } else {
      const data = await res.json();
      alert(data.error || "Failed to create product");
    }
    setLoading(false);
  };

  const addImage = () => {
    if (imageInput && !form.images.includes(imageInput)) {
      setForm({ ...form, images: [...form.images, imageInput] });
      setImageInput("");
    }
  };

  const removeImage = (url: string) => {
    setForm({ ...form, images: form.images.filter((i) => i !== url) });
  };

  const addTag = () => {
    if (tagInput && !form.tags.includes(tagInput)) {
      setForm({ ...form, tags: [...form.tags, tagInput] });
      setTagInput("");
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/products"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Add Product</h2>
      </div>

      {/* ── Product form ── */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-gray-200 p-6 space-y-5"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
            placeholder="Product name"
          />
        </div>

        {/* Look (video) this item belongs to */}
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
          {looks.length === 0 && (
            <p className="mt-1 text-xs text-gray-400">
              Chưa có look nào — thêm look ở tab Looks trước.
            </p>
          )}
        </div>

        {/* Description */}
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
            placeholder="Product description..."
          />
        </div>

        {/* Price + Currency */}
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
              placeholder="0"
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

        {/* Affiliate URL */}
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
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
            placeholder="https://shopee.vn/...?affiliate_code=..."
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Images
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="url"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
              placeholder="https://image-url.com/photo.jpg"
            />
            <button
              type="button"
              onClick={addImage}
              className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
          {form.images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {form.images.map((url) => (
                <div key={url} className="relative group">
                  <img
                    src={url}
                    alt=""
                    className="h-20 w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category + Tags */}
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
              placeholder="e.g., Áo, Quần, Phụ kiện"
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
                placeholder="Add tag..."
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

        {/* Active toggle */}
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

        {/* Submit */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading || !form.title || !form.affiliate_url}
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Create Product
          </button>
          <Link
            href="/admin/products"
            className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
