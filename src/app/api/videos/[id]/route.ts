import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { videoUpdateSchema } from "@/lib/validations";

// GET /api/videos/[id] — public, video with linked products
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: video, error } = await supabase
    .from("videos")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !video) {
    return NextResponse.json(
      { success: false, error: "Video not found" },
      { status: 404 },
    );
  }

  const { data: productLinks } = await supabase
    .from("video_products")
    .select("product_id, products(*)")
    .eq("video_id", id)
    .order("position");

  const products = productLinks?.map((vp) => vp.products).filter(Boolean) || [];

  return NextResponse.json({ success: true, data: { ...video, products } });
}

// PATCH /api/videos/[id] — admin only
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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

  const body = videoUpdateSchema.safeParse(await request.json());
  if (!body.success)
    return NextResponse.json(
      { success: false, error: body.error.issues[0].message },
      { status: 400 },
    );

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("videos")
    .update(body.data)
    .eq("id", id)
    .select()
    .single();

  if (error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );

  return NextResponse.json({ success: true, data });
}

// DELETE /api/videos/[id] — admin only
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("videos").delete().eq("id", id);

  if (error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );

  return NextResponse.json({ success: true, message: "Deleted" });
}
