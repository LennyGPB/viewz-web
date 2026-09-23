import Image from "next/image";
import { cx } from "@/lib/ui";

// TODO : remplacer par les liens des fiches App Store / Google Play une fois publiées.
const APP_STORE_URL = "#";
const PLAY_STORE_URL = "#";

// Badges officiels App Store / Google Play (hero et footer).
export default function StoreBadges({ className, badgeClassName }: { className?: string; badgeClassName: string }) {
  const badge = cx("block w-auto", badgeClassName);

  return (
    <div className={cx("flex flex-wrap items-center", className)}>
      <a href={APP_STORE_URL} className="inline-flex" aria-label="Télécharger ViewZ sur l’App Store">
        <Image src="/images/badges/app-store.svg" alt="Télécharger dans l’App Store" width={120} height={40} className={badge} />
      </a>
      <a href={PLAY_STORE_URL} className="inline-flex" aria-label="Disponible sur Google Play">
        <Image src="/images/badges/google-play.png" alt="Disponible sur Google Play" width={564} height={168} className={badge} />
      </a>
    </div>
  );
}
