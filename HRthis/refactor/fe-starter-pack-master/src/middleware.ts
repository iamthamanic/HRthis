// TODO: use exported config file instead hard coded strings

import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { settings } from "./config/settings";

export async function middleware(request: NextRequest) {
  // Skip Next.js internal requests
  if (request.nextUrl.pathname.startsWith("/_next")) {
    return NextResponse.next();
  }
  const path = request.nextUrl.pathname;
  // Get the token using next-auth/jwt
  const token = await getToken({
    req: request,
    secret: settings.nextAuthSecret,
  });
  const isLoggedIn = !!token;
  const userRole = token?.role;

  // Handle root and auth pages for logged in users
  if (isLoggedIn) {
    // Redirect from root or auth pages to appropriate dashboard
    if (path === "/" || path.startsWith("/auth/")) {
      const url = new URL(`${settings.dashboardPage}`, request.url);
      return NextResponse.redirect(url);
    }
  } else {
    // Handle non-logged in users
    if (
      path.startsWith(settings.dashboardPage) ||
      path.startsWith(settings.accountPage)
    ) {
      const loginUrl = new URL(settings.authPage, request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Admin page protection
  if (path.startsWith(settings.adminPage)) {
    if (!isLoggedIn) {
      const loginUrl = new URL(settings.authPage, request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)", // Match all paths except Next.js internals
  ],
};
