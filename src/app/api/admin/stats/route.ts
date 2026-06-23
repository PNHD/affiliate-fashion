import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// GET /api/admin/stats — admin dashboard stats
export async function GET() {
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

  const adminClient = createAdminClient();

  // Run all queries in parallel
  const [
    { count: totalProducts },
    { count: activeProducts },
    { count: totalVideos },
    { count: totalClicks },
    { count: clicksToday },
  ] = await Promise.all([
    adminClient.from("products").select("*", { count: "exact", head: true }),
    adminClient
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    adminClient.from("videos").select("*", { count: "exact", head: true }),
    adminClient
      .from("click_events")
      .select("*", { count: "exact", head: true }),
    adminClient
      .from("click_events")
      .select("*", { count: "exact", head: true })
      .gte("clicked_at", new Date().toISOString().split("T")[0]),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      totalProducts,
      activeProducts,
      totalVideos,
      totalClicks,
      clicksToday,
    },
  });
}
