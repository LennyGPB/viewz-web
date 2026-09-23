// Ensembles de classes Tailwind réutilisés à plusieurs endroits du site.
// Les couleurs (text-muted, bg-purple, border-line...) sont définies dans le
// @theme de app/globals.css.

export const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");

// Mise en page
export const container = "mx-auto w-[calc(100%_-_40px)] lg:w-[min(1280px,calc(100%_-_64px))]";
export const shellBackground = "bg-bg bg-[radial-gradient(circle_at_70%_10%,rgba(123,62,218,.22),transparent_34%)]";
export const ambientGlow = "pointer-events-none fixed -top-[130px] -right-[180px] size-[420px] rounded-full bg-[#7c3aed] opacity-25 blur-[100px]";

// Marque
export const brandLink = "flex items-center gap-2.5 no-underline";
export const brandMark = "drop-shadow-[0_0_10px_rgba(190,140,255,.5)]";
export const wordmark = "font-display font-black tracking-[-.04em]";

// Texte
export const eyebrow = "text-[11px] font-bold tracking-[.26em] text-brand-soft";

// Boutons
const brandGradient = "bg-linear-135 from-brand-from to-brand-to";
export const btnGradient = cx(brandGradient, "font-extrabold text-white");

// Formulaires
export const field = "flex flex-col gap-1.5";
export const label = "text-xs font-bold text-[#ddd7e8]";
export const input = "rounded-xl border border-line bg-white/5 px-3.5 py-[11px] text-sm text-ink focus:border-brand/60 focus:outline-none";
export const textarea = cx(input, "min-h-[90px] resize-y");

// Blocs (le back-office a ses propres classes dans app/admin/adminUi.ts)
export const contactBox = "rounded-2xl border border-purple/30 bg-purple/7 p-[22px]";
export const dataTable = cx(
  "mt-[18px] w-full border-collapse text-xs xs:text-sm",
  "[&_td]:border-b [&_td]:border-line [&_td]:px-2 [&_td]:py-2.5 [&_td]:text-left [&_td]:align-top [&_td]:leading-normal [&_td]:text-muted",
  "[&_th]:border-b [&_th]:border-line [&_th]:px-2 [&_th]:py-2.5 [&_th]:text-left [&_th]:align-top [&_th]:text-[11px] [&_th]:uppercase [&_th]:tracking-[.08em] [&_th]:text-lavender",
  "xs:[&_td]:px-3.5 xs:[&_td]:py-[13px] xs:[&_th]:px-3.5 xs:[&_th]:py-[13px]",
);