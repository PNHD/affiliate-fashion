export function cn(...inputs: (string | boolean | undefined | null)[]): string {
  return inputs.filter(Boolean).join(" ");
}

export function formatPrice(price: number | null, currency = "VND"): string {
  if (price == null) return "Liên hệ";
  if (currency === "VND") {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + "…";
}

export function getSourceLabel(type: string): string {
  switch (type) {
    case "shopee":
      return "Shopee";
    case "tiktok":
      return "TikTok";
    case "lazada":
      return "Lazada";
    case "manual":
      return "Manual";
    default:
      return type;
  }
}

export function getSourceColor(type: string): string {
  switch (type) {
    case "shopee":
      return "bg-orange-100 text-orange-700";
    case "tiktok":
      return "bg-slate-100 text-slate-700";
    case "lazada":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}
