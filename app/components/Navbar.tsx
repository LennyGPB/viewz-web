import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import NavCta from "./NavCta";

export default function Navbar() {
  return (
    <header className="floating-nav">
      <div className="floating-nav-inner">
        <Link href="/" className="floating-nav-brand">
          <Image src="/images/viewz-mark.png" alt="" width={28} height={35} className="floating-nav-mark" />
          <span className="wordmark">ViewZ</span>
        </Link>

        <Suspense fallback={<span className="nav-cta" style={{ opacity: 0 }}>Connexion</span>}>
          <NavCta />
        </Suspense>
      </div>
    </header>
  );
}
