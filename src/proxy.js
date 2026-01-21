// proxy.js OR src/proxy.js
import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;
  console.log({token})
  // Allow public routes
   if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/images") ||
    pathname.endsWith(".css") ||
    pathname.endsWith(".js")
  ) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/register")) {
    return NextResponse.next();
  }
  // Protect dashboard
  if (!token && pathname.startsWith("/")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
