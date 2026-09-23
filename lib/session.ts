import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { NEST_API_URL } from "./api";

export const SESSION_COOKIE = "viewz_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 jours, aligné sur l'expiration du JWT côté API

export interface SessionUser {
  id: string;
  email: string;
  username: string;
  role: "USER" | "ORGANIZER" | "ADMIN";
  [key: string]: unknown;
}

// À utiliser uniquement dans des Server Components / Route Handlers (jamais
// dans un composant client) : lit le token depuis le cookie httpOnly.
export async function getSessionToken() {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

// Revalide systématiquement le rôle auprès de l'API (source de vérité), le
// token seul ne suffit pas à faire confiance à un rôle potentiellement
// périmé (utilisateur rétrogradé entre deux sessions par ex.).
// cache() : un seul appel à l'API par requête, même si plusieurs composants
// (bouton de la navbar desktop + menu mobile) le demandent.
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const token = await getSessionToken();
  if (!token) return null;

  try {
    const response = await fetch(`${NEST_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as SessionUser;
  } catch {
    return null;
  }
});

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }
  return user;
}
