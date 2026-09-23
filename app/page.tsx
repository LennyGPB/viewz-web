import Image from "next/image";
import { container, cx } from "@/lib/ui";
import Features from "./components/Features";
import StoreBadges from "./components/StoreBadges";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <section className="relative z-1 flex min-h-svh flex-col justify-center overflow-hidden bg-black">
        <Image
          src="/images/heroback5.png"
          alt=""
          fill
          preload
          quality={95}
          sizes="100vw"
          className="origin-[85%_50%] scale-115 object-cover object-[85%_center] blur-[3px] lg:origin-center lg:scale-105 lg:object-right lg:blur-[6px]"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.2)_0%,rgba(0,0,0,.7)_60%,#000_100%)] lg:bg-[linear-gradient(90deg,rgba(0,0,0,.75)_0%,rgba(0,0,0,.35)_45%,rgba(0,0,0,0)_70%),linear-gradient(180deg,rgba(0,0,0,0)_70%,#000_100%)]"
          aria-hidden="true"
        />

        <div className={cx(container, "relative z-2 flex flex-col items-center pt-[120px] pb-[150px] text-center lg:items-start lg:pb-[140px] lg:text-left")}>
          <h1 className="mb-9 font-display leading-none text-white">
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
            <span className="mt-2 block font-sans italic lg:-mt-[17px] text-[clamp(18px,2.2vw,34px)] leading-[1.1] tracking-wide">
              Le premier réseau pour les danseurs
            </span>
          </h1>

          <StoreBadges className="justify-center gap-2.5 xs:gap-3.5 lg:justify-start" badgeClassName="h-12 xs:h-14" />
        </div>

        <div className={cx(container, "absolute inset-x-0 bottom-0 z-2 flex justify-center pb-8")}>
          <a
            href="#fonctionnalites"
            className="flex flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[.22em] text-lavender no-underline hover:text-brand-light"
          >
            <span>Défiler</span>
            <svg className="scroll-bob text-brand" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>
        </div>
      </section>

      <Features />
    </main>
  );
}
