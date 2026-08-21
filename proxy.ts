import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const PORTAL_PREFIXES = ["/dashboard", "/support", "/id-card"];
const ADMIN_PREFIXES = ["/admin"];
const ADMIN_PUBLIC_PATHS = ["/admin-login"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;

  if (ADMIN_PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  if (ADMIN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    if (!role || (role !== "ADMIN" && role !== "MODERATOR")) {
      return NextResponse.redirect(new URL("/admin-login", req.nextUrl));
    }
    return NextResponse.next();
  }

  if (PORTAL_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    if (!req.auth?.user) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|ico|webmanifest)$).*)",
  ],
};
