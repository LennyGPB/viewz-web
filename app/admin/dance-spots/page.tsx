"use client";

import { useCallback } from "react";
import Link from "next/link";
import AdminResourceList from "../AdminResourceList";
import { getAdminDanceSpots, deleteAdminDanceSpot, type AdminRecord } from "@/lib/adminApi";

interface DanceSpotItem extends AdminRecord {
  name: string;
  address: string;
}

export default function AdminDanceSpotsPage() {
  const fetchItems = useCallback(() => getAdminDanceSpots(), []);

  return (
    <AdminResourceList
      title="Spots de danse"
      description="Lieux référencés sur la carte."
      emptyLabel="Aucun spot pour le moment."
      fetchItems={fetchItems}
      deleteItem={deleteAdminDanceSpot}
      renderTitle={(item) => (item as DanceSpotItem).name}
      renderSubtitle={(item) => (item as DanceSpotItem).address}
      confirmLabel={(item) => (item as DanceSpotItem).name}
      headerAction={<Link href="/admin/dance-spots/new" className="btn-small">+ Nouveau spot</Link>}
    />
  );
}
