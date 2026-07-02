import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

// Public marketplace pages, viewable whether logged in or not.
const OPEN_PATHS = ["/", "/search", "/clinics"];

// Only reachable when signed out of the matching realm.
const CLINIC_AUTH_ONLY_PATHS = ["/login", "/register"];
const PATIENT_AUTH_ONLY_PATHS = ["/patient/login", "/patient/register"];

const PATIENT_PREFIX = "/patient";

/** Path-segment-aware prefix match: "/patients" must not match the "/patient" prefix. */
function matchesPath(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const role = req.auth?.user?.role;

  const isOpenPath = OPEN_PATHS.some((path) => matchesPath(pathname, path));
  if (isOpenPath) {
    return NextResponse.next();
  }

  const isPatientAuthOnly = PATIENT_AUTH_ONLY_PATHS.some((path) => matchesPath(pathname, path));
  if (isPatientAuthOnly) {
    if (role === "patient") {
      return NextResponse.redirect(new URL("/patient/appointments", nextUrl.origin));
    }
    return NextResponse.next();
  }

  const isPatientArea = matchesPath(pathname, PATIENT_PREFIX);
  if (isPatientArea) {
    if (role !== "patient") {
      return NextResponse.redirect(new URL("/patient/login", nextUrl.origin));
    }
    return NextResponse.next();
  }

  const isClinicAuthOnly = CLINIC_AUTH_ONLY_PATHS.some((path) => matchesPath(pathname, path));
  if (isClinicAuthOnly) {
    if (role === "clinic") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
    }
    return NextResponse.next();
  }

  if (role !== "clinic") {
    return NextResponse.redirect(new URL("/login", nextUrl.origin));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
