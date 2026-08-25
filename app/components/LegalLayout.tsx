import Link from "next/link";
import type { ReactNode } from "react";

export type LegalSection = { id: string; number: string; title: string; content: ReactNode };

export default function LegalLayout({ title, kicker, sections }: { title: string; kicker: string; sections: LegalSection[] }) {
  return <main className="legal-shell"><div className="ambient ambient-one" />
    <header className="legal-header"><div className="header-inner"><Link href="/" className="wordmark">ViewZ</Link><nav><Link href="/cgu">CGU</Link><Link href="/politique-confidentialite">Confidentialité</Link><Link href="/suppression-compte">Supprimer mon compte</Link></nav></div></header>
    <div className="legal-wrap"><aside className="legal-aside"><p className="eyebrow">{kicker}</p><h1>{title}</h1><p className="updated">Dernière mise à jour<br />19 août 2026</p><nav className="toc" aria-label="Sommaire">{sections.map((s) => <a key={s.id} href={`#${s.id}`}>{s.number} · {s.title}</a>)}</nav></aside>
      <article className="legal-content">{sections.map((s) => <section className="legal-section" id={s.id} key={s.id}><span className="article-number">ARTICLE {s.number}</span><h2>{s.title}</h2>{s.content}</section>)}</article>
    </div>
  </main>;
}
