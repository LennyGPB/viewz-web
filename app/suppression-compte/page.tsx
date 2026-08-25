import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Suppression de compte" };

export default function AccountDeletionPage() {
  return <main className="legal-shell"><div className="ambient ambient-one" />
    <header className="legal-header"><div className="header-inner"><Link href="/" className="wordmark">ViewZ</Link><nav><Link href="/cgu">CGU</Link><Link href="/politique-confidentialite">Confidentialité</Link><Link href="/securite-enfants">Sécurité des enfants</Link></nav></div></header>
    <div className="deletion-wrap deletion-simple">
      <section className="deletion-intro"><p className="eyebrow">GESTION DU COMPTE</p><h1>Demander la suppression de ton compte</h1><p>Pour supprimer ton compte ViewZ, envoie simplement un email depuis l’adresse associée à ton compte. Indique ton nom d’utilisateur afin que nous puissions identifier et traiter ta demande.</p>
        <a className="email-button" href="mailto:gleam-pro@proton.me?subject=Demande%20de%20suppression%20de%20compte%20ViewZ">Écrire à gleam-pro@proton.me</a>
        <div className="deletion-note"><strong>Ce qui sera supprimé</strong><p>Ton profil, tes médias et les données associées à ton compte. Certaines données peuvent être conservées temporairement lorsque la loi l’exige.</p></div>
      </section>
    </div>
  </main>;
}
