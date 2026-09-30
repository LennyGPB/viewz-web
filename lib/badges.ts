// Badges du profil : libellés et couleurs du back-office. Même liste d'icônes que
// l'API (viewz-nest/src/badges/badge-icons.ts) et que l'app (MaterialIcons).

export type BadgeRarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
export type BadgeCriterion = "POSTS" | "APPROVED_SPOTS" | "SESSIONS";

export const RARITIES: { value: BadgeRarity; label: string; className: string }[] = [
  { value: "COMMON", label: "Commun", className: "border-slate-300/40 bg-slate-300/10 text-slate-200" },
  { value: "RARE", label: "Rare", className: "border-sky-400/40 bg-sky-400/10 text-sky-200" },
  { value: "EPIC", label: "Épique", className: "border-pink-400/40 bg-pink-400/10 text-pink-200" },
  { value: "LEGENDARY", label: "Légendaire", className: "border-violet-400/60 bg-violet-500/20 text-violet-100 shadow-[0_0_14px_rgba(167,101,255,.45)]" },
];
export const rarityOf = (value: BadgeRarity) => RARITIES.find((rarity) => rarity.value === value) ?? RARITIES[0];

export const CRITERIA: { value: BadgeCriterion; label: string; unit: string }[] = [
  { value: "POSTS", label: "Annonces postées", unit: "annonces" },
  { value: "APPROVED_SPOTS", label: "Spots approuvés", unit: "spots" },
  { value: "SESSIONS", label: "Sessions déclarées", unit: "sessions" },
];
export const criterionOf = (value: BadgeCriterion | null) => CRITERIA.find((criterion) => criterion.value === value);

export const BADGE_ICONS: { value: string; label: string }[] = [
  { value: "workspace-premium", label: "Médaille" },
  { value: "military-tech", label: "Décoration" },
  { value: "emoji-events", label: "Trophée" },
  { value: "star", label: "Étoile" },
  { value: "auto-awesome", label: "Étincelles" },
  { value: "diamond", label: "Diamant" },
  { value: "rocket-launch", label: "Fusée" },
  { value: "flag", label: "Drapeau" },
  { value: "campaign", label: "Mégaphone" },
  { value: "groups", label: "Groupe" },
  { value: "place", label: "Épingle" },
  { value: "explore", label: "Boussole" },
  { value: "map", label: "Carte" },
  { value: "local-fire-department", label: "Flamme" },
  { value: "bolt", label: "Éclair" },
  { value: "favorite", label: "Cœur" },
  { value: "music-note", label: "Note" },
  { value: "celebration", label: "Fête" },
  { value: "verified", label: "Vérifié" },
];
