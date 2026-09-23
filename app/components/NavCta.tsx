import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { btnGradient, cx } from "@/lib/ui";

export const navCtaBase = "inline-flex items-center justify-center gap-1.5 rounded-full font-extrabold tracking-[.01em] no-underline";
export const navCtaSizes = {
  sm: "px-4 py-2 text-xs", // navbar desktop
  lg: "w-full px-6 py-4 text-sm", // menu mobile
};

// Isolé dans son propre composant serveur (async) pour être enveloppé dans un
// <Suspense> côté Navbar : seule cette petite portion attend la vérification
// de session, le reste de la page (contenu légal, hero...) continue de
// streamer/se pré-rendre sans être bloqué par cet appel réseau.
export default async function NavCta({ size = "sm" }: { size?: keyof typeof navCtaSizes }) {
  const user = await getCurrentUser();
  const base = cx(navCtaBase, navCtaSizes[size]);

  if (user?.role === "ADMIN") {
    return (
      <Link href="/admin" className={cx(base, btnGradient, "shadow-[0_6px_18px_rgba(124,58,237,.35)] hover:-translate-y-px")}>
        Administration
      </Link>
    );
  }

  return (
    <Link href="/login" className={cx(base, "border border-white/18 text-lavender hover:border-brand/60 hover:bg-purple/8")}>
      Connexion
    </Link>
  );
}
