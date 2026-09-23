"use client";

import { use, useEffect, useState } from "react";
import { getAdminEvent, type AdminRecord } from "@/lib/adminApi";
import { adminLoading, alertError } from "@/lib/ui";
import EventForm, { type EventFormInitial } from "../../EventForm";

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [event, setEvent] = useState<AdminRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAdminEvent(id)
      .then(setEvent)
      .catch((err) => setError(err instanceof Error ? err.message : "Chargement impossible."))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <div className={adminLoading}>Chargement...</div>;
  if (error || !event) return <div className={alertError}>{error ?? "Événement introuvable."}</div>;

  const initial: EventFormInitial = {
    title: String(event.title ?? ""),
    description: String(event.description ?? ""),
    city: (event.city as string | null) ?? null,
    latitude: (event.latitude as number | null) ?? null,
    longitude: (event.longitude as number | null) ?? null,
    eventType: String(event.eventType ?? "AUTRE"),
    scheduleType: String(event.scheduleType ?? "SPECIFIC"),
    eventDate: (event.eventDate as string | null) ?? null,
    recurrenceDays: (event.recurrenceDays as number[] | undefined) ?? [],
    recurrenceTime: (event.recurrenceTime as string | null) ?? null,
    price: (event.price as number | null) ?? null,
    link: (event.link as string | null) ?? null,
    styles: (event.styles as { id: string; name: string }[] | undefined) ?? [],
    image: (event.image as string | null) ?? null,
    showOrganizer: (event.showOrganizer as boolean | undefined) ?? true,
  };

  return <EventForm eventId={id} initial={initial} />;
}
