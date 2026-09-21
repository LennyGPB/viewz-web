"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import type { SessionUser } from "@/lib/session";

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
      <div className="admin-topbar">
        <div className="admin-topbar-inner">
          <nav className="admin-tabs">
            {TABS.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`admin-tab${pathname === tab.href ? " active" : ""}`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="admin-user">@{user.username}</span>
            <button className="admin-logout" onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? "..." : "Déconnexion"}
            </button>
          </div>
        </div>
      </div>
      <div className="admin-content">{children}</div>
    </>
  );
}
