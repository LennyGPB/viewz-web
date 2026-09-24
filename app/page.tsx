import Image from "next/image";
import { container, cx } from "@/lib/ui";
import Features from "./components/Features";
import StoreBadges from "./components/StoreBadges";

const HERO_MOBILE_SLIDES = [
  "/images/mobiles/onb1.png",
  "/images/mobiles/onb2.png",
  "/images/mobiles/onb3.png",
  "/images/mobiles/onb4.png",
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <section className="relative z-1 flex min-h-svh flex-col justify-end overflow-hidden bg-black lg:justify-center">
        {/* Mobile : diaporama des écrans de l'app, une image par seconde (animation .hero-slide dans globals.css). */}
        <div className="absolute inset-0 lg:hidden" aria-hidden="true">
          {HERO_MOBILE_SLIDES.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              preload={index === 0}
              sizes="100vw"
              className="hero-slide object-cover"
            />
          ))}
        </div>

        <Image
          src="/images/heroback5.png"
          alt=""
          fill
          preload
          quality={95}
          // Desktop uniquement : en mobile, seule une version minuscule est téléchargée.
          sizes="(min-width: 900px) 100vw, 1px"
          className="hidden object-cover object-right blur-[6px] lg:block lg:scale-105"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.2)_0%,rgba(0,0,0,.7)_60%,#000_100%)] lg:bg-[linear-gradient(90deg,rgba(0,0,0,.75)_0%,rgba(0,0,0,.35)_45%,rgba(0,0,0,0)_70%),linear-gradient(180deg,rgba(0,0,0,0)_70%,#000_100%)]"
          aria-hidden="true"
        />

        <div className={cx(container, "relative z-2 flex flex-col items-center pt-[120px] pb-[114px] text-center lg:items-start lg:pb-[140px] lg:text-left")}>
          <h1 className="font-display leading-none text-white lg:mb-9">
            {/* Reprend l'intro du SplashScreen de l'app : le logo glisse à la
                place du Z pendant que « View » apparaît, glitch, puis le Z le remplace. */}
            <span className="block pr-[.05em] text-[clamp(72px,24vw,120px)] font-black leading-[.95] tracking-[-.065em] lg:-ml-[.16em] lg:text-[clamp(72px,10vw,160px)]">
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
            <span className="-mt-2 block font-sans italic lg:-mt-[17px] text-[clamp(18px,2.2vw,34px)] leading-[1.1] tracking-wide">
              Le premier réseau pour les danseurs
            </span>
          </h1>

          {/* Desktop : badges sous le titre. En mobile, ils sont en bas du hero (au-dessus de « Défiler »). */}
          <div className="hidden lg:block">
            <StoreBadges className="justify-start gap-3.5" badgeClassName="h-14" />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-2 flex flex-col items-center gap-6">
          <div className="lg:hidden">
            <StoreBadges className="justify-center gap-2.5 xs:gap-3.5" badgeClassName="h-12 xs:h-14" />
          </div>

          {/* Bandeau « ViewZ » en boucle, bord à bord (deux copies identiques décalées de 50 % pour une boucle sans saut). */}
          <a href="#fonctionnalites" aria-label="Voir les fonctionnalités" className="block w-full overflow-hidden no-underline">
            <div className="marquee-track flex w-max" aria-hidden="true">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0">
                  {/* Une copie doit être plus large que l'écran (~1 800 px) pour qu'aucun vide n'apparaisse. */}
                  {Array.from({ length: 24 }, (_, index) => (
                    <span key={index} className="px-2 font-display text-2xl leading-none font-thin tracking-[-.02em] text-white/25">
                      ViewZ
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </a>
        </div>
      </section>

      <Features />
    </main>
  );
}
