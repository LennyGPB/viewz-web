import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { NEST_API_URL } from "@/lib/api";
import { getSessionToken } from "@/lib/session";

// Relaie vers /admin/* côté NestJS en ajoutant le token depuis le cookie
// httpOnly (jamais exposé au navigateur). NestJS reste la seule autorité :
// AdminGuard y revérifie le rôle ADMIN sur chaque route, quoi qu'il arrive ici.
async function proxyToAdminApi(request: NextRequest, path: string[]) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ message: "Authentification requise." }, { status: 401 });
  }

  const hasBody = request.method !== "GET" && request.method !== "DELETE";
  const search = request.nextUrl.search;
  const nestResponse = await fetch(`${NEST_API_URL}/admin/${path.join("/")}${search}`, {
    method: request.method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
    },
    body: hasBody ? await request.text() : undefined,
    cache: "no-store",
  });

  const text = await nestResponse.text();
  return new NextResponse(text, {
    status: nestResponse.status,
    headers: { "Content-Type": nestResponse.headers.get("Content-Type") ?? "application/json" },
  });
}

export async function GET(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxyToAdminApi(request, path);
}

export async function DELETE(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxyToAdminApi(request, path);
}

export async function POST(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxyToAdminApi(request, path);
}

export async function PATCH(request: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxyToAdminApi(request, path);
}
