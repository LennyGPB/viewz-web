"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { brandLink, brandMark, container, cx, wordmark } from "@/lib/ui";
import { SLIDES } from "./slides";

type Direction = "next" | "back";

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const navButton =
  "flex size-12 items-center justify-center rounded-full border transition duration-300 disabled:pointer-events-none disabled:opacity-30 lg:size-14";

// Dossier interactif : les slides sont toutes rendues, empilées, et changent
// d'état (past / active / future) ; les transitions sont en CSS (.deck-* dans globals.css).
export default function Deck() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<Direction | null>(null);
  const [changes, setChanges] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const last = SLIDES.length - 1;
  const slide = SLIDES[index];

  const goTo = useCallback((target: number) => {
    const clamped = Math.max(0, Math.min(SLIDES.length - 1, target));
    if (clamped === index) return;
    setDirection(clamped > index ? "next" : "back");
    setChanges((count) => count + 1);
    setIndex(clamped);
  }, [index]);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement;
      // Espace / Entrée sur un bouton ou un lien : on laisse le clic natif agir.
      const onControl = target.closest("button, a, input, textarea");

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
          event.preventDefault();
          next();
          break;
        case " ":
          if (onControl) return;
          event.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "ArrowUp":
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

  // Mobile : glisser à gauche / à droite (un geste plutôt vertical fait défiler la slide).
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
    <main
      className="relative isolate h-svh overflow-hidden bg-black select-none"
      aria-roledescription="carrousel"
      aria-label="Dossier de présentation ViewZ"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Fonds : une photo néon par slide (ou aucune), en fondu enchaîné */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {SLIDES.map((item, i) =>
          item.background ? (
            <div key={item.id} data-active={i === index} className="deck-bg absolute inset-0 overflow-hidden">
              <Image
                src={item.background.src}
                alt=""
                fill
                preload={i === 0}
                quality={90}
                sizes="100vw"
                className={cx("object-cover", item.background.className)}
              />
              <div className={cx("absolute inset-0", item.background.overlay)} />
            </div>
          ) : null,
        )}

        {/* Halo violet qui se déplace d'une slide à l'autre */}
        <div
          className="absolute size-[min(70vw,720px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(155,92,255,.45),rgba(113,51,218,.12)_45%,transparent_70%)] blur-3xl transition-[left,top,opacity] duration-[1600ms] ease-[cubic-bezier(.22,1,.36,1)]"
          style={{ left: slide.glow.x, top: slide.glow.y, opacity: slide.glow.opacity ?? 1 }}
        />
      </div>

      {/* Slides */}
      {SLIDES.map((item, i) => {
        const active = i === index;
        const SlideContent = item.Content;
        return (
          <section
            key={item.id}
            data-state={active ? "active" : i < index ? "past" : "future"}
            aria-roledescription="slide"
            aria-label={`${i + 1} sur ${SLIDES.length} : ${item.label}`}
            aria-hidden={!active}
            inert={!active}
            className="deck-slide absolute inset-0 z-10 overflow-x-hidden overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <SlideContent active={active} next={next} />
          </section>
        );
      })}

      {/* Balayage lumineux à chaque changement (remonté via la key) */}
      {direction && (
        <div key={changes} data-dir={direction} className="deck-sweep pointer-events-none absolute inset-y-0 left-0 z-20 w-[45vw] mix-blend-screen" aria-hidden="true">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-brand/25 to-transparent" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-linear-to-b from-transparent via-white/80 to-transparent shadow-[0_0_24px_4px_rgba(205,184,255,.6)]" />
        </div>
      )}

      <div className="deck-grain pointer-events-none absolute -inset-[10%] z-20 opacity-[.07] mix-blend-overlay" aria-hidden="true" />

      {/* Barre du haut */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 bg-linear-to-b from-black/70 to-transparent">
        <div className={cx(container, "flex h-20 items-center justify-between lg:h-24")}>
          <Link href="/" className={cx(brandLink, "pointer-events-auto")} aria-label="Retour au site ViewZ">
            <Image src="/images/viewz-mark.png" alt="" width={22} height={28} className={brandMark} />
            <span className={cx(wordmark, "text-lg")}>ViewZ</span>
          </Link>

          <div className="pointer-events-auto flex items-center gap-4">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur-md transition hover:border-brand/60 hover:text-white"
              aria-label={fullscreen ? "Quitter le plein écran" : "Plein écran"}
              title="Plein écran (F)"
            >
              {fullscreen ? (
                <svg {...iconProps} width={16} height={16}><path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" /></svg>
              ) : (
                <svg {...iconProps} width={16} height={16}><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" /></svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Barre du bas : compteur, progression, flèches */}
      <nav className="absolute inset-x-0 bottom-0 z-30 bg-linear-to-t from-black via-black/70 to-transparent pt-10" aria-label="Navigation du dossier">
        <div className={cx(container, "grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-4 pb-5 lg:grid-cols-[1fr_auto_1fr] lg:pb-8")}>
          {/* Progression : un segment par slide, cliquable */}
          <div className="col-span-full flex items-center gap-1.5 lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:w-[420px] lg:flex-col lg:gap-3">
            <ol className="flex w-full gap-1.5">
              {SLIDES.map((item, i) => (
                <li key={item.id} className="flex-1">
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    className="group block w-full py-2"
                    aria-label={`Aller à la slide ${i + 1} : ${item.label}`}
                    aria-current={i === index ? "step" : undefined}
                  >
                    <span className="relative block h-[3px] overflow-hidden rounded-full bg-white/15 transition group-hover:bg-white/30">
                      <span
                        className={cx(
                          "absolute inset-0 origin-left rounded-full bg-linear-to-r from-brand-from to-brand-light transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]",
                          i <= index ? "scale-x-100" : "scale-x-0",
                          i < index && "opacity-50",
                        )}
                      />
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <p className="hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[.2em] text-white/35 lg:flex">
              <kbd className="rounded-md border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-white/60">←</kbd>
              <kbd className="rounded-md border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-white/60">→</kbd>
              pour naviguer
            </p>
          </div>

          {/* Compteur */}
          <div className="flex min-w-0 items-end gap-3 lg:col-start-1 lg:row-start-1" aria-live="polite">
            <span key={index} className="deck-glitch font-display text-4xl leading-none font-black tracking-[-.04em] text-white lg:text-5xl">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="mb-1 flex min-w-0 flex-col">
              <span className="font-mono text-[11px] text-white/40">/ {String(SLIDES.length).padStart(2, "0")}</span>
              <span key={`label-${index}`} className="deck-glitch truncate text-[11px] font-bold uppercase tracking-[.2em] text-brand-pale">
                {slide.label}
              </span>
            </span>
          </div>

          {/* Flèches */}
          <div className="flex items-center gap-2.5 justify-self-end lg:col-start-3 lg:row-start-1">
            <button
              type="button"
              onClick={prev}
              disabled={index === 0}
              className={cx(navButton, "border-white/15 bg-white/5 text-white backdrop-blur-md hover:-translate-x-0.5 hover:border-brand/60")}
              aria-label="Slide précédente"
            >
              <svg {...iconProps}><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>
            <button
              type="button"
              onClick={next}
              disabled={index === last}
              className={cx(
                navButton,
                "border-transparent bg-linear-135 from-brand-from to-brand-to text-white shadow-[0_10px_40px_-10px_rgba(169,112,255,.9)] hover:translate-x-0.5 hover:shadow-[0_10px_50px_-6px_rgba(169,112,255,1)]",
              )}
              aria-label="Slide suivante"
            >
              <svg {...iconProps}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </nav>
    </main>
  );
}
