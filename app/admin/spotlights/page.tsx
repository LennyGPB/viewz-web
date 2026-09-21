"use client";

import { useCallback } from "react";
import AdminResourceList from "../AdminResourceList";
import { getAdminSpotlights, deleteAdminSpotlight, type AdminRecord } from "@/lib/adminApi";

interface SpotlightItem extends AdminRecord {
  title: string;
  mediaType: "IMAGE" | "VIDEO";
  author?: { username: string };
}

export default function AdminSpotlightsPage() {
  const fetchItems = useCallback(() => getAdminSpotlights(), []);

  return (
    <AdminResourceList
      title="Vidéos / Images"
      description="Contenus de la Scène (vitrine vidéos et images)."
      emptyLabel="Aucun contenu pour le moment."
      fetchItems={fetchItems}
      deleteItem={deleteAdminSpotlight}
      renderTitle={(item) => (item as SpotlightItem).title}
      renderSubtitle={(item) => {
        const spotlight = item as SpotlightItem;
        return `@${spotlight.author?.username ?? "?"} · ${spotlight.mediaType === "IMAGE" ? "Image" : "Vidéo"}`;
      }}
      confirmLabel={(item) => (item as SpotlightItem).title}
    />
  );
}
