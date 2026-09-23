import Image from "next/image";
import Link from "next/link";
import { brandLink, brandMark, container, cx, wordmark } from "@/lib/ui";
import StoreBadges from "./StoreBadges";

const legalLinks = [
  { href: "/cgu", label: "Conditions générales" },
  { href: "/politique-confidentialite", label: "Politique de confidentialité" },
  { href: "/securite-enfants", label: "Sécurité des enfants" },
  { href: "/suppression-compte", label: "Suppression de compte" },
];

const columnTitle = "mb-3 text-[10px] font-bold uppercase tracking-[.2em] text-brand-soft";
const footerLink = "text-xs text-dim no-underline hover:text-brand-light";

export default function Footer() {
  return (
    <footer id="footer" className="relative z-1 border-t border-line bg-black">
      <div className={cx(container, "grid grid-cols-2 gap-8 pt-10 pb-7 md:grid-cols-[1.4fr_1fr_1fr]")}>
        <div className="col-span-full md:col-span-1">
          <Link href="/" className={brandLink}>
            <Image src="/images/viewz-mark.png" alt="" width={18} height={23} className={brandMark} />
            <span className={cx(wordmark, "text-base")}>ViewZ</span>
          </Link>
          <p className="mt-2.5 text-xs text-faint">L’app qui connecte les danseurs.</p>
          <StoreBadges className="mt-5 gap-2.5" badgeClassName="h-10" />
        </div>

        <div>
          <p className={columnTitle}>Légal</p>
          <nav className="flex flex-col gap-2" aria-label="Informations légales">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className={footerLink}>{link.label}</Link>
            ))}
          </nav>
        </div>

        <div>
          <p className={columnTitle}>Contact</p>
          <nav className="flex flex-col gap-2" aria-label="Contact">
            <Link href="/contact" className={footerLink}>Formulaire de contact</Link>
            <a href="mailto:viewz-app@pm.me" className={footerLink}>viewz-app@pm.me</a>
          </nav>
        </div>
      </div>

      <div className={cx(container, "border-t border-line pt-4 pb-6 text-[11px] text-[#5f5968]")}>
        <span>© {new Date().getFullYear()} ViewZ. Tous droits réservés.</span>
      </div>
    </footer>
  );
}
