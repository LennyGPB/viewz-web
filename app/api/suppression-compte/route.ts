const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const requests = new Map<string, number>();

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const lastRequest = requests.get(ip) ?? 0;
  if (Date.now() - lastRequest < 60_000) return Response.json({ error: "Une demande a déjà été envoyée récemment." }, { status: 429 });

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || body.website) return Response.json({ error: "Requête invalide." }, { status: 400 });
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const reason = typeof body.reason === "string" ? body.reason.trim() : "";
  if (!EMAIL_PATTERN.test(email) || email.length > 254 || username.length < 2 || username.length > 50 || reason.length > 1000 || body.confirmed !== "yes") {
    return Response.json({ error: "Vérifie les informations saisies." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return Response.json({ error: "Le service d’envoi n’est pas encore configuré." }, { status: 503 });

  const sent = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "User-Agent": "ViewZ-Web/1.0" }, body: JSON.stringify({
    from: `ViewZ <${from}>`, to: ["gleam-pro@proton.me"], reply_to: email,
    subject: `Demande de suppression de compte — ${username}`,
    text: `Nouvelle demande de suppression de compte ViewZ\n\nEmail du compte : ${email}\nNom d’utilisateur : ${username}\nMotif : ${reason || "Non renseigné"}\n\nLa demande doit être vérifiée avant toute suppression.`,
  }) });
  if (!sent.ok) { console.error("Resend error", sent.status, await sent.text()); return Response.json({ error: "Impossible d’envoyer la demande pour le moment." }, { status: 502 }); }
  requests.set(ip, Date.now());
  return Response.json({ success: true });
}
