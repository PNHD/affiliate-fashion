import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// GET /api/auth/callback — handle Supabase auth redirect
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Auto-create admin profile if first login + email in allowlist
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        const adminClient = createAdminClient();
        const allowedEmails = (process.env.ADMIN_EMAILS || "")
          .split(",")
          .map((e) => e.trim().toLowerCase());

        if (allowedEmails.includes(user.email.toLowerCase())) {
          await adminClient.from("admin_profiles").upsert(
            { id: user.id, email: user.email, role: "admin" },
            { onConflict: "id" },
          );
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/admin/login?error=auth_failed`);
}
