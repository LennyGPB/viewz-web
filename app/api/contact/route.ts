import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CONTACT_LIMITS, CONTACT_SUBJECTS } from "@/lib/contact";
import { sendTelegramMessage } from "@/lib/telegram";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Limite simple en mémoire : 3 messages par IP toutes les 10 minutes.
// Suffisant contre un envoi en boucle ; elle repart de zéro à chaque redémarrage.
const RATE_LIMIT = { max: 3, windowMs: 10 * 60_000 };
const recentByIp = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (recentByIp.get(ip) ?? []).filter((time) => now - time < RATE_LIMIT.windowMs);
  if (recent.length >= RATE_LIMIT.max) return true;
  recentByIp.set(ip, [...recent, now]);
  return false;
}

const badRequest = (message: string) => NextResponse.json({ message }, { status: 400 });

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return badRequest("Requête invalide.");

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const subject = String(body.subject ?? "");
  const message = String(body.message ?? "").trim();

  // Champ caché que seuls les robots remplissent : on fait semblant d'avoir envoyé.
  if (String(body.website ?? "") !== "") return NextResponse.json({ sent: true });

  if (!name || name.length > CONTACT_LIMITS.name) return badRequest("Indique ton nom.");
  if (!EMAIL_PATTERN.test(email) || email.length > CONTACT_LIMITS.email) return badRequest("Adresse email invalide.");
  if (!CONTACT_SUBJECTS.includes(subject as (typeof CONTACT_SUBJECTS)[number])) return badRequest("Choisis un sujet.");
  if (message.length < CONTACT_LIMITS.minMessage || message.length > CONTACT_LIMITS.message) {
    return badRequest(`Ton message doit faire entre ${CONTACT_LIMITS.minMessage} et ${CONTACT_LIMITS.message} caractères.`);
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnue";
  if (isRateLimited(ip)) {
    return NextResponse.json({ message: "Trop de messages envoyés. Réessaie dans quelques minutes." }, { status: 429 });
  }

  const text = [
    "✉️ Nouveau message du site ViewZ",
    `De : ${name} (${email})`,
    `Sujet : ${subject}`,
    "",
    message,
  ].join("\n");

  try {
    await sendTelegramMessage(text);
  } catch (error) {
    console.error("Formulaire de contact : envoi Telegram impossible", error);
    return NextResponse.json(
      { message: "L’envoi est temporairement indisponible. Écris-nous à gleam-pro@proton.me." },
      { status: 503 },
    );
  }

  return NextResponse.json({ sent: true });
}
