"use client";

import { useCallback } from "react";
import Link from "next/link";
import { btnSmall } from "@/lib/ui";
import AdminResourceList from "../AdminResourceList";
import { getAdminEvents, deleteAdminEvent, type AdminRecord } from "@/lib/adminApi";

interface EventItem extends AdminRecord {
  title: string;
  city?: string | null;
  author?: { username: string };
}

export default function AdminEventsPage() {
  const fetchItems = useCallback(() => getAdminEvents(), []);

  return (
    <AdminResourceList
      title="Événements"
      description="Événements publiés (battles, workshops, soirées...)."
      emptyLabel="Aucun événement pour le moment."
      fetchItems={fetchItems}
      deleteItem={deleteAdminEvent}
      renderTitle={(item) => (item as EventItem).title}
      renderSubtitle={(item) => {
        const event = item as EventItem;
        return `@${event.author?.username ?? "?"} · ${event.city ?? "Sans ville"}`;
      }}
      confirmLabel={(item) => (item as EventItem).title}
      getEditHref={(item) => `/admin/events/${item.id}/edit`}
      headerAction={<Link href="/admin/events/new" className={btnSmall}>+ Nouvel événement</Link>}
    />
  );
}
