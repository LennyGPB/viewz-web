"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAdminStats, type AdminStats } from "@/lib/adminApi";
import AdminHeading from "./AdminHeading";
import AdminIcon, { type AdminIconName } from "./AdminIcon";
import { alertError, btnSecondary, cx, surface } from "./adminUi";

const CARDS: { key: keyof AdminStats; label: string; href: string; icon: AdminIconName }[] = [
  { key: "users", label: "Utilisateurs", href: "/admin/users", icon: "users" },
  { key: "posts", label: "Recherches", href: "/admin/posts", icon: "search" },
  { key: "events", label: "Événements", href: "/admin/events", icon: "calendar" },
  { key: "spotlights", label: "Scène", href: "/admin/spotlights", icon: "film" },
  { key: "danceSpots", label: "Spots", href: "/admin/dance-spots", icon: "pin" },
];

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : "Chargement impossible."));
  }, []);

  return (
    <div>
      <AdminHeading
        title="Vue d'ensemble"
        description="Suis l'activité de ViewZ et accède rapidement à chaque section."
        action={
          <>
            <Link href="/admin/events/new" className={btnSecondary}><AdminIcon name="plus" size={16} />Événement</Link>
            <Link href="/admin/dance-spots/new" className={btnSecondary}><AdminIcon name="plus" size={16} />Spot</Link>
          </>
        }
      />

      {error && <div className={alertError}>{error}</div>}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">
        {CARDS.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className={cx(surface, "group flex flex-col gap-4 p-4 no-underline transition-colors hover:border-white/20 hover:bg-admin-raised sm:p-5")}
          >
            <span className="flex items-center justify-between text-muted">
              <span className="text-[13px] font-medium">{card.label}</span>
              <AdminIcon name={card.icon} size={17} className="text-faint transition-colors group-hover:text-brand-light" />
            </span>
            <strong className="text-2xl font-bold tabular-nums text-ink sm:text-3xl">
              {stats ? stats[card.key].toLocaleString("fr-FR") : <span className="inline-block h-8 w-12 animate-pulse rounded-md bg-white/[.06] align-middle" />}
            </strong>
          </Link>
        ))}
      </div>
    </div>
  );
}
