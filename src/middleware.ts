import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, locales } from "@/lib/i18n/config";
import { updateSession } from "@/lib/supabase/middleware";

function detectLocale(request: NextRequest): string {
  const cookie = request.cookies.get("osidac_locale")?.value;
  if (cookie && isLocale(cookie)) return cookie;

  const accept = request.headers.get("accept-language") ?? "";
  for (const part of accept.split(",")) {
    const code = part.split(";")[0].trim().slice(0, 2).toLowerCase();
    if (isLocale(code)) return code;
  }
  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  let response: NextResponse;

  if (!pathnameHasLocale) {
    const locale = detectLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
    response = NextResponse.redirect(url);
  } else {
    response = NextResponse.next();
  }

  try {
    return await updateSession(request, response);
  } catch {
    // Supabase unreachable (offline/dev) — serve the page without session refresh.
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
