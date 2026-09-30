import { rarityOf, type BadgeRarity } from "@/lib/badges";
import { cx } from "./adminUi";

// Icône d'un badge telle que l'app l'affiche (MaterialIcons) : même police, chargée
// depuis Google Fonts (les noms s'écrivent avec « _ » au lieu de « - »).
export default function BadgeIcon({ icon, rarity, size = "md" }: { icon: string; rarity: BadgeRarity; size?: "sm" | "md" }) {
  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" precedence="default" />
      <span
        aria-hidden="true"
        className={cx(
          "inline-flex shrink-0 items-center justify-center rounded-full border font-['Material_Icons'] leading-none",
          size === "sm" ? "size-7 text-base" : "size-10 text-[22px]",
          rarityOf(rarity).className,
        )}
      >
        {icon.replace(/-/g, "_")}
      </span>
    </>
  );
}
