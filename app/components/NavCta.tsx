import Link from "next/link";
import { getCurrentUser } from "@/lib/session";

// Isolé dans son propre composant serveur (async) pour être enveloppé dans un
// <Suspense> côté Navbar : seule cette petite portion attend la vérification
// de session, le reste de la page (contenu légal, hero...) continue de
// streamer/se pré-rendre sans être bloqué par cet appel réseau.
export default async function NavCta() {
  const user = await getCurrentUser();

  if (user?.role === "ADMIN") {
    return <Link href="/admin" className="nav-cta nav-cta-admin">Administration</Link>;
  }

  return <Link href="/login" className="nav-cta nav-cta-ghost">Connexion</Link>;
}
