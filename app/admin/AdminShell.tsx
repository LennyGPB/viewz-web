"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import type { SessionUser } from "@/lib/session";
import AdminIcon, { type AdminIconName } from "./AdminIcon";
import { cx, iconBtn } from "./adminUi";

const NAV: { title?: string; items: { href: string; label: string; icon: AdminIconName }[] }[] = [
  { items: [{ href: "/admin", label: "Vue d'ensemble", icon: "dashboard" }] },
  {
    title: "Contenus",
    items: [
      { href: "/admin/posts", label: "Recherches", icon: "search" },
      { href: "/admin/events", label: "Événements", icon: "calendar" },
      { href: "/admin/spotlights", label: "Scène", icon: "film" },
      { href: "/admin/dance-spots", label: "Spots", icon: "pin" },
    ],
  },
  {
    title: "Communauté",
    items: [
      { href: "/admin/users", label: "Utilisateurs", icon: "users" },
      { href: "/admin/user-media", label: "Médias des profils", icon: "image" },
    ],
  },
  { title: "Réglages", items: [{ href: "/admin/styles", label: "Styles", icon: "tag" }] },
];

const isActive = (pathname: string, href: string) =>
  href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-2.5 no-underline">
      <Image src="/images/viewz-mark.png" alt="" width={18} height={23} />
      <span className="font-display text-base font-black tracking-[-.04em] text-ink">ViewZ</span>
      <span className="rounded-md bg-white/[.07] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">Admin</span>
    </Link>
  );
}

function SidebarContent({ user, pathname, onLogout, isLoggingOut }: {
  user: SessionUser;
  pathname: string;
  onLogout: () => void;
  isLoggingOut: boolean;
}) {
  return (
    <div className="flex h-full flex-col">
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Administration">
        {NAV.map((group, index) => (
          <div key={group.title ?? index} className={cx(index > 0 && "mt-6")}>
            {group.title && (
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-faint">{group.title}</p>
            )}
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cx(
                        "flex h-9 items-center gap-3 rounded-lg px-3 text-sm no-underline transition-colors",
                        active ? "bg-white/[.08] font-semibold text-ink" : "text-muted hover:bg-white/[.04] hover:text-ink",
                      )}
                    >
                      <AdminIcon name={item.icon} size={17} className={active ? "text-brand-light" : undefined} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <Link
          href="/"
          className="mb-1 flex h-9 items-center gap-3 rounded-lg px-3 text-sm text-muted no-underline transition-colors hover:bg-white/[.04] hover:text-ink"
        >
          <AdminIcon name="external" size={17} />
          Voir le site
        </Link>
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/[.08] text-xs font-bold uppercase text-ink">
            {user.username.charAt(0)}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm text-ink">@{user.username}</span>
          <button
            type="button"
            className={iconBtn}
            onClick={onLogout}
            disabled={isLoggingOut}
            aria-label="Se déconnecter"
            title="Se déconnecter"
          >
            <AdminIcon name="logout" size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminShell({ user, children }: { user: SessionUser; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Referme le menu mobile à chaque changement de page.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  const sidebarProps = { user, pathname, onLogout: handleLogout, isLoggingOut };

  return (
    <div className="min-h-screen bg-admin-bg text-ink">
      {/* Barre latérale (ordinateur) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-line bg-admin-surface lg:flex">
        <div className="flex h-14 shrink-0 items-center border-b border-line px-5">
          <Brand />
        </div>
        <SidebarContent {...sidebarProps} />
      </aside>

      {/* Barre du haut (mobile) */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-admin-surface/95 px-4 backdrop-blur lg:hidden">
        <Brand />
        <button type="button" className={iconBtn} onClick={() => setIsMenuOpen(true)} aria-label="Ouvrir le menu" aria-expanded={isMenuOpen}>
          <AdminIcon name="menu" size={20} />
        </button>
      </header>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-[min(280px,85vw)] flex-col border-r border-line bg-admin-surface">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4">
              <Brand />
              <button type="button" className={iconBtn} onClick={() => setIsMenuOpen(false)} aria-label="Fermer le menu">
                <AdminIcon name="close" size={20} />
              </button>
            </div>
            <SidebarContent {...sidebarProps} />
          </aside>
        </div>
      )}

      <main className="lg:pl-60">
        <div className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
