import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


import { decrypt } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const session = request.cookies.get("admin_session")?.value;

  // Protected routes
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await decrypt(session);
    } catch (error) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Redirect to admin dashboard if already logged in and trying to access login
  if (request.nextUrl.pathname.startsWith("/admin/login")) {
    if (session) {
      try {
        await decrypt(session);
        return NextResponse.redirect(new URL("/admin", request.url));
      } catch (error) {
        // Token invalid, allow them to stay on login page
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
