"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { btnGradient, cx } from "@/lib/ui";
import StoreBadges from "./StoreBadges";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

// Hero mobile : un seul bouton « Télécharger l'app » qui ouvre une feuille en bas
// de l'écran avec les badges officiels App Store / Google Play.
export default function DownloadSheet({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  // Monté au premier clic seulement (portail dans body, hors du contexte z-index du hero)
  const [mounted, setMounted] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setMounted(true);
          // La feuille est d'abord rendue fermée, puis glisse à l'ouverture
          window.setTimeout(() => setOpen(true), 20);
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cx(
          btnGradient,
          "group inline-flex items-center gap-3 rounded-full py-3.5 pr-4 pl-6 text-sm shadow-[0_14px_50px_-12px_rgba(169,112,255,.9)] transition hover:shadow-[0_14px_60px_-6px_rgba(169,112,255,1)] active:scale-[.97]",
          className,
        )}
      >
        Télécharger l’app
        <span className="flex size-7 items-center justify-center rounded-full bg-white/20 transition group-hover:translate-y-0.5">
          <svg {...iconProps} width={14} height={14} strokeWidth={2.4}>
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </span>
      </button>

      {/* Feuille du bas : glisse depuis le bas à l'ouverture */}
      {mounted &&
        createPortal(
          <div className={cx("fixed inset-0 z-[60] lg:hidden", !open && "pointer-events-none")} inert={!open}>
            <div
              className={cx("absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300", open ? "opacity-100" : "opacity-0")}
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="download-sheet-title"
              className={cx(
                "absolute inset-x-0 bottom-0 isolate overflow-hidden rounded-t-[28px] border-t border-white/12 bg-[#110d1a] px-6 pt-3 pb-[max(2rem,env(safe-area-inset-bottom))] text-center shadow-[0_-30px_90px_-30px_rgba(155,92,255,.7)] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
                open ? "translate-y-0" : "translate-y-full",
              )}
            >
              <div
                className="pointer-events-none absolute -top-28 left-1/2 -z-10 size-72 -translate-x-1/2 rounded-full bg-brand/30 blur-3xl"
                aria-hidden="true"
              />

              <span className="mx-auto block h-1 w-10 rounded-full bg-white/20" aria-hidden="true" />
              <button
                ref={closeButton}
                type="button"
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white transition hover:border-brand/60"
                aria-label="Fermer"
              >
                <svg {...iconProps} width={16} height={16} strokeWidth={2.2}>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>

              <Image src="/images/viewz-mark.png" alt="" width={34} height={38} className="mx-auto mt-6 drop-shadow-[0_0_14px_rgba(190,140,255,.6)]" />
              <h2 id="download-sheet-title" className="mt-4 font-display text-2xl font-black tracking-[-.03em] text-white">
                Télécharger ViewZ
              </h2>
              <p className="mt-1.5 text-sm text-muted">Choisis ton store, c’est gratuit.</p>

              <StoreBadges className="mt-7 flex-col justify-center gap-3" badgeClassName="h-14" />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
