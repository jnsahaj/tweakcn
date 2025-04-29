import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

import { apiAuthPrefix, DEFAULT_LOGIN_REDIRECT } from "./routes";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isApiAuth = request.nextUrl.pathname.startsWith(apiAuthPrefix);

  if (isApiAuth) {
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/editor/theme", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/editor/:path*", "/dashboard"],
};
