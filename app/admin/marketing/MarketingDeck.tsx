"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import AdminIcon from "../AdminIcon";
import { cx } from "../adminUi";
import { MARKETING, type MarketingAction, type MarketingHorizon } from "./marketing.config";

// Plan marketing en diaporama, sur le modèle de /presentation : les slides sont
// empilées et changent d'état (past / active / future), avec les mêmes
// transitions CSS (.deck-slide, .deck-reveal, .deck-mask dans globals.css).

// Couleur de chaque horizon (violet, rose, bleu : les couleurs du glitch du dossier)
const ACCENTS = [
  { text: "text-brand-light", gradient: "from-brand-from to-brand-to", chip: "border-brand/25 bg-brand/10 text-brand-pale", stroke: "[-webkit-text-stroke:1.5px_rgba(189,147,255,.35)]", halo: "rgba(155,92,255,.4)" },
  { text: "text-[#ff8ae6]", gradient: "from-[#ff5ad9] to-[#a765ff]", chip: "border-[#ff5ad9]/25 bg-[#ff5ad9]/10 text-[#ffc2f1]", stroke: "[-webkit-text-stroke:1.5px_rgba(255,138,230,.35)]", halo: "rgba(255,90,217,.28)" },
  { text: "text-[#8b95ff]", gradient: "from-[#4d5bff] to-[#a765ff]", chip: "border-[#4d5bff]/30 bg-[#4d5bff]/10 text-[#c3c8ff]", stroke: "[-webkit-text-stroke:1.5px_rgba(139,149,255,.35)]", halo: "rgba(77,91,255,.35)" },
];
type Accent = (typeof ACCENTS)[number];
const accentOf = (horizon: number) => ACCENTS[horizon % ACCENTS.length];

const eyebrow = "text-[11px] font-bold tracking-[.26em] uppercase";
const pad = (value: number) => String(value).padStart(2, "0");

// Rang dans la cascade d'apparition (--d, cf. .deck-reveal)
function Reveal({ d, className, children }: { d: number; className?: string; children: ReactNode }) {
  return (
    <div className={cx("deck-reveal", className)} style={{ "--d": d } as CSSProperties}>
      {children}
    </div>
  );
}

function Line({ d, className, children }: { d: number; className?: string; children: ReactNode }) {
  return (
    <span className="deck-mask">
      <span className={className} style={{ "--d": d } as CSSProperties}>{children}</span>
    </span>
  );
}

// ------------------------------------------------------------------
// Slides
// ------------------------------------------------------------------

type Slide = {
  key: string;
  label: string;
  horizon: number | null; // null : couverture
  halo: { x: string; y: string };
  steps: number; // > 1 : « suivant » dévoile d'abord les parties de la slide
  content: (goTo: (target: number) => void, step: number) => ReactNode;
};

// « Plan Marketing - v1 » : la fin après le tiret reste d'un bloc (« - v1 » ne se coupe pas)
function TitleText({ text }: { text: string }) {
  const match = text.match(/^(.*?) ([-–—] .+)$/);
  if (!match) return text;
  return (
    <>
      {match[1]} <span className="whitespace-nowrap">{match[2]}</span>
    </>
  );
}

function Cover({ chapters, goTo }: { chapters: number[]; goTo: (target: number) => void }) {
  const total = MARKETING.horizons.reduce((count, horizon) => count + horizon.actions.length, 0);
  return (
    <div className="flex min-h-full flex-col justify-center gap-10 py-4">
      <div>
        <Reveal d={0} className={cx(eyebrow, "flex items-center gap-2.5 text-brand-soft")}>
          <Image src="/images/viewz-mark.png" alt="" width={12} height={14} />
          ViewZ
        </Reveal>
        <h1 className="mt-6 text-[clamp(44px,7vw,92px)] leading-[.92] font-extrabold tracking-[-.045em] text-white">
          <Line d={1}>
            <TitleText text={MARKETING.title} />
          </Line>
        </h1>
        {MARKETING.intro && (
          <Reveal d={3} className="mt-6 max-w-[540px] text-base leading-relaxed text-lavender/75 sm:text-lg">
            {MARKETING.intro}
          </Reveal>
        )}
      </div>

      {/* Sommaire : un horizon par ligne, cliquable */}
      <Reveal d={4}>
        <p className={cx(eyebrow, "text-white/40")}>{total} actions · {MARKETING.horizons.length} horizons</p>
        <ol className="mt-3 grid gap-2 sm:grid-cols-3">
          {MARKETING.horizons.map((horizon, i) => (
            <li key={horizon.label}>
              <button
                type="button"
                onClick={() => goTo(chapters[i])}
                className="group flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[.03] px-4 py-3.5 text-left transition hover:border-white/25 hover:bg-white/[.06]"
              >
                <span className={cx("font-display text-2xl leading-none font-black tracking-[-.04em]", accentOf(i).text)}>{pad(i + 1)}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-white">{horizon.label}</span>
                  <span className="block text-xs text-white/45">{horizon.actions.length} action{horizon.actions.length > 1 ? "s" : ""}</span>
                </span>
                <AdminIcon name="chevronRight" size={16} className="text-white/30 transition group-hover:translate-x-0.5 group-hover:text-white/70" />
              </button>
            </li>
          ))}
        </ol>
      </Reveal>
    </div>
  );
}

function Chapter({ horizon, index, first, goTo }: { horizon: MarketingHorizon; index: number; first: number; goTo: (target: number) => void }) {
  const accent = accentOf(index);
  return (
    <div className="grid min-h-full items-center gap-10 py-4 lg:grid-cols-[1fr_1fr] lg:gap-16">
      <div>
        <Reveal d={0}>
          <span className={cx("block font-display text-[clamp(90px,14vw,180px)] leading-[.8] font-black tracking-[-.06em] text-transparent", accent.stroke)}>
            {pad(index + 1)}
          </span>
        </Reveal>
        {horizon.period && <Reveal d={1} className={cx(eyebrow, "mt-6", accent.text)}>{horizon.period}</Reveal>}
        <h2 className="mt-2 font-display text-[clamp(38px,5vw,64px)] leading-none font-black tracking-[-.05em] text-white">
          <Line d={2}>{horizon.label}</Line>
        </h2>
        {horizon.summary && <Reveal d={3} className="mt-4 max-w-[440px] text-base leading-relaxed text-lavender/75">{horizon.summary}</Reveal>}
      </div>

      <ol className="flex flex-col border-t border-white/10">
        {horizon.actions.map((action, i) => (
          <li key={action.title}>
            <Reveal d={4 + i}>
              <button
                type="button"
                onClick={() => goTo(first + i)}
                className="group flex w-full items-center gap-4 border-b border-white/10 py-3 text-left transition hover:pl-1"
              >
                <span className="w-7 font-mono text-[11px] text-white/35">{pad(i + 1)}</span>
                <span className="min-w-0 flex-1 truncate font-bold text-white/85 transition group-hover:text-white">{action.title}</span>
                <AdminIcon name="chevronRight" size={16} className="text-white/25 transition group-hover:text-white/70" />
              </button>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}

type ActionProps = { action: MarketingAction; horizon: MarketingHorizon; index: number; count: number; accent: Accent; step: number };

function Tags({ tags, accent, small }: { tags?: string[]; accent: Accent; small?: boolean }) {
  if (!tags?.length) return null;
  return (
    <ul className={cx("flex flex-wrap", small ? "mt-3 gap-1.5" : "mt-6 gap-2")}>
      {tags.map((tag) => (
        <li key={tag} className={cx("rounded-full border font-semibold", small ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs", accent.chip)}>{tag}</li>
      ))}
    </ul>
  );
}

// Action qui regroupe des parties : l'en-tête à gauche, les parties à droite,
// qui apparaissent une par une (step = nombre de parties affichées).
function GroupedAction({ action, horizon, index, count, accent, step }: ActionProps) {
  const points = action.points ?? [];
  const latest = useRef<HTMLLIElement>(null);

  // Petits écrans : la partie qui vient d'apparaître peut être sous la barre du bas,
  // on fait défiler la slide jusqu'à elle.
  useEffect(() => {
    const point = latest.current;
    const scroller = point?.closest("section");
    if (!point || !scroller || scroller.dataset.state !== "active") return;
    const overflow = point.getBoundingClientRect().bottom - scroller.getBoundingClientRect().bottom + 16;
    if (overflow > 0) scroller.scrollBy({ top: overflow, behavior: "smooth" });
  }, [step]);

  return (
    <div className="grid min-h-full items-center gap-6 py-4 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:gap-14">
      <div>
        <Reveal d={0} className={cx(eyebrow, accent.text)}>
          {horizon.label} · {pad(index + 1)} / {pad(count)}
        </Reveal>
        <h2 className="mt-5 text-[clamp(36px,4.5vw,60px)] leading-[.95] font-extrabold tracking-[-.045em] text-white">
          <Line d={2}>{action.title}</Line>
        </h2>
        {action.description && (
          <Reveal d={3} className="mt-5 text-base leading-relaxed text-lavender/75">
            {action.description}
          </Reveal>
        )}
        <Reveal d={4}>
          <Tags tags={action.tags} accent={accent} />
        </Reveal>
      </div>

      <ol className="flex flex-col gap-2.5">
        {points.map((point, i) => {
          const visible = i < step;
          const current = i === step - 1;
          return (
            <li
              key={point.title}
              ref={current ? latest : undefined}
              aria-hidden={!visible}
              className={cx(
                "flex gap-4 rounded-2xl border p-4 transition duration-700 ease-[cubic-bezier(.22,1,.36,1)]",
                visible ? "translate-y-0 opacity-100 blur-none" : "pointer-events-none translate-y-4 opacity-0 blur-sm",
                current ? "border-white/20 bg-white/[.06]" : "border-white/10 bg-white/[.02]",
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="flex items-baseline gap-2.5">
                  <span className="font-mono text-[11px] text-white/35">{pad(i + 1)}</span>
                  <span className="text-lg leading-tight font-extrabold tracking-[-.02em] text-white">{point.title}</span>
                </p>
                {point.description && <p className="mt-1.5 text-sm leading-relaxed text-lavender/70">{point.description}</p>}
                <Tags tags={point.tags} accent={accent} small />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Action(props: ActionProps) {
  const { action, horizon, index, count, accent } = props;
  if (action.points?.length) return <GroupedAction {...props} />;
  return (
    <div className="relative flex min-h-full flex-col justify-center py-4">
      {/* Grand numéro en filigrane */}
      <span
        className={cx("pointer-events-none absolute top-1/2 right-0 hidden -translate-y-1/2 font-display text-[clamp(160px,22vw,300px)] leading-none font-black tracking-[-.06em] text-transparent select-none lg:block", accent.stroke)}
        aria-hidden="true"
      >
        {pad(index + 1)}
      </span>

      <div className="relative max-w-[580px]">
        <Reveal d={0} className={cx(eyebrow, accent.text)}>
          {horizon.label} · {pad(index + 1)} / {pad(count)}
        </Reveal>
        <h2 className="mt-5 text-[clamp(36px,5vw,64px)] leading-[.95] font-extrabold tracking-[-.045em] text-white">
          <Line d={2}>{action.title}</Line>
        </h2>
        {action.description && (
          <Reveal d={3} className="mt-5 text-base leading-relaxed text-lavender/75 sm:text-lg">
            {action.description}
          </Reveal>
        )}
        <Reveal d={4}>
          <Tags tags={action.tags} accent={accent} />
        </Reveal>
      </div>
    </div>
  );
}

// Couverture, puis pour chaque horizon : un chapitre + une slide par action
function buildSlides() {
  const slides: Slide[] = [];
  const chapters: number[] = [];

  slides.push({ key: "cover", label: "Couverture", horizon: null, halo: { x: "85%", y: "10%" }, steps: 1, content: (goTo) => <Cover chapters={chapters} goTo={goTo} /> });

  MARKETING.horizons.forEach((horizon, h) => {
    const first = slides.length + 1;
    chapters.push(slides.length);
    slides.push({
      key: `h${h}`,
      label: horizon.label,
      horizon: h,
      halo: { x: "15%", y: "30%" },
      steps: 1,
      content: (goTo) => <Chapter horizon={horizon} index={h} first={first} goTo={goTo} />,
    });
    horizon.actions.forEach((action, a) => {
      slides.push({
        key: `h${h}-a${a}`,
        label: action.title,
        horizon: h,
        halo: { x: a % 2 ? "20%" : "80%", y: a % 2 ? "85%" : "20%" },
        steps: (action.points?.length ?? 0) + 1,
        content: (_, step) => <Action action={action} horizon={horizon} index={a} count={horizon.actions.length} accent={accentOf(h)} step={step} />,
      });
    });
  });

  return slides;
}

const SLIDES = buildSlides();

// ------------------------------------------------------------------
// Diaporama
// ------------------------------------------------------------------

const navButton = "flex size-10 items-center justify-center rounded-full border transition duration-300 disabled:pointer-events-none disabled:opacity-30 sm:size-11";

export default function MarketingDeck() {
  const [{ index, step }, setPosition] = useState({ index: 0, step: 0 });
  const [fullscreen, setFullscreen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const slide = SLIDES[index];
  const last = SLIDES.length - 1;
  const accent = slide.horizon === null ? ACCENTS[0] : accentOf(slide.horizon);
  const atStart = index === 0 && step === 0;
  const atEnd = index === last && step === slide.steps - 1;

  const goTo = useCallback((target: number) => setPosition({ index: Math.max(0, Math.min(SLIDES.length - 1, target)), step: 0 }), []);
  // Suivant : partie suivante de la slide s'il en reste, sinon slide suivante
  const next = useCallback(() => {
    if (step < slide.steps - 1) setPosition({ index, step: step + 1 });
    else if (index < last) setPosition({ index: index + 1, step: 0 });
  }, [index, step, slide, last]);
  // Retour : on remasque la dernière partie, sinon slide précédente entièrement dévoilée
  const prev = useCallback(() => {
    if (step > 0) setPosition({ index, step: step - 1 });
    else if (index > 0) setPosition({ index: index - 1, step: SLIDES[index - 1].steps - 1 });
  }, [index, step]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else panel.current?.requestFullscreen?.();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target instanceof Element ? event.target : document.body;
      if (target.closest("input, textarea, select, [role=dialog]")) return;

      switch (event.key) {
        case "ArrowRight":
        case "PageDown":
          event.preventDefault();
          next();
          break;
        case " ":
          if (target.closest("button, a")) return;
          event.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "PageUp":
          event.preventDefault();
          prev();
          break;
        case "Home":
          event.preventDefault();
          goTo(0);
          break;
        case "End":
          event.preventDefault();
          goTo(SLIDES.length - 1);
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
      }
    };
    const onFullscreen = () => setFullscreen(Boolean(document.fullscreenElement));

    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFullscreen);
    };
  }, [next, prev, goTo, toggleFullscreen]);

  // Mobile : glisser à gauche / à droite
  const onTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };
  const onTouchEnd = (event: React.TouchEvent) => {
    if (!touchStart.current) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    if (dx < 0) next();
    else prev();
  };

  return (
    <div
      ref={panel}
      className={cx(
        "relative isolate flex flex-col overflow-hidden border-white/10 bg-bg select-none",
        fullscreen
          ? "h-svh"
          : cx(
              // Mobile : bord à bord sous la barre de l'admin (on annule les marges px-4 py-6 de la page)
              "-mx-4 -my-6 h-[calc(100svh-3.5rem)] min-h-[320px]",
              "sm:mx-0 sm:my-0 sm:h-[calc(100svh-7.5rem)] sm:rounded-3xl sm:border lg:h-[calc(100svh-5rem)]",
            ),
      )}
      aria-roledescription="carrousel"
      aria-label="Plan marketing ViewZ"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Halo qui se déplace et prend la couleur de l'horizon */}
      <div
        className="pointer-events-none absolute -z-10 size-[min(70vw,640px)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-[left,top,background] duration-[1600ms] ease-[cubic-bezier(.22,1,.36,1)]"
        style={{ left: slide.halo.x, top: slide.halo.y, background: `radial-gradient(circle, ${accent.halo}, transparent 70%)` }}
        aria-hidden="true"
      />
      <div className="deck-grain pointer-events-none absolute -inset-[10%] z-20 opacity-[.05] mix-blend-overlay" aria-hidden="true" />

      {/* Barre du haut */}
      <header className="relative z-30 flex h-14 shrink-0 items-center justify-between px-5 sm:px-8">
        <span className={cx(eyebrow, "flex items-center gap-2 text-white/45")}>
          <Image src="/images/viewz-mark.png" alt="" width={10} height={12} className="opacity-70" />
          {MARKETING.eyebrow}
        </span>
        <button
          type="button"
          onClick={toggleFullscreen}
          className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition hover:border-brand/60 hover:text-white"
          aria-label={fullscreen ? "Quitter le plein écran" : "Plein écran"}
          title="Plein écran (F)"
        >
          <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={fullscreen ? "M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" : "M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"} />
          </svg>
        </button>
      </header>

      {/* Slides empilées */}
      <div className="relative z-10 min-h-0 flex-1">
        {SLIDES.map((item, i) => {
          const active = i === index;
          return (
            <section
              key={item.key}
              data-state={active ? "active" : i < index ? "past" : "future"}
              aria-roledescription="slide"
              aria-label={`${i + 1} sur ${SLIDES.length} : ${item.label}`}
              aria-hidden={!active}
              inert={!active}
              className="deck-slide absolute inset-0 overflow-x-hidden overflow-y-auto overscroll-contain px-5 [scrollbar-width:none] sm:px-10 lg:px-16 [&::-webkit-scrollbar]:hidden"
            >
              {item.content(goTo, active ? step : i < index ? item.steps - 1 : 0)}
            </section>
          );
        })}
      </div>

      {/* Barre du bas : compteur, progression, flèches */}
      <nav className="relative z-30 grid shrink-0 grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 px-5 pt-3 pb-5 sm:grid-cols-[auto_1fr_auto] sm:px-8 lg:grid-cols-[1fr_minmax(0,380px)_1fr]" aria-label="Navigation du plan marketing">
        <div className="flex min-w-0 items-end gap-3" aria-live="polite">
          <span key={index} className="deck-glitch font-display text-3xl leading-none font-black tracking-[-.04em] text-white">{pad(index + 1)}</span>
          <span className="mb-0.5 flex min-w-0 flex-col">
            <span className="font-mono text-[10px] text-white/40">/ {pad(SLIDES.length)}</span>
            <span key={`label-${index}`} className={cx("deck-glitch truncate text-[10px] font-bold tracking-[.2em] uppercase", accent.text)}>{slide.label}</span>
          </span>
        </div>

        {/* Progression : un segment par slide, aux couleurs de l'horizon */}
        <ol className="col-span-full row-start-2 flex gap-1 sm:col-span-1 sm:col-start-2 sm:row-start-1">
          {SLIDES.map((item, i) => (
            <li key={item.key} className="flex-1">
              <button type="button" onClick={() => goTo(i)} className="group block w-full py-2" aria-label={`Aller à la slide ${i + 1} : ${item.label}`} aria-current={i === index ? "step" : undefined}>
                <span className="relative block h-[3px] overflow-hidden rounded-full bg-white/12 transition group-hover:bg-white/25">
                  <span
                    className={cx(
                      "absolute inset-0 origin-left rounded-full bg-linear-to-r transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]",
                      item.horizon === null ? ACCENTS[0].gradient : accentOf(item.horizon).gradient,
                      i > index && "scale-x-0",
                      i < index && "opacity-50",
                    )}
                    // Slide en cours à plusieurs parties : le segment se remplit partie par partie
                    style={i === index ? { scale: `${(step + 1) / item.steps} 1` } : undefined}
                  />
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div className="flex items-center gap-2 justify-self-end">
          <button type="button" onClick={prev} disabled={atStart} className={cx(navButton, "border-white/15 bg-white/5 text-white hover:-translate-x-0.5 hover:border-brand/60")} aria-label="Slide précédente">
            <AdminIcon name="arrowLeft" size={18} />
          </button>
          <button
            type="button"
            onClick={next}
            disabled={atEnd}
            className={cx(navButton, "border-transparent bg-linear-135 from-brand-from to-brand-to text-white shadow-[0_10px_40px_-10px_rgba(169,112,255,.9)] hover:translate-x-0.5")}
            aria-label="Slide suivante"
          >
            <AdminIcon name="arrowLeft" size={18} className="rotate-180" />
          </button>
        </div>
      </nav>
    </div>
  );
}
