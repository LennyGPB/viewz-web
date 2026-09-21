import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "./lib/session";

// Contrôle "optimiste" : on ne vérifie que la présence du cookie de session
// pour éviter un aller-retour vers l'API sur chaque requête (voir doc Next).
// L'autorité réelle (rôle ADMIN valide) est revérifiée auprès de l'API dans
// app/admin/layout.tsx, et de toute façon systématiquement re-vérifiée par
// l'API NestJS elle-même (AdminGuard) sur chaque route /admin/*.
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_COOKIE);

  if (request.nextUrl.pathname.startsWith("/admin") && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (request.nextUrl.pathname === "/login" && hasSession) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
