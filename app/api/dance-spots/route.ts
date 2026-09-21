import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { NEST_API_URL } from "@/lib/api";
import { getSessionToken } from "@/lib/session";

// Création de spot. NestJS exige déjà le rôle ADMIN (dance-spots.controller.ts) ;
// ce portail web n'ouvre de session qu'aux comptes ADMIN, donc en pratique
// seuls les admins atteignent cette route.
export async function POST(request: NextRequest) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ message: "Authentification requise." }, { status: 401 });
  }

  const body = await request.text();
  const nestResponse = await fetch(`${NEST_API_URL}/dance-spots`, {
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
