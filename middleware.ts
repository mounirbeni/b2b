import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

// Public marketplace pages, viewable whether logged in or not.
const OPEN_PATHS = ["/", "/search", "/clinics", "/terms", "/privacy"];

// Only reachable when signed out of the matching realm.
const CLINIC_AUTH_ONLY_PATHS = ["/login", "/register"];
const PATIENT_AUTH_ONLY_PATHS = ["/patient/login", "/patient/register"];

const PATIENT_PREFIX = "/patient";
const ADMIN_PREFIX = "/admin";

type Role = "clinic" | "patient" | "admin" | undefined;

/** Path-segment-aware prefix match: "/patients" must not match the "/patient" prefix. */
function matchesPath(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/** Where a signed-in user actually belongs, used to avoid bouncing them through a login
 * page for a different role that would just bounce them again. */
function homeFor(role: Role): string {
  if (role === "clinic") return "/dashboard";
  if (role === "patient") return "/patient/appointments";
  if (role === "admin") return "/admin";
  return "/login";
}

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const role = req.auth?.user?.role as Role;

  const isOpenPath = OPEN_PATHS.some((path) => matchesPath(pathname, path));
  if (isOpenPath) {
    return NextResponse.next();
  }

  const isPatientAuthOnly = PATIENT_AUTH_ONLY_PATHS.some((path) => matchesPath(pathname, path));
  if (isPatientAuthOnly) {
    if (role === "patient") {
      return NextResponse.redirect(new URL(homeFor(role), nextUrl.origin));
    }
    return NextResponse.next();
  }

  const isPatientArea = matchesPath(pathname, PATIENT_PREFIX);
  if (isPatientArea) {
    if (role === "patient") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(role ? homeFor(role) : "/patient/login", nextUrl.origin));
  }

  const isAdminArea = matchesPath(pathname, ADMIN_PREFIX);
  if (isAdminArea) {
    if (role === "admin") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(homeFor(role), nextUrl.origin));
  }

  const isClinicAuthOnly = CLINIC_AUTH_ONLY_PATHS.some((path) => matchesPath(pathname, path));
  if (isClinicAuthOnly) {
    if (role === "clinic" || role === "admin") {
      return NextResponse.redirect(new URL(homeFor(role), nextUrl.origin));
    }
    return NextResponse.next();
  }

  // Everything else is the clinic dashboard.
  if (role !== "clinic") {
    return NextResponse.redirect(new URL(role ? homeFor(role) : "/login", nextUrl.origin));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
