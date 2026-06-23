import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { productSchema } from "@/lib/validations";

// GET /api/products — public, list active products
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;

  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const category = searchParams.get("category");
  const sourceType = searchParams.get("source_type");
  const videoId = searchParams.get("video_id");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "newest";
  const offset = (page - 1) * limit;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("is_active", true);

  if (category) query = query.eq("category", category);
  if (sourceType) query = query.eq("source_type", sourceType);
  if (videoId) query = query.eq("video_id", videoId);
  if (search) query = query.ilike("title", `%${search}%`);

  switch (sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "popular":
      query = query.order("click_count", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    data,
    pagination: { page, limit, total: count },
  });
}

// POST /api/products — admin only, create product
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json(
      { success: false, error: "Not an admin" },
      { status: 403 },
    );
  }

  const body = productSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json(
      { success: false, error: body.error.issues[0].message },
      { status: 400 },
    );
  }

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("products")
    .insert(body.data)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, data }, { status: 201 });
}
