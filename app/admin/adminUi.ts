// Classes Tailwind du back-office. Séparées de lib/ui.ts pour que le design de
// l'admin (sobre, neutre) n'impacte pas le site public. Couleurs admin-* et
// accent définies dans le @theme de app/globals.css.
import { cx } from "@/lib/ui";

export { cx };

// Surfaces
export const surface = "rounded-xl border border-line bg-admin-surface";
export const card = cx(surface, "p-5 sm:p-6");

// Boutons
const btn = "inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3.5 text-[13px] font-semibold no-underline transition-colors disabled:cursor-not-allowed disabled:opacity-50";
export const btnPrimary = cx(btn, "bg-accent text-white hover:bg-accent-hover");
export const btnSecondary = cx(btn, "border border-line bg-white/[.04] text-ink hover:bg-white/[.08]");
export const btnDanger = cx(btn, "bg-red-600 text-white hover:bg-red-700");
export const iconBtn = "inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted no-underline transition-colors hover:bg-white/[.08] hover:text-ink disabled:cursor-not-allowed disabled:opacity-50";
export const iconBtnDanger = cx(iconBtn, "hover:bg-red-500/15 hover:text-red-400");

// Formulaires
export const field = "flex flex-col gap-1.5";
export const label = "text-[13px] font-medium text-lavender";
export const input = "h-10 w-full rounded-lg border border-line bg-white/[.03] px-3 text-sm text-ink transition-colors placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25";
export const textarea = cx(input, "h-auto min-h-[120px] resize-y py-2.5 leading-relaxed");
export const hint = "text-xs text-faint";
export const chip = (active: boolean) =>
  cx(
    "inline-flex h-8 cursor-pointer items-center rounded-lg border px-3 text-[13px] transition-colors",
    active ? "border-accent bg-accent/15 text-white" : "border-line bg-white/[.03] text-muted hover:border-white/20 hover:text-ink",
  );
export const fileInput = cx(
  "block w-full cursor-pointer rounded-lg border border-dashed border-line bg-white/[.02] p-3 text-sm text-muted transition-colors hover:border-white/25",
  "file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-white/[.08] file:px-3 file:py-1.5 file:text-[13px] file:font-semibold file:text-ink",
);
// Bloc de formulaire : titre de section + champs
export const formSection = cx(card, "flex flex-col gap-5");
export const formSectionTitle = "text-sm font-semibold text-ink";

// États
export const alertError = "mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300";
export const loadingState = "px-5 py-16 text-center text-sm text-muted";
export const emptyState = cx(surface, "border-dashed px-5 py-16 text-center text-sm text-muted");

// Recherche
export const searchInput = cx(input, "sm:max-w-[320px]");

// Fenêtres modales
export const modalOverlay = "fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-5";
export const modalPanel = "max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-line bg-admin-raised p-5 sm:rounded-2xl sm:p-6";

// Badge (styles, statuts)
export const badge = "inline-flex items-center rounded-md border border-line bg-white/[.05] px-2 py-0.5 text-xs font-medium text-lavender";
