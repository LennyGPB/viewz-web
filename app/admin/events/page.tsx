"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { deleteAdminEvent, getAdminEvents } from "@/lib/adminApi";
import AdminHeading from "../AdminHeading";
import AdminIcon from "../AdminIcon";
import AdminModal from "../AdminModal";
import {
  alertError, badge, btnDanger, btnPrimary, btnSecondary, chip, cx, emptyState, iconBtn, iconBtnDanger, loadingState, searchInput, surface,
} from "../adminUi";

interface EventItem {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  city?: string | null;
  eventDate?: string | null;
  eventType: string;
  scheduleType: string;
  recurrenceDays?: number[];
  recurrenceTime?: string | null;
  price?: number | null;
  author?: { username: string };
}

// Mêmes types et libellés que les filtres de l'app.
const EVENT_TYPES: [string, string][] = [
  ["COURS_DE_DANSE", "Cours"], ["BATTLE", "Battle"], ["SPECTACLE", "Spectacle"], ["TOURNAGE", "Tournage"],
  ["SOIREE", "Soirée"], ["STAGE", "Stage"], ["WORKSHOP", "Workshop"], ["FESTIVAL", "Festival"], ["AUTRE", "Autre"],
];
const TYPE_LABELS = Object.fromEntries(EVENT_TYPES);
const DAY_NAMES = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

// Même règle que l'app : passé une fois sa journée terminée, jamais pour un récurrent.
const isPast = (event: EventItem) => Boolean(event.eventDate) && new Date(event.eventDate!) < startOfToday();

const scheduleLabel = (event: EventItem) => {
  if (event.scheduleType === "RECURRING") {
    const days = (event.recurrenceDays ?? []).map((day) => DAY_NAMES[day]).join(", ");
    return `Tous les ${days}${event.recurrenceTime ? ` à ${event.recurrenceTime}` : ""}`;
  }
  if (!event.eventDate) return "Date à venir";
  return new Date(event.eventDate).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
};

const normalize = (value: string) => value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [pendingDelete, setPendingDelete] = useState<EventItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    getAdminEvents()
      .then((data) => setEvents(data as unknown as EventItem[]))
      .catch((err) => setError(err instanceof Error ? err.message : "Chargement impossible."))
      .finally(() => setIsLoading(false));
  }, []);

  // Filtrage local (l'API renvoie jusqu'à 200 événements) : à venir d'abord,
  // du plus proche au plus lointain, puis les passés, du plus récent au plus ancien.
  const visibleEvents = useMemo(() => {
    const query = normalize(search.trim());
    const filtered = events.filter((event) => {
      if (types.length && !types.includes(event.eventType)) return false;
      if (!query) return true;
      return [event.title, event.city ?? "", event.author?.username ?? ""].some((field) => normalize(field).includes(query));
    });
    const time = (event: EventItem) => (event.eventDate ? new Date(event.eventDate).getTime() : Infinity);
    const upcoming = filtered.filter((event) => !isPast(event)).sort((a, b) => time(a) - time(b));
    const past = filtered.filter(isPast).sort((a, b) => time(b) - time(a));
    return [...upcoming, ...past];
  }, [events, search, types]);

  const toggleType = (type: string) =>
    setTypes((current) => (current.includes(type) ? current.filter((t) => t !== type) : [...current, type]));

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteAdminEvent(pendingDelete.id);
      setEvents((current) => current.filter((event) => event.id !== pendingDelete.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible.");
    } finally {
      setIsDeleting(false);
      setPendingDelete(null);
    }
  };

  return (
    <div>
      <AdminHeading
        title="Événements"
        description="Événements publiés (battles, workshops, soirées...). À venir d'abord, puis les passés."
        action={
          <Link href="/admin/events/new" className={btnPrimary}>
            <AdminIcon name="plus" size={16} />
            Nouvel événement
          </Link>
        }
      />

      <div className="mb-5 flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            className={searchInput}
            placeholder="Rechercher par titre, ville ou organisateur..."
            aria-label="Rechercher un événement"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {!isLoading && (
            <span className="text-[13px] text-faint">
              {visibleEvents.length} événement{visibleEvents.length > 1 ? "s" : ""}
              {visibleEvents.length !== events.length && ` sur ${events.length}`}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par type">
          <button type="button" className={chip(types.length === 0)} onClick={() => setTypes([])}>Tous</button>
          {EVENT_TYPES.map(([value, label]) => (
            <button key={value} type="button" className={chip(types.includes(value))} aria-pressed={types.includes(value)} onClick={() => toggleType(value)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className={alertError}>{error}</div>}

      {isLoading ? (
        <div className={loadingState}>Chargement...</div>
      ) : events.length === 0 ? (
        <div className={emptyState}>Aucun événement pour le moment.</div>
      ) : visibleEvents.length === 0 ? (
        <div className={emptyState}>
          Aucun événement ne correspond à ta recherche.
          <button type="button" className={cx(btnSecondary, "mx-auto mt-4 flex")} onClick={() => { setSearch(""); setTypes([]); }}>
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleEvents.map((event) => {
            const past = isPast(event);
            return (
              <article key={event.id} className={cx(surface, "group relative flex flex-col overflow-hidden transition-colors hover:border-white/20")}>
                <div className={cx("relative aspect-[16/9] bg-admin-raised", past && "opacity-60")}>
                  {event.image ? (
                    <img src={event.image} alt="" loading="lazy" className="size-full object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center text-faint">
                      <AdminIcon name="calendar" size={32} />
                    </div>
                  )}
                  <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                    <span className="rounded-md bg-black/75 px-2 py-0.5 text-xs font-semibold text-white">
                      {TYPE_LABELS[event.eventType] ?? event.eventType}
                    </span>
                    {past && <span className="rounded-md bg-black/75 px-2 py-0.5 text-xs font-medium text-muted">Passé</span>}
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-2 p-4">
                  <h2 className="m-0 line-clamp-2 text-[15px] font-semibold leading-snug text-ink">
                    {/* Toute la carte ouvre la modification */}
                    <Link href={`/admin/events/${event.id}/edit`} className="text-inherit no-underline after:absolute after:inset-0">
                      {event.title}
                    </Link>
                  </h2>
                  <div className="flex flex-col gap-1 text-[13px] text-muted">
                    <span className="flex items-center gap-1.5">
                      <AdminIcon name="calendar" size={14} className="shrink-0" />
                      <span className="truncate">{scheduleLabel(event)}</span>
                    </span>
                    {event.city && (
                      <span className="flex items-center gap-1.5">
                        <AdminIcon name="pin" size={14} className="shrink-0" />
                        <span className="truncate">{event.city}</span>
                      </span>
                    )}
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                    <span className="flex min-w-0 items-center gap-2 text-xs text-faint">
                      <span className="truncate">@{event.author?.username ?? "?"}</span>
                      {event.price != null && <span className={badge}>{event.price === 0 ? "Gratuit" : `${event.price} €`}</span>}
                    </span>
                    {/* Au-dessus du lien qui couvre la carte */}
                    <span className="relative z-1 flex shrink-0 gap-1">
                      <Link href={`/admin/events/${event.id}/edit`} className={iconBtn} aria-label="Modifier" title="Modifier">
                        <AdminIcon name="edit" />
                      </Link>
                      <button type="button" className={iconBtnDanger} onClick={() => setPendingDelete(event)} aria-label="Supprimer" title="Supprimer">
                        <AdminIcon name="trash" />
                      </button>
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {pendingDelete && (
        <AdminModal
          title="Confirmer la suppression"
          onClose={() => (isDeleting ? null : setPendingDelete(null))}
          footer={
            <>
              <button type="button" className={btnSecondary} disabled={isDeleting} onClick={() => setPendingDelete(null)}>Annuler</button>
              <button type="button" className={btnDanger} disabled={isDeleting} onClick={confirmDelete}>
                {isDeleting ? "Suppression..." : "Supprimer"}
              </button>
            </>
          }
        >
          <p className="m-0 text-sm leading-relaxed text-muted">
            Supprimer définitivement <strong className="text-ink">« {pendingDelete.title} »</strong> ? Cette action est irréversible.
          </p>
        </AdminModal>
      )}
    </div>
  );
}
