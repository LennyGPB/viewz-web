import type { Metadata } from "next";
import Link from "next/link";
import AccountDeletionForm from "./AccountDeletionForm";

export const metadata: Metadata = { title: "Suppression de compte" };

export default function AccountDeletionPage() {
  return <main className="legal-shell"><div className="ambient ambient-one" />
    <header className="legal-header"><div className="header-inner"><Link href="/" className="wordmark">ViewZ</Link><nav><Link href="/cgu">CGU</Link><Link href="/politique-confidentialite">Confidentialité</Link></nav></div></header>
    <div className="deletion-wrap">
      <section className="deletion-intro"><p className="eyebrow">GESTION DU COMPTE</p><h1>Demander la suppression de ton compte</h1><p>Envoie-nous ta demande avec l’adresse email liée à ton compte ViewZ. Nous vérifierons ton identité avant de procéder à la suppression.</p>
        <div className="deletion-note"><strong>Ce qui sera supprimé</strong><p>Ton profil, tes médias et les données associées à ton compte. Certaines données peuvent être conservées temporairement lorsque la loi l’exige.</p></div>
      </section>
      <AccountDeletionForm />
    </div>
  </main>;
}
