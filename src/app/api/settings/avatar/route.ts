import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// POST /api/settings/avatar — admin only. Uploads to the public `assets`
// bucket via service role, saves the public URL into site_settings.
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

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File))
    return NextResponse.json(
      { success: false, error: "No file" },
      { status: 400 },
    );

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `avatar-${Date.now()}.${ext}`;
  const buffer = await file.arrayBuffer();

  const adminClient = createAdminClient();
  const { error: upErr } = await adminClient.storage
    .from("assets")
    .upload(path, buffer, { contentType: file.type, upsert: true });
  if (upErr)
    return NextResponse.json(
      { success: false, error: upErr.message },
      { status: 500 },
    );

  const {
    data: { publicUrl },
  } = adminClient.storage.from("assets").getPublicUrl(path);

  await adminClient
    .from("site_settings")
    .update({ avatar_url: publicUrl })
    .eq("id", 1);

  return NextResponse.json({ success: true, url: publicUrl });
}
