import Image from "next/image";
import { cx } from "@/lib/ui";

const APP_STORE_URL = "https://apps.apple.com/us/app/viewz/id6807129457";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.hiden.viewz";

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
