import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { brandLink, brandMark, container, cx, wordmark } from "@/lib/ui";
import MobileMenu from "./MobileMenu";
import NavCta, { navCtaBase, navCtaSizes } from "./NavCta";
import NavShell from "./NavShell";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/#fonctionnalites", label: "Fonctionnalités" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <NavShell>
      <div className={cx(container, "flex h-[84px] items-center justify-between gap-6")}>
        <div className="flex items-center gap-12">
          <Link href="/" className={brandLink}>
            <Image src="/images/viewz-mark.png" alt="" width={24} height={30} className={brandMark} />
            <span className={cx(wordmark, "text-xl")}>ViewZ</span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Navigation principale">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] font-semibold uppercase tracking-[.14em] text-lavender no-underline hover:text-brand-light"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden lg:block">
          <Suspense fallback={<span className={cx(navCtaBase, navCtaSizes.sm, "opacity-0")}>Connexion</span>}>
            <NavCta />
          </Suspense>
        </div>

        <MobileMenu links={links}>
          <Suspense fallback={<span className={cx(navCtaBase, navCtaSizes.lg, "opacity-0")}>Connexion</span>}>
            <NavCta size="lg" />
          </Suspense>
        </MobileMenu>
      </div>
    </NavShell>
  );
}
