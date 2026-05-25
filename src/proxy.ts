import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Allow unauthenticated admin routes
  if (
    pathname === "/login" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password"
  ) {
    return NextResponse.next();
  }

  // Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
