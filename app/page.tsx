import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="legal-home">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <section className="hero">
        <div className="hero-visual" aria-hidden="true">
          <Image
            src="/images/hero-visual.png"
            alt=""
            fill
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
            className="hero-visual-img"
          />
          <div className="hero-visual-fade" />
        </div>

        <div className="hero-content">
          <p className="pill-badge">
            <span className="pill-dot" />
            L’app qui connecte les danseurs
          </p>

          <div className="hero-lockup">
            <Image
              src="/images/viewz-mark.png"
              alt="ViewZ"
              width={54}
              height={68}
              className="hero-mark"
            />
            <h1 className="hero-wordmark">ViewZ</h1>
          </div>
          <span className="hero-glow-bar" />

          <p className="hero-tagline">
            Danser ensemble,<br /><span>en toute confiance.</span>
          </p>
          <p className="home-intro hero-intro">
            Trouve des danseurs, des soirées et des scènes près de toi. Retrouve
            ici les règles d’utilisation de ViewZ et toutes les informations
            concernant la protection de tes données personnelles.
          </p>

          <div className="hero-actions">
            <a href="#informations-legales" className="btn-primary">
              Explorer les informations légales
            </a>
            <a href="mailto:gleam-pro@proton.me" className="btn-ghost">
              Nous contacter
            </a>
          </div>
        </div>
      </section>

      <section id="informations-legales" className="legal-hub">
        <p className="eyebrow section-eyebrow">VIEWZ · INFORMATIONS LÉGALES</p>
        <div className="legal-links">
          <Link href="/cgu" className="legal-card">
            <span className="card-index">01</span>
            <span><strong>Conditions générales</strong><small>Les règles d’utilisation de ViewZ</small></span>
            <span className="arrow">↗</span>
          </Link>
          <Link href="/politique-confidentialite" className="legal-card">
            <span className="card-index">02</span>
            <span><strong>Politique de confidentialité</strong><small>Comment tes données sont protégées</small></span>
            <span className="arrow">↗</span>
          </Link>
          <Link href="/securite-enfants" className="legal-card child-safety-card">
            <span className="card-index">03</span>
            <span><strong>Sécurité des enfants</strong><small>Notre politique de protection des mineurs</small></span>
            <span className="arrow">↗</span>
          </Link>
        </div>
        <p className="home-contact">Une question ? <a href="mailto:gleam-pro@proton.me">gleam-pro@proton.me</a></p>
        <Link href="/suppression-compte" className="deletion-link">Demander la suppression de mon compte</Link>
      </section>
    </main>
  );
}
