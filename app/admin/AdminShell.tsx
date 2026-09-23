"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import type { SessionUser } from "@/lib/session";
import { cx } from "@/lib/ui";

const TABS = [
  { href: "/admin", label: "Vue d'ensemble" },
  { href: "/admin/posts", label: "Recherches" },
  { href: "/admin/events", label: "Événements" },
  { href: "/admin/spotlights", label: "Vidéos / Images" },
  { href: "/admin/dance-spots", label: "Spots" },
  { href: "/admin/users", label: "Utilisateurs" },
];

export default function AdminShell({ user, children }: { user: SessionUser; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <>
      <div className="sticky top-0 z-9 border-b border-line bg-bg/72 backdrop-blur-[18px]">
        <div className="mx-auto flex w-[min(1120px,calc(100%_-_40px))] flex-wrap items-center justify-between gap-4 py-3.5">
          <nav className="flex flex-wrap gap-1.5">
            {TABS.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={cx(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold no-underline transition duration-200",
                  pathname === tab.href
                    ? "border-brand/60 bg-purple/22 text-white"
                    : "border-line bg-white/4 text-muted hover:border-brand/40 hover:text-white",
                )}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted">@{user.username}</span>
            <button
              className="cursor-pointer rounded-full border border-line bg-transparent px-3.5 py-2 text-xs font-bold text-danger hover:border-red-400/50 hover:bg-red-400/8"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "..." : "Déconnexion"}
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto w-[min(1120px,calc(100%_-_40px))] pt-9 pb-[100px]">{children}</div>
    </>
  );
}
