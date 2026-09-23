"use client";

import { useEffect, useState } from "react";
import { getAdminStats, type AdminStats } from "@/lib/adminApi";
import { alertError } from "@/lib/ui";
import AdminHeading from "./AdminHeading";

const CARDS: { key: keyof AdminStats; label: string }[] = [
  { key: "posts", label: "Recherches" },
  { key: "events", label: "Événements" },
  { key: "spotlights", label: "Vidéos / Images" },
  { key: "danceSpots", label: "Spots" },
  { key: "users", label: "Utilisateurs" },
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
        description="Administration ViewZ — gère les recherches, événements, contenus et utilisateurs."
      />

      {error && <div className={alertError}>{error}</div>}

      <div className="mb-[30px] grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3.5">
        {CARDS.map((card) => (
          <div className="rounded-[18px] border border-line bg-white/4 p-5" key={card.key}>
            <strong className="block text-[26px] text-white">{stats ? stats[card.key] : "—"}</strong>
            <span className="text-xs text-muted">{card.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
