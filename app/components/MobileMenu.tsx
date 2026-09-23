"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { cx } from "@/lib/ui";

// Menu burger (mobile uniquement). Le bouton de compte (Connexion /
// Administration) est rendu côté serveur et arrive en children.
export default function MobileMenu({ links, children }: { links: { href: string; label: string }[]; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Referme le menu après une navigation.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        className="relative flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-md"
      >
        <span className={cx("absolute h-0.5 w-5 rounded-full bg-current transition duration-300", open ? "rotate-45" : "-translate-y-1.5")} />
        <span className={cx("absolute h-0.5 w-5 rounded-full bg-current transition duration-300", open && "opacity-0")} />
        <span className={cx("absolute h-0.5 w-5 rounded-full bg-current transition duration-300", open ? "-rotate-45" : "translate-y-1.5")} />
      </button>

      <div
        id="mobile-menu"
        className={cx(
          "absolute inset-x-0 top-full z-40 flex h-[calc(100dvh_-_84px)] flex-col gap-10 overflow-y-auto bg-black/95 px-5 pt-8 pb-10 backdrop-blur-xl transition duration-300",
          open ? "visible opacity-100" : "invisible -translate-y-2 opacity-0",
        )}
      >
        <nav className="flex flex-col" aria-label="Navigation mobile">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-line py-5 text-2xl font-extrabold tracking-[-.02em] text-white no-underline hover:text-brand-light"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div onClick={() => setOpen(false)}>{children}</div>
      </div>
    </div>
  );
}
