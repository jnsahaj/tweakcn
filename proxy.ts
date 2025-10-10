import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { API_AUTH_PREFIX, DEFAULT_LOGIN_REDIRECT } from "./routes";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const pathname = request.nextUrl.pathname;

  const isApiAuth = pathname.startsWith(API_AUTH_PREFIX);

  if (isApiAuth) {
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url));
  }

  if (session) {
    // Redirect logged-in users from /dashboard or /settings (root) to /settings/themes
    if (pathname === "/dashboard" || pathname === "/settings") {
      return NextResponse.redirect(new URL("/settings/themes", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/editor/theme/:themeId", "/dashboard", "/settings/:path*", "/success"],
};
