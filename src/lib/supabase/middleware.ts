import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminEmail } from "@/lib/utils";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  // Skip auth check during build / when Supabase is not configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return supabaseResponse;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = isAdminEmail(user?.email);

  // Protect /admin routes (except /admin/login): must be a logged-in allow-listed admin
  if (isAdminRoute && !isLoginPage && !isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    if (user) url.searchParams.set("error", "not_authorized");
    return NextResponse.redirect(url);
  }

  // If an allow-listed admin is on the login page, send them to the dashboard
  if (isLoginPage && isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.searchParams.delete("error");
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
