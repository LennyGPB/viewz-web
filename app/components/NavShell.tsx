"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cx } from "@/lib/ui";

// Seule partie client de la navbar : passe le fond en glassmorphism dès que
// la page défile. Le contenu (logo, liens, NavCta serveur) arrive en children.
export default function NavShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-b border-line bg-bg/55 backdrop-blur-[18px] backdrop-saturate-[1.4]"
          : "bg-linear-to-b from-bg/85 to-bg/0",
      )}
    >
      {children}
    </header>
  );
}
