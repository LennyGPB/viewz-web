import Image from "next/image";
import type { ReactNode } from "react";
import { container, cx } from "@/lib/ui";
import DominoGrid from "./DominoGrid";

type Feature = {
  title: string;
  description: string;
  image: string;
  imagePosition: string;
  icon: ReactNode;
  live?: boolean;
};

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

// Sur desktop, les cartes penchent comme des dominos qui tombent : chacune
// s'appuie sur la suivante (rotation autour du coin bas droit).
const DOMINO_STEPS = ["lg:z-4 lg:rotate-[10deg]", "lg:z-3 lg:rotate-[7deg]", "lg:z-2 lg:rotate-[4deg]", "lg:z-1 lg:rotate-[1deg]"];

const FEATURES: Feature[] = [
  {
    title: "Trouve un partenaire",
    description: "Publie une recherche ou réponds à une annonce : partenaire de duo, crew, danseurs pour un projet… près de chez toi.",
    image: "/images/features/onb1.jpg",
    imagePosition: "object-center",
    icon: (
      <svg {...iconProps}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Carte & spots",
    description: "Studios, parcs, salles, spots de rue : explore la carte des lieux où danser autour de toi.",
    image: "/images/features/onb2.png",
    imagePosition: "object-center",
    icon: (
      <svg {...iconProps}>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    title: "Dancing Now",
    description: "Tu danses en ce moment ? Partage ta position pour quelques heures et retrouve les danseurs actifs autour de toi.",
    image: "/images/features/onb3.png",
    imagePosition: "object-center",
    live: true,
    icon: (
      <svg {...iconProps}>
        <path d="M4.9 19.1a10 10 0 0 1 0-14.2M7.8 16.2a6 6 0 0 1 0-8.4M16.2 7.8a6 6 0 0 1 0 8.4M19.1 4.9a10 10 0 0 1 0 14.2" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    title: "Événements",
    description: "Battles, workshops, stages, soirées, festivals : ne rate plus aucun événement danse près de chez toi.",
    image: "/images/features/onb4.png",
    imagePosition: "object-center",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section
      id="fonctionnalites"
      className="relative z-1 scroll-mt-[84px] overflow-hidden bg-black py-24 lg:py-32"
    >
      <div className={cx(container, "relative")}>
        <h2 className="mb-12 font-sans text-[clamp(34px,5vw,64px)] font-extrabold leading-[1.02] tracking-[-.03em] text-white lg:mb-16">
          Fait pour les <span className="font-display font-black tracking-[-.065em]">danseurs.</span>
        </h2>

        <DominoGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3 lg:pt-6 lg:pr-12">
          {FEATURES.map((feature, index) => (
            <div key={feature.title} className={cx("domino-card relative lg:origin-bottom-right lg:hover:z-10 lg:hover:rotate-0", DOMINO_STEPS[index])}>
            <article
              className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[28px] border border-line p-6 transition duration-500 hover:-translate-y-1 hover:border-brand/50 hover:shadow-[0_30px_80px_-20px_rgba(155,92,255,.55)] sm:aspect-[3/4] lg:aspect-[9/14]"
            >
              <Image
                src={feature.image}
                alt=""
                fill
                sizes="(min-width: 900px) 25vw, (min-width: 640px) 50vw, 100vw"
                className={cx("-z-20 object-cover transition duration-700 group-hover:scale-105", feature.imagePosition)}
              />
              <div
                className="absolute inset-0 -z-10 bg-linear-to-t from-black via-black/55 to-black/5"
                aria-hidden="true"
              />

              <div className="absolute inset-x-6 top-6 flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur-md">
                  {feature.icon}
                </span>
                {feature.live ? (
                  <span className="flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.18em] text-white backdrop-blur-md">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-fuchsia-400 opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-fuchsia-500" />
                    </span>
                    En direct
                  </span>
                ) : (
                  <span className="font-mono text-xs tracking-[.12em] text-white/50">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}
              </div>

              <h3 className="font-display text-2xl font-extrabold tracking-[-.02em] text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{feature.description}</p>
              <span className="mt-5 block h-[3px] w-10 rounded-full bg-linear-to-r from-brand-from to-brand-to transition-all duration-500 group-hover:w-20" />
            </article>
            </div>
          ))}
        </DominoGrid>
      </div>
    </section>
  );
}
