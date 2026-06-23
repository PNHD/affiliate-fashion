import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { clickEventSchema } from "@/lib/validations";

// POST /api/click — track affiliate click (public)
export async function POST(request: NextRequest) {
  const body = clickEventSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json(
      { success: false, error: body.error.issues[0].message },
      { status: 400 },
    );
  }

  const adminClient = createAdminClient();
  const userAgent = request.headers.get("user-agent") || "";
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
  const referrer = body.data.referrer || request.headers.get("referer") || "";

  const { error } = await adminClient.from("click_events").insert({
    product_id: body.data.product_id,
    user_agent: userAgent,
    ip_address: ip,
    referrer,
  });

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
