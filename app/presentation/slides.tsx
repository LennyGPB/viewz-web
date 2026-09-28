"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ComponentType, type CSSProperties, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { btnGradient, container, cx, eyebrow } from "@/lib/ui";
import StoreBadges from "../components/StoreBadges";

export type SlideProps = { active: boolean; next: () => void };

type SlideDefinition = {
  id: string;
  label: string;
  background?: { src: string; className?: string; overlay: string };
  glow: { x: string; y: string; opacity?: number };
  Content: ComponentType<SlideProps>;
};

const INSTAGRAM_URL = "https://www.instagram.com/viewz_fr";
const SITE_URL = "https://viewz.fr";

// ------------------------------------------------------------------
// Briques communes
// ------------------------------------------------------------------

// Rang dans la cascade d'apparition (.deck-reveal / .deck-mask)
const d = (step: number) => ({ "--d": step }) as CSSProperties;

const title = "font-sans text-[clamp(46px,min(7.2vw,11vh),112px)] font-extrabold leading-[.92] tracking-[-.045em] text-white";
const gradientText = "bg-linear-to-r from-brand-pale via-brand-light to-[#ff5ad9] bg-clip-text pr-[.06em] font-display font-black tracking-[-.06em] text-transparent";
const lead = "text-[clamp(20px,2.1vw,30px)] font-semibold leading-[1.25] tracking-[-.01em] text-white";
const body = "text-base leading-relaxed text-muted lg:text-lg";

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx(container, "relative flex min-h-full flex-col justify-center pt-24 pb-44 lg:pt-28 lg:pb-40 lg:short:pt-[88px] lg:short:pb-[124px]", className)}>
      {children}
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className={cx(eyebrow, "deck-reveal flex items-center gap-3 uppercase")} style={d(0)}>
      <span className="h-px w-8 bg-brand-soft/70" />
      {children}
    </p>
  );
}

function Line({ step, children }: { step: number; children: ReactNode }) {
  return (
    <span className="deck-mask" style={d(step)}>
      <span>{children}</span>
    </span>
  );
}

function LiveDot() {
  return (
    <span className="relative flex size-2">
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-fuchsia-400 opacity-75" />
      <span className="relative inline-flex size-2 rounded-full bg-fuchsia-500" />
    </span>
  );
}

// ------------------------------------------------------------------
// 1. Couverture
// ------------------------------------------------------------------

function Cover({ active, next }: SlideProps) {
  return (
    <Frame className="justify-end lg:justify-center">
      <div className="max-w-[780px]">
        <Eyebrow>Dossier de présentation</Eyebrow>

        <h1 className="mt-5 font-display leading-none text-white">
          {/* Intro du logo de l'accueil (classes .hero-* de globals.css), rejouée à chaque retour sur la slide grâce à la key */}
          <span key={active ? "on" : "off"} className="-ml-[.06em] block pr-[.05em] text-[clamp(88px,17vw,220px)] font-black leading-[.95] tracking-[-.065em]">
            <span className="hero-view">View</span>
            <span className="relative inline-block">
              <span className="hero-z">Z</span>
              <span className="hero-z-move" aria-hidden="true">
                <span className="hero-z-glitch">
                  <Image src="/images/viewz-mark.png" alt="" width={396} height={441} preload className="hero-z-logo" />
                </span>
              </span>
            </span>
          </span>
        </h1>

        <p className="mt-3 max-w-[640px] text-[clamp(22px,2.7vw,40px)] leading-[1.12] font-light tracking-[-.01em] text-white/90">
          <Line step={4}>
            {/* pr élargi : en italique, le « s » final dépasse de la boîte et serait coupé par le bg-clip-text */}
            Le réseau pour les <strong className={cx(gradientText, "font-black italic pr-[.2em]!")}>danseurs</strong>
          </Line>
        </p>

        <div className="deck-reveal mt-10 flex flex-wrap items-center gap-4" style={d(7)}>
          <button
            type="button"
            onClick={next}
            className={cx(
              btnGradient,
              "group inline-flex items-center gap-3 rounded-full py-3.5 pr-4 pl-6 text-sm shadow-[0_14px_50px_-12px_rgba(169,112,255,.9)] transition hover:shadow-[0_14px_60px_-6px_rgba(169,112,255,1)]",
            )}
          >
            Découvrir
            <span className="flex size-7 items-center justify-center rounded-full bg-white/20 transition group-hover:translate-x-1">
              <svg {...iconProps} width={14} height={14} strokeWidth={2.4}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </span>
          </button>
          <span className="text-xs font-semibold tracking-[.14em] text-white/45 uppercase">iOS · Android</span>
        </div>
      </div>
    </Frame>
  );
}

// ------------------------------------------------------------------
// 2. C'est quoi ViewZ ?
// ------------------------------------------------------------------

const PILLARS = [
  { label: "Partenaires", icon: <svg {...iconProps}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
  { label: "Events & spots", icon: <svg {...iconProps}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg> },
  { label: "Communauté", icon: <svg {...iconProps}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg> },
];

const PHONE_SCREENS = [
  { src: "/images/dossiers/screen_cartes.jpg", alt: "Écran carte de l’application ViewZ" },
  { src: "/images/dossiers/screen_dn.jpg", alt: "Écran « Je danse maintenant ! » de l’application ViewZ" },
  { src: "/images/dossiers/screen_events.jpg", alt: "Écran événements de l’application ViewZ" },
  { src: "/images/dossiers/screen_home.jpg", alt: "Écran d’accueil de l’application ViewZ" },
];
const PHONE_INTERVAL = 3000; // ms entre deux écrans

// Téléphone dont l'écran change toutes les 3 s : la nouvelle capture apparaît en
// fondu avec un léger zoom, et le téléphone fait une petite pulsation (.deck-screen / .deck-phone-bump).
function Phone({ active }: { active: boolean }) {
  const [screen, setScreen] = useState(0);
  const [changes, setChanges] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      setScreen((current) => (current + 1) % PHONE_SCREENS.length);
      setChanges((count) => count + 1);
    }, PHONE_INTERVAL);
    return () => window.clearInterval(id);
  }, [active]);

  return (
    <div className="relative mx-auto w-[min(330px,68vw,36vh)]">
      {/* Deux classes identiques en alternance : changer de nom d'animation la relance */}
      <div
        className={cx(
          "relative aspect-[9/17.5] rounded-[50px] border border-white/15 bg-black p-2.5 shadow-[0_50px_140px_-30px_rgba(169,112,255,.75)]",
          changes > 0 && (changes % 2 ? "deck-phone-bump-a" : "deck-phone-bump-b"),
        )}
      >
        <div className="relative size-full overflow-hidden rounded-[41px] bg-black">
          {PHONE_SCREENS.map((item, i) => (
            <Image
              key={item.src}
              src={item.src}
              alt={i === screen ? item.alt : ""}
              fill
              sizes="330px"
              quality={90}
              data-active={i === screen}
              className="deck-screen object-cover object-top"
            />
          ))}
          <div className="absolute top-2.5 left-1/2 h-6 w-[96px] -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>
    </div>
  );
}

function Concept({ active }: SlideProps) {
  return (
    <Frame>
      <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_.85fr] lg:gap-20">
        <div>
          <h2 className={title}>
            <Line step={1}>C’est quoi</Line>
            <Line step={2}>
              <span className={gradientText}>ViewZ</span> ?
            </Line>
          </h2>

          <p className={cx(lead, "deck-reveal mt-8 max-w-[580px] short:mt-5")} style={d(4)}>
            ViewZ est une application mobile qui{" "}
            <span className="rounded-md bg-linear-to-r from-brand-from/45 to-brand-to/45 box-decoration-clone px-1.5">connecte les danseurs</span>{" "}
            entre eux.
          </p>
          <p className={cx(body, "deck-reveal mt-5 max-w-[580px]")} style={d(5)}>
            Disponible sur <strong className="text-white">iOS et Android</strong>, elle permet à chaque danseur de trouver des partenaires,
            découvrir des événements et des spots de danse, et s’intégrer à une communauté active près de chez lui.
          </p>

          <ul className="mt-9 short:mt-6 grid max-w-[580px] grid-cols-3 gap-2.5 sm:gap-3">
            {PILLARS.map((pillar, i) => (
              <li key={pillar.label} className="deck-reveal" style={d(6 + i)}>
                <div className="flex h-full flex-col gap-3 short:lg:flex-row short:lg:items-center rounded-2xl border border-line bg-white/4 p-3.5 transition duration-300 hover:border-brand/50 hover:bg-brand/8 sm:p-4">
                  <span className="text-brand-light">{pillar.icon}</span>
                  <span className="text-xs font-bold text-white sm:text-sm">{pillar.label}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="deck-reveal" style={d(3)}>
          <Phone active={active} />
        </div>
      </div>
    </Frame>
  );
}

// ------------------------------------------------------------------
// 3. Les fonctionnalités
// ------------------------------------------------------------------

type Feature = { title: string; description: string; details: string; icon: ReactNode; live?: boolean };

const FEATURES: Feature[] = [
  {
    title: "Annonces",
    description: "Poster des annonces pour trouver un partenaire ou un crew.",
    details:
      "Tu décris ce que tu cherches : un partenaire de battle, un duo pour un showcase, un crew à rejoindre. Tu précises ton style, ton niveau, ta ville. Les danseurs près de toi voient ton annonce et peuvent te répondre directement en messagerie privée.",
    icon: <svg {...iconProps}><path d="m3 11 18-5v12L3 14v-3Z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>,
  },
  {
    title: "Messagerie",
    description: "Messagerie privée entre danseurs.",
    details:
      "Quand un danseur répond à ton annonce, une conversation privée s’ouvre automatiquement. Tu peux discuter, organiser une session, partager des infos. La carte de l’annonce apparaît en premier message pour garder le contexte.",
    icon: <svg {...iconProps}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" /></svg>,
  },
  {
    title: "Carte interactive",
    description: "Danseurs et spots de danse à proximité.",
    details:
      "Une carte en temps réel qui affiche les danseurs et les spots de danse autour de toi. Les danseurs apparaissent en violet, les spots en rose. Tu peux filtrer par style ou par type de spot (studio, parc, salle, rue).",
    icon: <svg {...iconProps}><path d="m9 3-6 3v15l6-3 6 3 6-3V3l-6 3-6-3Z" /><path d="M9 3v15M15 6v15" /></svg>,
  },
  {
    title: "Statut en temps réel",
    description: "Voir qui danse maintenant.",
    details:
      "Tu actives le statut « Je danse maintenant » et tu apparais sur la carte avec ta localisation. Les autres danseurs près de toi te voient en direct et peuvent te rejoindre ou t’envoyer un message. Le statut expire automatiquement après quelques heures.",
    live: true,
    icon: <svg {...iconProps}><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" /></svg>,
  },
  {
    title: "Événements & battles",
    description: "Découverte d’événements et battles près de soi.",
    details:
      "Tous les événements danse près de toi au même endroit : battles, showcases, cours, workshops. Tu filtres par style, par distance, par date. Tu trouves, tu t’organises, tu y vas.",
    icon: <svg {...iconProps}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>,
  },
  {
    title: "Vidéos",
    description: "Partage de vidéos et vidéo vitrine sur son profil.",
    details:
      "Tu peux ajouter une vidéo vitrine sur ton profil, style TikTok. C’est ta carte de visite visuelle. Les autres danseurs voient ton niveau et ton style avant même de t’écrire.",
    icon: <svg {...iconProps}><rect x="2" y="6" width="14" height="12" rx="2" /><path d="m16 10 6-3v10l-6-3" /></svg>,
  },
];

// Halo qui suit le curseur sur chaque carte (--x / --y lus par le dégradé)
const followPointer = (event: React.PointerEvent<HTMLElement>) => {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--x", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--y", `${event.clientY - rect.top}px`);
};

// Changement de disposition animé par le navigateur (View Transitions, réglages dans
// globals.css) ; sans support ou avec animations réduites, le changement est immédiat.
const withTransition = (update: () => void) => {
  if (!("startViewTransition" in document) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    update();
    return;
  }
  document.startViewTransition(() => flushSync(update));
};

function LiveBadge() {
  return (
    <span className="flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[9px] font-bold tracking-[.16em] text-white uppercase">
      <LiveDot />
      <span className="hidden sm:inline">En direct</span>
    </span>
  );
}

// Grille 2 × 3 ; un clic ouvre une carte (≈ 2× plus grande) avec le texte détaillé et
// une capture. Desktop : elle prend 2 colonnes sur toute la hauteur, les 5 autres se
// rangent en colonne à droite, estompées. Mobile : pleine largeur en tête de grille.
function FeatureGrid({ active }: { active: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  const list = useRef<HTMLUListElement>(null);

  const select = (index: number | null) => withTransition(() => setOpen(index));

  // Fermeture : clic en dehors de la grille ou Échap
  useEffect(() => {
    if (open === null) return;
    const onPointer = (event: PointerEvent) => {
      if (!list.current?.contains(event.target as Node)) withTransition(() => setOpen(null));
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") withTransition(() => setOpen(null));
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // En quittant la slide, la carte ouverte se referme
  useEffect(() => {
    if (!active) return;
    return () => setOpen(null);
  }, [active]);

  return (
    <ul
      ref={list}
      className={cx(
        // Hauteur fixe en desktop : la slide ne se recentre pas quand la grille change de forme
        "grid grid-cols-2 gap-2.5 sm:gap-3 lg:h-[min(640px,70vh)] lg:gap-4",
        open === null ? "lg:grid-cols-2 lg:grid-rows-3" : "lg:grid-cols-[1fr_1fr_.95fr] lg:grid-rows-5 lg:gap-3",
      )}
    >
      {FEATURES.map((feature, i) => {
        const expanded = i === open;
        const dimmed = open !== null && !expanded;
        return (
          <li
            key={feature.title}
            className={cx(
              "deck-reveal",
              expanded && "order-first col-span-2 lg:order-none lg:col-start-1 lg:row-span-5 lg:row-start-1",
              dimmed && "lg:col-start-3",
            )}
            style={{ ...d(3 + i), viewTransitionName: `feature-${i}` }}
          >
            {expanded ? (
              <article className="relative isolate h-full overflow-hidden rounded-3xl border border-brand/50 bg-[#110d1a]/90 p-5 shadow-[0_30px_90px_-30px_rgba(155,92,255,.7)] backdrop-blur-md sm:p-6 lg:p-7 lg:short:p-5">
                <div className="pointer-events-none absolute -top-24 -left-24 -z-10 size-72 rounded-full bg-brand/25 blur-3xl" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => select(null)}
                  className="absolute top-4 right-4 z-10 flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white transition hover:rotate-90 hover:border-brand/60 hover:bg-brand/20"
                  aria-label={`Fermer : ${feature.title}`}
                >
                  <svg {...iconProps} width={16} height={16} strokeWidth={2.2}><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>

                <div className="deck-feature-in flex h-full max-w-[600px] flex-col justify-center">
                  <div className="flex items-center gap-3">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-linear-135 from-brand-from to-brand-to text-white">{feature.icon}</span>
                    {feature.live && <LiveBadge />}
                  </div>
                  <h3 className="mt-6 pr-10 font-display text-[clamp(28px,3vw,44px)] leading-[1.05] font-extrabold tracking-[-.02em] text-white lg:short:mt-4">
                    {feature.title}
                  </h3>
                  <span className="mt-5 block h-[3px] w-12 rounded-full bg-linear-to-r from-brand-from to-[#ff5ad9] lg:short:mt-4" aria-hidden="true" />
                  <p className="mt-5 text-base leading-relaxed text-white/80 lg:text-lg lg:short:mt-4 lg:short:text-base">{feature.details}</p>
                </div>
              </article>
            ) : (
              <button
                type="button"
                onClick={() => select(i)}
                onPointerMove={followPointer}
                aria-expanded={false}
                className={cx(
                  "group relative isolate flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-line bg-white/[.035] p-4 text-left backdrop-blur-md transition duration-300 hover:border-brand/50 hover:shadow-[0_24px_70px_-24px_rgba(155,92,255,.6)] sm:p-5 lg:p-6 lg:short:p-4",
                  dimmed && "opacity-40 hover:opacity-80 lg:flex-row lg:items-center lg:gap-3 lg:p-3.5 lg:short:p-3",
                )}
              >
                <span
                  className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(340px_circle_at_var(--x,50%)_var(--y,50%),rgba(169,112,255,.22),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden="true"
                />
                {/* Ligne du haut, même position sur toutes les cartes : icône (+ badge) à gauche, bouton à droite */}
                <span className={cx("flex items-center justify-between gap-2", dimmed && "lg:contents")}>
                  <span className={cx("flex items-center gap-2", dimmed && "lg:contents")}>
                    <span
                      className={cx(
                        "flex size-10 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/8 text-brand-light transition duration-500 group-hover:scale-110 group-hover:text-white lg:size-12 lg:short:size-10",
                        dimmed && "lg:size-9! lg:rounded-xl",
                      )}
                    >
                      {feature.icon}
                    </span>
                    {feature.live && (
                      <span className={cx(dimmed && "lg:hidden")}>
                        <LiveBadge />
                      </span>
                    )}
                  </span>
                  {/* Aspect de bouton : c'est toute la carte qui est cliquable */}
                  <span
                    className={cx(
                      btnGradient,
                      "flex shrink-0 items-center gap-1.5 rounded-full p-2 text-[11px] shadow-[0_8px_24px_-8px_rgba(169,112,255,.9)] transition group-hover:shadow-[0_8px_30px_-4px_rgba(169,112,255,1)] sm:py-2 sm:pr-3 sm:pl-3.5",
                      dimmed && "lg:hidden",
                    )}
                  >
                    <span className="hidden sm:inline">En savoir plus</span>
                    <svg {...iconProps} width={12} height={12} strokeWidth={2.6} className="transition duration-300 group-hover:rotate-90"><path d="M12 5v14M5 12h14" /></svg>
                  </span>
                </span>
                <span
                  className={cx(
                    "mt-5 block font-display text-base leading-tight font-extrabold tracking-[-.02em] text-white sm:text-lg lg:mt-5 lg:text-xl lg:short:mt-3",
                    dimmed && "lg:mt-0! lg:text-sm",
                  )}
                >
                  {feature.title}
                </span>
                <span className={cx("mt-1.5 line-clamp-3 text-xs leading-relaxed text-muted sm:text-sm lg:line-clamp-2 lg:short:text-xs", dimmed && "lg:hidden")}>
                  {feature.description}
                </span>
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function FeaturesSlide({ active }: SlideProps) {
  return (
    <Frame>
      <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:gap-14">
        <div>
          <h2 className={title}>
            <Line step={1}>Ce que propose</Line>
            <Line step={2}>
              <span className={gradientText}>ViewZ</span>
            </Line>
          </h2>
          <p className={cx(body, "deck-reveal mt-6 hidden lg:block")} style={d(3)}>
            Clique sur une fonctionnalité pour en savoir plus.
          </p>
        </div>

        <FeatureGrid active={active} />
      </div>
    </Frame>
  );
}

// ------------------------------------------------------------------
// 4. La Scène ViewZ
// ------------------------------------------------------------------

// Formats diffusés dans la Scène : ils passent tour à tour dans le lecteur
const FORMATS = [
  { label: "Sessions filmées", caption: "Des danseurs sélectionnés, filmés en session", image: "/images/heroback5.png", position: "object-[70%_center]" },
  { label: "Interviews", caption: "La parole aux danseurs", image: "/images/features/onb1.jpg", position: "object-[center_40%]" },
  { label: "Portraits", caption: "Ceux qui font la scène", image: "/images/features/onb2.png", position: "object-[center_35%]" },
  { label: "Coulisses", caption: "L’envers du décor", image: "/images/features/onb4.png", position: "object-[center_35%]" },
];
const FORMAT_DURATION = 3000; // ms par format (même durée que .deck-progress)

const playIcon = (size: number) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6 3.5v17a1 1 0 0 0 1.5.86l14-8.5a1 1 0 0 0 0-1.72l-14-8.5A1 1 0 0 0 6 3.5Z" />
  </svg>
);

// Timecode de caméra (25 images / s) qui tourne quand la slide est affichée
function Timecode({ active }: { active: boolean }) {
  const [frames, setFrames] = useState(0);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const id = window.setInterval(() => setFrames(Math.floor((performance.now() - start) / 40)), 40);
    return () => window.clearInterval(id);
  }, [active]);

  const pad = (value: number) => String(value).padStart(2, "0");
  const seconds = Math.floor(frames / 25);
  return (
    <span className="font-mono tabular-nums">
      {pad(Math.floor(seconds / 3600))}:{pad(Math.floor(seconds / 60) % 60)}:{pad(seconds % 60)}:{pad(frames % 25)}
    </span>
  );
}

// Lecteur de la Scène : un grand écran + la playlist des formats en vignettes.
// Les formats défilent seuls toutes les 3 s ; un clic sur une vignette la lance.
function ScenePlayer({ active }: { active: boolean }) {
  const [current, setCurrent] = useState(0);
  const [plays, setPlays] = useState(0); // relance la barre de progression (et le minuteur) à chaque format

  const play = (index: number) => {
    setCurrent(index);
    setPlays((count) => count + 1);
  };

  useEffect(() => {
    if (!active) return;
    const id = window.setTimeout(() => {
      setCurrent((index) => (index + 1) % FORMATS.length);
      setPlays((count) => count + 1);
    }, FORMAT_DURATION);
    return () => window.clearTimeout(id);
  }, [active, plays]);

  const format = FORMATS[current];

  return (
    <div className="flex flex-col gap-3">
      {/* Écran */}
      <div className="relative isolate aspect-video overflow-hidden rounded-[28px] border border-white/12 bg-black shadow-[0_40px_120px_-30px_rgba(169,112,255,.6)]">
        {FORMATS.map((item, i) => (
          <Image
            key={item.image}
            src={item.image}
            alt=""
            fill
            sizes="(min-width: 900px) 680px, 100vw"
            data-active={i === current}
            className={cx("deck-screen -z-20 object-cover", item.position)}
          />
        ))}
        <div className="absolute inset-0 -z-10 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,.22)_0px,rgba(0,0,0,.22)_1px,transparent_1px,transparent_3px),linear-gradient(180deg,rgba(0,0,0,.45)_0%,transparent_35%,transparent_55%,rgba(0,0,0,.85)_100%)]" />

        <div className="absolute inset-x-4 top-4 flex items-center justify-between text-[10px] font-bold tracking-[.16em] text-white/85 sm:inset-x-5 sm:top-5 sm:text-[11px]">
          <span className="flex items-center gap-2.5">
            <span className="size-2 animate-pulse rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,.9)]" />
            REC
            <span className="text-white/55">
              <Timecode active={active} />
            </span>
          </span>
          <span className="flex items-center gap-1.5 text-white/60 uppercase">
            <Image src="/images/viewz-mark.png" alt="" width={10} height={12} />
            Scène ViewZ
          </span>
        </div>

        <span className="absolute top-1/2 left-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/12 pl-0.5 text-white backdrop-blur-md sm:size-16">
          <span className="absolute inset-0 rounded-full border border-white/30 motion-safe:animate-ping" />
          {playIcon(18)}
        </span>

        <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5">
          <p key={`title-${current}`} className="deck-glitch font-display text-lg leading-tight font-extrabold tracking-[-.02em] text-white sm:text-2xl">
            {format.label}
          </p>
          <p className="mt-0.5 text-xs text-white/65 sm:text-sm">{format.caption}</p>
          <span className="mt-3 block h-[3px] overflow-hidden rounded-full bg-white/20">
            <span key={`progress-${plays}`} className={cx("block h-full rounded-full bg-linear-to-r from-brand-from to-[#ff5ad9]", active && "deck-progress")} />
          </span>
        </div>
      </div>

      {/* Playlist */}
      <ul className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {FORMATS.map((item, i) => {
          const selected = i === current;
          return (
            <li key={item.label}>
              <button
                type="button"
                onClick={() => play(i)}
                aria-pressed={selected}
                aria-label={`Lire : ${item.label}`}
                className={cx(
                  "group relative isolate block aspect-[4/3] w-full overflow-hidden rounded-2xl border text-left transition duration-500",
                  selected ? "border-brand-light shadow-[0_0_30px_-6px_rgba(189,147,255,.8)]" : "border-white/10 opacity-60 hover:opacity-100",
                )}
              >
                <Image src={item.image} alt="" fill sizes="170px" className={cx("-z-20 object-cover transition duration-700 group-hover:scale-110", item.position)} />
                <span className="absolute inset-0 -z-10 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
                <span className="absolute top-2 left-2.5 font-mono text-[10px] text-white/60">{String(i + 1).padStart(2, "0")}</span>
                <span className="absolute inset-x-2.5 bottom-2 flex items-center gap-1.5 text-[10px] leading-tight font-bold text-white sm:text-xs">
                  <span className={cx("hidden size-4 shrink-0 items-center justify-center rounded-full pl-px sm:flex", selected ? "bg-linear-135 from-brand-from to-brand-to" : "bg-white/20")}>
                    {playIcon(7)}
                  </span>
                  <span className="truncate">{item.label}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Scene({ active }: SlideProps) {
  return (
    <Frame>
      <div className="grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-14">
        <div>
          <h2 className={title}>
            <Line step={1}>La Scène</Line>
            <Line step={2}>
              <span className={gradientText}>ViewZ</span>
            </Line>
          </h2>

          <p className={cx(lead, "deck-reveal mt-7 short:mt-5")} style={d(3)}>
            Une production vidéo dédiée à la danse.
          </p>
          <p className={cx(body, "deck-reveal mt-4 max-w-[520px]")} style={d(4)}>
            ViewZ produit du contenu vidéo de qualité autour de la danse : sessions filmées de danseurs sélectionnés, interviews, portraits,
            coulisses de la scène.
          </p>
          <p className={cx(body, "deck-reveal mt-4 max-w-[520px] border-l-2 border-brand-light/60 pl-4")} style={d(5)}>
            Tout ce contenu est diffusé dans la <strong className="text-white">Scène ViewZ</strong>, un espace dédié visible par toute la
            communauté.
          </p>
        </div>

        <div className="deck-reveal" style={d(4)}>
          <ScenePlayer active={active} />
        </div>
      </div>
    </Frame>
  );
}

// ------------------------------------------------------------------
// 5. Comment ça marche
// ------------------------------------------------------------------

const miniChip = "rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-[11px] font-bold text-white/85";

const STEPS: { title: string; description: string; extra: ReactNode }[] = [
  {
    title: "Création du profil",
    description: "Pseudo, style de danse, ville.",
    extra: (
      <div className="flex flex-wrap gap-2">
        {["Pseudo", "Style de danse", "Ville"].map((item) => <span key={item} className={miniChip}>{item}</span>)}
      </div>
    ),
  },
  {
    title: "Publier ou explorer",
    description: "Publication d’annonces ou exploration du feed.",
    extra: (
      <div className="flex flex-wrap gap-2">
        {["Annonces", "Feed"].map((item) => <span key={item} className={miniChip}>{item}</span>)}
      </div>
    ),
  },
  {
    title: "Mise en relation",
    description: "Mise en relation directe via la messagerie.",
    extra: (
      <div className="flex max-w-[260px] flex-col gap-1.5 text-[12px] font-semibold">
        <span className="self-start rounded-2xl rounded-bl-md border border-white/10 bg-white/8 px-3.5 py-2 text-white/85">Dispo pour un training ce soir ?</span>
        <span className="self-end rounded-2xl rounded-br-md bg-linear-135 from-brand-from to-brand-to px-3.5 py-2 text-white">Carrément, j’arrive !</span>
      </div>
    ),
  },
];

const STEP_START = 600; // ms : le point apparaît sur l'étape 1 pendant que la frise se dessine (.deck-draw)
const STEP_INTERVAL = 1700; // ms entre deux étapes
const STEP_TRAVEL = 1100; // ms : durée du trajet du point entre deux étapes
const STEP_CYCLE = STEPS.length + 1; // 3 étapes + une pause sur la dernière, puis on recommence

const stepOf = (tick: number) => (tick < 0 ? -1 : Math.min(tick % STEP_CYCLE, STEPS.length - 1));

// Frise « Comment ça marche » : un point lumineux avance d'étape en étape le long
// du trait, qui s'illumine derrière lui ; chaque étape s'allume quand le point l'atteint.
function Timeline({ active }: { active: boolean }) {
  const nodes = useRef<(HTMLSpanElement | null)[]>([]);
  const list = useRef<HTMLOListElement>(null);
  const [tick, setTick] = useState(-1); // position du point (-1 : pas encore parti)
  const [lit, setLit] = useState(-1); // étapes allumées : suit le point avec le temps du trajet
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);
  const [horizontal, setHorizontal] = useState(false);

  useEffect(() => {
    if (!active) return;
    let count = 0;
    let interval: number | undefined;
    let arrival: number | undefined;
    const start = window.setTimeout(() => {
      setTick(0);
      setLit(0);
      interval = window.setInterval(() => {
        count += 1;
        const value = count;
        setTick(value);
        // Nouvelle boucle, ou animations réduites (le point saute) : on allume tout de suite
        const instant = value % STEP_CYCLE === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (instant) setLit(value);
        else arrival = window.setTimeout(() => setLit(value), STEP_TRAVEL);
      }, STEP_INTERVAL);
    }, STEP_START);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(arrival);
      window.clearInterval(interval);
      // En quittant la slide, le point revient au départ pour la prochaine visite
      setTick(-1);
      setLit(-1);
    };
  }, [active]);

  // Position des pastilles (offsets de mise en page : insensibles aux animations d'entrée)
  useEffect(() => {
    const element = list.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      setPositions(nodes.current.map((node) => {
        const item = node?.parentElement;
        return { x: (item?.offsetLeft ?? 0) + (node?.offsetLeft ?? 0), y: (item?.offsetTop ?? 0) + (node?.offsetTop ?? 0) };
      }));
      setHorizontal(window.matchMedia("(min-width: 56.25rem)").matches);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const current = stepOf(tick);
  const litStep = stepOf(lit);
  const cycle = Math.max(0, Math.floor(tick / STEP_CYCLE)); // clé : à chaque boucle, le point repart de zéro sans revenir en arrière
  const target = positions[Math.max(current, 0)];
  const progress = target && current >= 0 ? (horizontal ? target.x : target.y) : 0;
  const travel = "duration-[1100ms] ease-[cubic-bezier(.65,0,.35,1)] motion-reduce:transition-none";

  return (
    <ol ref={list} className="relative mt-12 grid gap-12 pl-10 lg:mt-16 lg:grid-cols-3 lg:gap-10 lg:pt-12 lg:pl-0 lg:short:mt-10 lg:short:pt-10">
      {/* Frise : verticale en mobile, horizontale en desktop ; se dessine à l'arrivée sur la slide */}
      <span
        className="deck-draw absolute top-2 bottom-2 left-[7px] w-px bg-linear-to-b from-brand-light/60 via-brand/40 to-transparent lg:inset-x-0 lg:top-[7px] lg:bottom-auto lg:h-px lg:w-auto lg:bg-linear-to-r"
        aria-hidden="true"
      />

      {/* Portion déjà parcourue, plus lumineuse */}
      <span
        key={`trail-${cycle}`}
        className={cx(
          "absolute top-2 left-[7px] w-px bg-linear-to-b from-brand-light to-[#ff5ad9] shadow-[0_0_12px_rgba(189,147,255,.9)] transition-[width,height]",
          "lg:top-[7px] lg:left-0 lg:h-px lg:w-auto lg:bg-linear-to-r",
          travel,
        )}
        style={horizontal ? { width: progress } : { height: progress }}
        aria-hidden="true"
      />

      {/* Le point qui avance */}
      {current >= 0 && target && (
        <span
          key={`dot-${cycle}`}
          className={cx("deck-dot-in absolute top-0 left-0 z-10 size-[15px] transition-transform", travel)}
          style={{ transform: `translate(${target.x}px, ${target.y}px)` }}
          aria-hidden="true"
        >
          <span className="absolute inset-[2px] rounded-full bg-white shadow-[0_0_0_4px_rgba(169,112,255,.35),0_0_26px_8px_rgba(189,147,255,.85)]" />
        </span>
      )}

      {STEPS.map((step, i) => {
        const reached = i <= litStep;
        return (
          <li key={step.title} className="relative">
            <span
              ref={(node) => {
                nodes.current[i] = node;
              }}
              className={cx(
                "deck-reveal absolute top-1 -left-10 size-[15px] rounded-full border-2 border-brand-light shadow-[0_0_18px_rgba(189,147,255,.8)] transition-colors duration-500 lg:-top-12 lg:left-0 lg:short:-top-10",
                reached ? "bg-brand-light" : "bg-black",
              )}
              style={d(4 + i * 2)}
              aria-hidden="true"
            >
              {i === litStep && <span className="absolute -inset-[5px] rounded-full border border-brand-light motion-safe:animate-ping" />}
            </span>
            <div className="deck-reveal group" style={d(4 + i * 2)}>
              <span
                className={cx(
                  "block font-display text-[clamp(56px,min(7vw,11vh),116px)] leading-[.85] font-black tracking-[-.06em] transition-all duration-700 [-webkit-text-stroke-width:1.5px]",
                  reached
                    ? "text-brand/30 [-webkit-text-stroke-color:rgba(205,184,255,.95)] drop-shadow-[0_0_18px_rgba(169,112,255,.45)]"
                    : "text-transparent [-webkit-text-stroke-color:rgba(205,184,255,.4)] group-hover:text-brand/20",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-2xl font-extrabold tracking-[-.02em] text-white lg:text-[28px]">{step.title}</h3>
              <p className="mt-2 mb-5 text-sm leading-relaxed text-muted short:mb-3 lg:text-base">{step.description}</p>
              {step.extra}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Steps({ active }: SlideProps) {
  return (
    <Frame>
      <h2 className={title}>
        <Line step={1}>Comment</Line>
        <Line step={2}>
          ça <span className={gradientText}>marche</span>
        </Line>
      </h2>

      <Timeline active={active} />
    </Frame>
  );
}

// ------------------------------------------------------------------
// 6. Télécharger + contact
// ------------------------------------------------------------------

function Download() {
  return (
    <Frame>
      <span
        className="pointer-events-none absolute right-0 -bottom-[3vw] -z-10 font-display text-[26vw] leading-none font-black tracking-[-.07em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,.06)] lg:text-[19vw]"
        aria-hidden="true"
      >
        ViewZ
      </span>

      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
        <div>
          <h2 className={title}>
            <Line step={1}>Télécharger</Line>
            <Line step={2}>
              <span className={gradientText}>ViewZ</span>
            </Line>
          </h2>
          <p className={cx(body, "deck-reveal mt-6")} style={d(4)}>
            Disponible sur <strong className="text-white">App Store</strong> &amp; <strong className="text-white">Google Play</strong>
          </p>

          <div className="deck-reveal mt-8 flex flex-wrap items-center gap-6" style={d(5)}>
            {/* QR code vers viewz.fr, bordure dégradée qui tourne */}
            <a href={SITE_URL} className="group relative hidden size-[136px] shrink-0 sm:block overflow-hidden rounded-[26px] p-[2px]" aria-label="viewz.fr (QR code)">
              <span className="deck-spin absolute -inset-1/2 bg-[conic-gradient(from_0deg,#a765ff,#ff5ad9,#4d5bff,#a765ff)]" aria-hidden="true" />
              <span className="relative block size-full rounded-[24px] bg-white p-3.5 transition duration-500 group-hover:scale-[.97]">
                <Image src="/images/qr-viewz.svg" alt="" width={105} height={105} unoptimized className="size-full" />
              </span>
            </a>
            <div className="flex flex-col gap-3">
              <StoreBadges className="gap-2.5" badgeClassName="h-11" />
              <a href={SITE_URL} className="group inline-flex items-center gap-2 font-display text-lg font-extrabold tracking-[-.02em] text-white no-underline">
                viewz.fr
                <svg {...iconProps} width={16} height={16} className="text-brand-light transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"><path d="M7 17 17 7M8 7h9v9" /></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="deck-reveal" style={d(6)}>
          <div className="relative overflow-hidden rounded-[32px] border border-white/12 bg-white/[.04] p-7 backdrop-blur-xl lg:p-10">
            <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-brand/30 blur-3xl" aria-hidden="true" />
            <p className={cx(eyebrow, "uppercase")}>Contact</p>
            <p className="mt-4 font-display text-[clamp(26px,2.8vw,40px)] leading-[1.05] font-extrabold tracking-[-.02em] text-white">
              Vous avez un projet, une idée, une opportunité ?
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {["Partenariats", "Events", "Collabs"].map((item) => <li key={item} className={miniChip}>{item}</li>)}
            </ul>

            <p className="mt-8 flex items-center gap-2 text-sm font-semibold text-muted">
              <svg {...iconProps} width={16} height={16} className="text-brand-light"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              DM Instagram
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="group mt-1 inline-flex items-center gap-3 no-underline"
            >
              <span className={cx(gradientText, "text-[clamp(44px,5.4vw,80px)] leading-[1.05]")}>@viewz_fr</span>
              <span className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white transition duration-300 group-hover:rotate-45 group-hover:border-brand/60 group-hover:bg-brand/20">
                <svg {...iconProps} width={18} height={18}><path d="M7 17 17 7M8 7h9v9" /></svg>
              </span>
            </a>

            <div className="mt-8 flex items-center justify-between border-t border-line pt-5 text-sm">
              <a href={SITE_URL} className="font-bold text-white no-underline hover:text-brand-light">viewz.fr</a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white" aria-label="Instagram @viewz_fr">
                <svg {...iconProps} width={20} height={20}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

// ------------------------------------------------------------------
// Déroulé du dossier
// ------------------------------------------------------------------

export const SLIDES: SlideDefinition[] = [
  {
    id: "couverture",
    label: "ViewZ",
    background: {
      src: "/images/heroback5.png",
      className: "object-[72%_center] lg:object-right",
      overlay:
        "bg-[linear-gradient(180deg,rgba(0,0,0,.35)_0%,rgba(0,0,0,.6)_45%,#000_92%)] lg:bg-[linear-gradient(90deg,rgba(0,0,0,.88)_0%,rgba(0,0,0,.45)_45%,rgba(0,0,0,0)_72%),linear-gradient(180deg,rgba(0,0,0,.35)_0%,transparent_25%,transparent_70%,#000_100%)]",
    },
    glow: { x: "18%", y: "78%", opacity: 0.55 },
    Content: Cover,
  },
  {
    id: "concept",
    label: "Le concept",
    glow: { x: "76%", y: "45%" },
    Content: Concept,
  },
  {
    id: "fonctionnalites",
    label: "Fonctionnalités",
    glow: { x: "12%", y: "18%", opacity: 0.8 },
    Content: FeaturesSlide,
  },
  {
    id: "scene",
    label: "La Scène ViewZ",
    background: {
      src: "/images/features/onb3.png",
      className: "object-[center_35%]",
      overlay:
        "bg-[repeating-linear-gradient(0deg,rgba(0,0,0,.28)_0px,rgba(0,0,0,.28)_1px,transparent_1px,transparent_3px),linear-gradient(90deg,rgba(0,0,0,.9)_0%,rgba(0,0,0,.75)_50%,rgba(0,0,0,.85)_100%)]",
    },
    glow: { x: "85%", y: "30%", opacity: 0.35 },
    Content: Scene,
  },
  {
    id: "fonctionnement",
    label: "Comment ça marche",
    glow: { x: "88%", y: "82%" },
    Content: Steps,
  },
  {
    id: "telecharger",
    label: "Télécharger & contact",
    background: {
      src: "/images/features/onb4.png",
      className: "object-[center_30%]",
      overlay: "bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,.88)_45%,rgba(0,0,0,.6)_100%)]",
    },
    glow: { x: "28%", y: "92%", opacity: 0.7 },
    Content: Download,
  },
];
