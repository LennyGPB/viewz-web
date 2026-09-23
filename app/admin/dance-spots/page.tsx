"use client";

import { useCallback } from "react";
import Link from "next/link";
import AdminIcon from "../AdminIcon";
import { btnPrimary } from "../adminUi";
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
      getEditHref={(item) => `/admin/dance-spots/${item.id}/edit`}
      headerAction={<Link href="/admin/dance-spots/new" className={btnPrimary}><AdminIcon name="plus" size={16} />Nouveau spot</Link>}
    />
  );
}
