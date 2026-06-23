import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const bodySchema = z.object({ url: z.string().url() });

// POST /api/videos/from-url — admin only.
// Adds a TikTok video via the official oEmbed API (no scraping, not bot-blocked).
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile)
    return NextResponse.json(
      { success: false, error: "Not an admin" },
      { status: 403 },
    );

  const body = bodySchema.safeParse(await request.json());
  if (!body.success)
    return NextResponse.json(
      { success: false, error: "Link không hợp lệ" },
      { status: 400 },
    );

  const url = body.data.url;
  if (!url.includes("tiktok.com"))
    return NextResponse.json(
      { success: false, error: "Hiện chỉ hỗ trợ link TikTok" },
      { status: 400 },
    );

  // Official oEmbed — returns title, author_name, thumbnail_url
  let oembed: {
    title?: string;
    author_name?: string;
    thumbnail_url?: string;
  };
  try {
    const res = await fetch(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) throw new Error(`oEmbed HTTP ${res.status}`);
    oembed = await res.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Không lấy được dữ liệu video từ TikTok" },
      { status: 502 },
    );
  }

  const video = {
    title: (oembed.title || "TikTok video").slice(0, 300),
    platform: "tiktok" as const,
    platform_url: url,
    embed_url: null,
    thumbnail_url: oembed.thumbnail_url ?? null,
    author_name: oembed.author_name ?? null,
    is_active: true,
  };

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("videos")
    .insert(video)
    .select()
    .single();

  if (error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );

  return NextResponse.json({ success: true, data }, { status: 201 });
}
