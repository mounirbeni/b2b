import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

// Only reachable when signed out; a logged-in clinic owner is bounced to "/".
const AUTH_ONLY_PATHS = ["/login", "/register"];

// Public marketplace pages, viewable whether logged in or not.
const OPEN_PATHS = ["/search", "/clinics"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname;

  const isOpenPath = OPEN_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  if (isOpenPath) {
    return NextResponse.next();
  }

  const isAuthOnlyPath = AUTH_ONLY_PATHS.some((path) => pathname.startsWith(path));

  if (!isLoggedIn && !isAuthOnlyPath) {
    const loginUrl = new URL("/login", nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isAuthOnlyPath) {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
