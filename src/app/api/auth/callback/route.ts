import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/utils";

// GET /api/auth/callback — handle Supabase auth redirect
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Strict gate: only allow-listed admin emails may proceed.
      if (!isAdminEmail(user?.email)) {
        await supabase.auth.signOut();
        return NextResponse.redirect(
          `${origin}/admin/login?error=not_authorized`,
        );
      }

      // First login → ensure the admin profile row exists.
      const adminClient = createAdminClient();
      await adminClient.from("admin_profiles").upsert(
        { id: user!.id, email: user!.email, role: "admin" },
        { onConflict: "id" },
      );

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/admin/login?error=auth_failed`);
}
