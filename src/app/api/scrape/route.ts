import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { scrapeUrl } from "@/lib/scraper";
import { scrapeRequestSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    // Auth check — only admin
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

    // Check admin role
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

    // Validate input
    const body = scrapeRequestSchema.safeParse(await request.json());
    if (!body.success) {
      return NextResponse.json(
        { success: false, error: body.error.issues[0].message },
        { status: 400 },
      );
    }

    // Scrape
    const result = await scrapeUrl(body.data.url);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Scraping failed",
      },
      { status: 500 },
    );
  }
}
