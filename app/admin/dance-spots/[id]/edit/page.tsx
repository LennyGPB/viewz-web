"use client";

import { use, useEffect, useState } from "react";
import { getAdminDanceSpot, type AdminRecord } from "@/lib/adminApi";
import { adminLoading, alertError } from "@/lib/ui";
import DanceSpotForm, { type DanceSpotFormInitial } from "../../DanceSpotForm";

export default function EditDanceSpotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [spot, setSpot] = useState<AdminRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAdminDanceSpot(id)
      .then(setSpot)
      .catch((err) => setError(err instanceof Error ? err.message : "Chargement impossible."))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <div className={adminLoading}>Chargement...</div>;
  if (error || !spot) return <div className={alertError}>{error ?? "Spot introuvable."}</div>;

  const initial: DanceSpotFormInitial = {
    name: String(spot.name ?? ""),
    address: String(spot.address ?? ""),
    type: String(spot.type ?? "AUTRE"),
    latitude: Number(spot.latitude ?? 0),
    longitude: Number(spot.longitude ?? 0),
    description: (spot.description as string | null) ?? null,
    images: (spot.images as string[] | undefined) ?? [],
    imageObjectKeys: (spot.imageObjectKeys as string[] | undefined) ?? [],
  };

  return <DanceSpotForm spotId={id} initial={initial} />;
}
