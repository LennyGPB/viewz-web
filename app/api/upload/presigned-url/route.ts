import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { NEST_API_URL } from "@/lib/api";
import { getSessionToken } from "@/lib/session";

// Prépare un upload direct navigateur -> R2 : NestJS renvoie une URL signée,
// puis le PUT du fichier se fait depuis le navigateur (les octets ne
// transitent jamais par ce serveur Next).
export async function POST(request: NextRequest) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ message: "Authentification requise." }, { status: 401 });
  }

  const body = await request.text();
  const nestResponse = await fetch(`${NEST_API_URL}/upload/presigned-url`, {
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
