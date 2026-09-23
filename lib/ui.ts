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
export const btnSmallBase = "inline-flex cursor-pointer items-center gap-1.5 rounded-full border-none px-[18px] py-2.5 text-[13px] font-extrabold text-white no-underline hover:-translate-y-px disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60";
export const btnSmall = cx(btnSmallBase, brandGradient);
export const btnSmallDanger = cx(btnSmallBase, "bg-linear-135 from-[#f87171] to-[#b91c1c]");
export const btnGhostSmall = "inline-flex cursor-pointer items-center rounded-full border border-white/40 bg-transparent px-[18px] py-2.5 text-[13px] font-bold text-white hover:border-brand/80";
export const btnGradient = cx(brandGradient, "font-extrabold text-white");
export const iconButton = "inline-flex size-[38px] shrink-0 cursor-pointer items-center justify-center rounded-full border no-underline transition duration-200 disabled:cursor-not-allowed disabled:opacity-50";
export const iconButtonDanger = cx(iconButton, "border-red-400/30 bg-red-400/10 text-red-400 hover:bg-red-400/20");
export const iconButtonEdit = cx(iconButton, "border-brand/30 bg-purple/15 text-brand-pale");

// Formulaires
export const field = "flex flex-col gap-1.5";
export const label = "text-xs font-bold text-[#ddd7e8]";
export const input = "rounded-xl border border-line bg-white/5 px-3.5 py-[11px] text-sm text-ink focus:border-brand/60 focus:outline-none";
export const textarea = cx(input, "min-h-[90px] resize-y");
export const hint = "text-[11px] text-faint";
export const chip = (active: boolean) =>
  cx(
    "cursor-pointer rounded-full border px-3 py-2 text-xs",
    active ? "border-brand/60 bg-purple/25 text-white" : "border-line bg-white/4 text-muted",
  );

// Blocs
export const alertError = "mb-[18px] rounded-[14px] border border-red-400/30 bg-red-400/10 px-[18px] py-3.5 text-[13px] text-danger";
export const adminLoading = "px-5 py-[60px] text-center text-[13px] text-muted";
export const contactBox = "rounded-2xl border border-purple/30 bg-purple/7 p-[22px]";
export const dataTable = cx(
  "mt-[18px] w-full border-collapse text-xs xs:text-sm",
  "[&_td]:border-b [&_td]:border-line [&_td]:px-2 [&_td]:py-2.5 [&_td]:text-left [&_td]:align-top [&_td]:leading-normal [&_td]:text-muted",
  "[&_th]:border-b [&_th]:border-line [&_th]:px-2 [&_th]:py-2.5 [&_th]:text-left [&_th]:align-top [&_th]:text-[11px] [&_th]:uppercase [&_th]:tracking-[.08em] [&_th]:text-lavender",
  "xs:[&_td]:px-3.5 xs:[&_td]:py-[13px] xs:[&_th]:px-3.5 xs:[&_th]:py-[13px]",
);
export const fileDrop = "rounded-[14px] border border-dashed border-line p-4 text-center text-xs text-muted";
