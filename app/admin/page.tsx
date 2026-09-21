"use client";

import { useEffect, useState } from "react";
import { getAdminStats, type AdminStats } from "@/lib/adminApi";

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
      <div className="admin-heading">
        <div>
          <h1>Vue d&apos;ensemble</h1>
          <p>Administration ViewZ — gère les recherches, événements, contenus et utilisateurs.</p>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-stats">
        {CARDS.map((card) => (
          <div className="admin-stat-card" key={card.key}>
            <strong>{stats ? stats[card.key] : "—"}</strong>
            <span>{card.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
