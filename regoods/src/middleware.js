import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// This must match exactly what is in src/lib/auth.js
const AUTH_SECRET = process.env.NEXTAUTH_SECRET || "fallback_dev_secret_key_123";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // 1. Skip middleware for API auth routes, static files, and images
  if (
    pathname.startsWith("/api/auth") || 
    pathname.startsWith("/_next") || 
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ 
    req, 
    secret: AUTH_SECRET 
    });

  // Redirect authenticated users away from login/register
  if (pathname.startsWith("/auth") && token) {
    const dashboardUrl = new URL(token.role === "admin" ? "/admin" : "/account", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // 2. Protect sensitive routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/account") || pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/auth/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
    
    // Strict Admin-only protection for all /admin routes
    if (pathname.startsWith("/admin")) {
      if (token.role !== "admin") {
        console.warn(`Unauthorized admin access attempt by ${token.email} to ${pathname}`);
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/account/:path*", "/account", "/dashboard/:path*", "/dashboard", "/auth/:path*", "/auth"],
};
