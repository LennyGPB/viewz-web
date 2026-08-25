import Link from "next/link";

export default function Home() {
  return <main className="legal-home"><div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <section className="home-card"><div className="brand-mark">V</div><p className="eyebrow">VIEWZ · INFORMATIONS LÉGALES</p>
      <h1>Danser ensemble,<br /><span>en toute confiance.</span></h1>
      <p className="home-intro">Retrouve ici les règles d’utilisation de ViewZ et toutes les informations concernant la protection de tes données personnelles.</p>
      <div className="legal-links">
        <Link href="/cgu" className="legal-card"><span className="card-index">01</span><span><strong>Conditions générales</strong><small>Les règles d’utilisation de ViewZ</small></span><span className="arrow">↗</span></Link>
        <Link href="/politique-confidentialite" className="legal-card"><span className="card-index">02</span><span><strong>Politique de confidentialité</strong><small>Comment tes données sont protégées</small></span><span className="arrow">↗</span></Link>
      </div><p className="home-contact">Une question ? <a href="mailto:gleam-pro@proton.me">gleam-pro@proton.me</a></p>
      <Link href="/suppression-compte" className="deletion-link">Demander la suppression de mon compte</Link>
    </section>
  </main>;
}
