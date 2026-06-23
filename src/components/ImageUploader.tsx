"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Loader2, ImagePlus } from "lucide-react";

export default function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (imgs: string[]) => void;
}) {
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Refs keep the global paste listener free of stale closures.
  const imagesRef = useRef(images);
  imagesRef.current = images;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const uploadFiles = async (files: File[]) => {
    const imgs = files.filter((f) => f.type.startsWith("image/"));
    if (imgs.length === 0) return;
    setUploading(true);
    const urls: string[] = [];
    for (const f of imgs) {
      const fd = new FormData();
      fd.append("file", f);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const d = await res.json();
        if (d.success) urls.push(d.url);
      } catch {
        /* skip failed file */
      }
    }
    setUploading(false);
    if (urls.length) onChangeRef.current([...imagesRef.current, ...urls]);
  };

  // Paste an image anywhere on the page → upload it.
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const files = Array.from(e.clipboardData?.items || [])
        .filter((it) => it.type.startsWith("image/"))
        .map((it) => it.getAsFile())
        .filter((f): f is File => !!f);
      if (files.length) {
        e.preventDefault();
        uploadFiles(files);
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, []);

  const addUrl = () => {
    const u = urlInput.trim();
    if (u && !imagesRef.current.includes(u)) {
      onChangeRef.current([...imagesRef.current, u]);
      setUrlInput("");
    }
  };

  const remove = (url: string) =>
    onChangeRef.current(imagesRef.current.filter((i) => i !== url));

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Hình ảnh
      </label>

      {/* Drop / paste / pick zone */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          uploadFiles(Array.from(e.dataTransfer.files));
        }}
        className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-200 py-6 text-center text-sm text-gray-500 hover:border-gray-300 hover:bg-gray-50"
      >
        {uploading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <ImagePlus className="h-5 w-5 text-gray-400" />
        )}
        <span>
          Dán ảnh (Ctrl+V), kéo-thả, hoặc <span className="underline">bấm chọn file</span>
        </span>
        <span className="text-xs text-gray-400">Thêm được nhiều ảnh</span>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) uploadFiles(Array.from(e.target.files));
            e.target.value = "";
          }}
        />
      </div>

      {/* Optional URL input */}
      <div className="mt-2 flex gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), addUrl())
          }
          placeholder="… hoặc dán URL ảnh rồi bấm Add"
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
        />
        <button
          type="button"
          onClick={addUrl}
          className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {images.map((url) => (
            <div key={url} className="group relative">
              <img
                src={url}
                alt=""
                className="h-20 w-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => remove(url)}
                className="absolute right-1 top-1 rounded-md bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
