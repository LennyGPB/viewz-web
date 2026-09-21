import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { NEST_API_URL } from "@/lib/api";
import { getSessionToken } from "@/lib/session";

// Relaie vers /places/autocomplete côté NestJS, qui lui-même proxifie
// l'API Google Places avec sa propre clé serveur : aucune clé Google n'a
// donc besoin d'être exposée au navigateur.
export async function GET(request: NextRequest) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ message: "Authentification requise." }, { status: 401 });
  }

  const input = request.nextUrl.searchParams.get("input") ?? "";
  const nestResponse = await fetch(
    `${NEST_API_URL}/places/autocomplete?input=${encodeURIComponent(input)}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
  );

  const text = await nestResponse.text();
  return new NextResponse(text, {
    status: nestResponse.status,
    headers: { "Content-Type": nestResponse.headers.get("Content-Type") ?? "application/json" },
  });
}
