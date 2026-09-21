import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { NEST_API_URL } from "@/lib/api";
import { getSessionToken } from "@/lib/session";

export async function GET(request: NextRequest) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ message: "Authentification requise." }, { status: 401 });
  }

  const placeId = request.nextUrl.searchParams.get("placeId") ?? "";
  const nestResponse = await fetch(
    `${NEST_API_URL}/places/details?placeId=${encodeURIComponent(placeId)}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
  );

  const text = await nestResponse.text();
  return new NextResponse(text, {
    status: nestResponse.status,
    headers: { "Content-Type": nestResponse.headers.get("Content-Type") ?? "application/json" },
  });
}
