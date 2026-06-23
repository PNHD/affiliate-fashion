import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { settingsSchema } from "@/lib/validations";

// GET /api/settings — public (creator header)
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );

  return NextResponse.json({ success: true, data });
}

// PUT /api/settings — admin only
export async function PUT(request: NextRequest) {
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

  const body = settingsSchema.safeParse(await request.json());
  if (!body.success)
    return NextResponse.json(
      { success: false, error: body.error.issues[0].message },
      { status: 400 },
    );

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("site_settings")
    .update(body.data)
    .eq("id", 1)
    .select()
    .single();

  if (error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );

  return NextResponse.json({ success: true, data });
}
