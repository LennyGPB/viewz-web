import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { NEST_API_URL } from "@/lib/api";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session";

export async function POST(request: Request) {
  let body: { email?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Requête invalide." }, { status: 400 });
  }

  if (typeof body.email !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ message: "Email et mot de passe requis." }, { status: 400 });
  }

  const nestResponse = await fetch(`${NEST_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: body.email, password: body.password }),
    cache: "no-store",
  });

  const data = await nestResponse.json().catch(() => null);

  if (!nestResponse.ok) {
    return NextResponse.json(
      { message: data?.message ?? "Identifiants incorrects." },
      { status: nestResponse.status },
    );
  }

  // Ce portail web n'est destiné qu'au back-office : on refuse d'ouvrir une
  // session à un compte qui n'est pas administrateur, même si les
  // identifiants sont valides côté API.
  if (data?.user?.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Ce compte n'a pas accès à l'administration." },
      { status: 403 },
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, data.access_token as string, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return NextResponse.json({ user: data.user });
}
