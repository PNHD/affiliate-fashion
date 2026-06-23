import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { productUpdateSchema } from "@/lib/validations";

// Helper: ensure admin
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized", status: 401 };

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile) return { error: "Not an admin", status: 403 };

  return { user, supabase };
}

// GET /api/products/[id] — public, single product with linked videos
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    return NextResponse.json(
      { success: false, error: "Product not found" },
      { status: 404 },
    );
  }

  // Fetch linked videos
  const { data: videoLinks } = await supabase
    .from("video_products")
    .select("video_id, videos(*)")
    .eq("product_id", id);

  const videos = videoLinks?.map((vp) => vp.videos).filter(Boolean) || [];

  return NextResponse.json({ success: true, data: { ...product, videos } });
}

// PATCH /api/products/[id] — admin only
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const admin = await requireAdmin();
  if ("error" in admin) {
    return NextResponse.json(
      { success: false, error: admin.error },
      { status: admin.status },
    );
  }

  const body = productUpdateSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json(
      { success: false, error: body.error.issues[0].message },
      { status: 400 },
    );
  }

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("products")
    .update(body.data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, data });
}

// DELETE /api/products/[id] — admin only
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const admin = await requireAdmin();
  if ("error" in admin) {
    return NextResponse.json(
      { success: false, error: admin.error },
      { status: admin.status },
    );
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("products").delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, message: "Deleted" });
}
