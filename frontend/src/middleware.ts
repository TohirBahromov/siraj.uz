import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOCALES, DEFAULT_LOCALE } from "@/i18n/config";

function detectLocale(request: NextRequest): string {
  const acceptLang = request.headers.get("accept-language") ?? "";
  const preferred = acceptLang
    .split(",")
    .map((s) => s.split(";")[0].trim().toLowerCase());

  for (const lang of preferred) {
    const exact = LOCALES.find((l) => l === lang);
    if (exact) return exact;
    const prefix = LOCALES.find((l) => lang.startsWith(l));
    if (prefix) return prefix;
  }
  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (pathnameHasLocale) return NextResponse.next();

  const locale = detectLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|woff2?|ttf|otf)).*)",
  ],
};
