import type { ReactNode } from "react";
import { ambientGlow, cx, eyebrow, shellBackground } from "@/lib/ui";

export type LegalSection = { id: string; number: string; title: string; content: ReactNode };

// Styles du contenu brut des articles (paragraphes, listes, liens...) écrit dans chaque page.
const sectionProse = cx(
  "[&_p]:text-[15px] [&_p]:leading-[1.8] [&_p]:text-muted",
  "[&_li]:text-[15px] [&_li]:leading-[1.8] [&_li]:text-muted",
  "[&_ul]:mt-3.5 [&_ul]:pl-5",
  "[&_h3]:mt-[26px] [&_h3]:mb-2.5 [&_h3]:text-base [&_h3]:text-[#ddd7e8]",
  "[&_a]:text-brand-light",
);

export default function LegalLayout({ title, kicker, sections }: { title: string; kicker: string; sections: LegalSection[] }) {
  return (
    <main className={cx("relative min-h-screen overflow-hidden", shellBackground)}>
      <div className={ambientGlow} />
      <div className="relative mx-auto grid w-[calc(100%_-_32px)] grid-cols-1 gap-11 pt-[52px] pb-[110px] xs:w-[calc(100%_-_40px)] md:w-[min(1120px,calc(100%_-_40px))] md:grid-cols-[250px_minmax(0,720px)] md:gap-[70px] md:pt-[86px]">
        <aside className="self-start md:sticky md:top-[120px]">
          <p className={eyebrow}>{kicker}</p>
          <h1 className="my-4 text-4xl leading-[1.05] tracking-[-.045em]">{title}</h1>
          <p className="text-xs leading-normal text-faint">Dernière mise à jour<br />19 août 2026</p>
          <nav className="mt-[34px] hidden border-t border-line pt-6 md:block" aria-label="Sommaire">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="block py-1.5 text-xs text-dim no-underline hover:text-brand-light">
                {s.number} · {s.title}
              </a>
            ))}
          </nav>
        </aside>

        <article className="min-w-0">
          {sections.map((s) => (
            <section
              key={s.id}
              id={s.id}
              className={cx("mb-11 scroll-mt-[100px] border-b border-line pb-11 last:border-b-0", sectionProse)}
            >
              <span className="font-mono text-[11px] font-bold tracking-[.12em] text-brand">ARTICLE {s.number}</span>
              <h2 className="mt-2.5 mb-[18px] text-[25px] tracking-[-.025em]">{s.title}</h2>
              {s.content}
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}
