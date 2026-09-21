import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { NEST_API_URL } from "@/lib/api";
import { getSessionToken } from "@/lib/session";

// Création d'événement. NestJS exige déjà le rôle ORGANIZER ou ADMIN
// (events.controller.ts) ; comme ce portail web ne délivre un cookie qu'aux
// comptes ADMIN (voir /api/auth/login), cette condition est toujours remplie ici.
export async function POST(request: NextRequest) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ message: "Authentification requise." }, { status: 401 });
  }

  const body = await request.text();
  const nestResponse = await fetch(`${NEST_API_URL}/events`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body,
    cache: "no-store",
  });

  const text = await nestResponse.text();
  return new NextResponse(text, {
    status: nestResponse.status,
    headers: { "Content-Type": nestResponse.headers.get("Content-Type") ?? "application/json" },
  });
}
