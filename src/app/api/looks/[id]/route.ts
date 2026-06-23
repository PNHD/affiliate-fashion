import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/looks/[id] — public. Returns a look (video) + its shoppable items
// in the shape the look-detail page expects: { video, products }.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: video, error } = await supabase
    .from("videos")
    .select("title, author_name, platform_url")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error || !video) {
    return NextResponse.json(
      { success: false, error: "Look not found" },
      { status: 404 },
    );
  }

  const { data: rows } = await supabase
    .from("products")
    .select("id, title, price, images, affiliate_url")
    .eq("video_id", id)
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  const products = (rows || []).map((p) => ({
    id: p.id,
    name: p.title,
    price: p.price ?? 0,
    images: p.images ?? [],
    sourceUrl: p.affiliate_url,
  }));

  return NextResponse.json({ success: true, data: { video, products } });
}
