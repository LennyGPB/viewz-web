"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { createEvent, updateAdminEvent, getAdminStyles, getPresignedUpload, uploadFileToR2 } from "@/lib/adminApi";
import AdminHeading from "../AdminHeading";
import PlacesInput from "../PlacesInput";
import {
  alertError, btnPrimary, btnSecondary, chip, cx, field, fileInput, formSection, formSectionTitle, hint, input, label, textarea,
} from "../adminUi";

const EVENT_TYPES = [
  "COURS_DE_DANSE", "BATTLE", "SPECTACLE", "TOURNAGE", "SOIREE", "STAGE", "WORKSHOP", "FESTIVAL", "AUTRE",
];
const EVENT_TYPE_LABELS: Record<string, string> = {
  COURS_DE_DANSE: "Cours de danse", BATTLE: "Battle", SPECTACLE: "Spectacle", TOURNAGE: "Tournage",
  SOIREE: "Soirée", STAGE: "Stage", WORKSHOP: "Workshop", FESTIVAL: "Festival", AUTRE: "Autre",
};
const DAYS = [
  { value: 1, label: "Lun" }, { value: 2, label: "Mar" }, { value: 3, label: "Mer" },
  { value: 4, label: "Jeu" }, { value: 5, label: "Ven" }, { value: 6, label: "Sam" }, { value: 0, label: "Dim" },
];

export interface EventFormInitial {
  title: string;
  description: string;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  eventType: string;
  scheduleType: string;
  eventDate?: string | null;
  recurrenceDays?: number[];
  recurrenceTime?: string | null;
  price?: number | null;
  link?: string | null;
  styles?: { id: string; name: string }[];
  image?: string | null;
  showOrganizer?: boolean;
}

interface EventFormProps {
  eventId?: string;
  initial?: EventFormInitial;
}

const toDatetimeLocal = (iso?: string | null) => {
  if (!iso) return "";
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default function EventForm({ eventId, initial }: EventFormProps) {
  const router = useRouter();
  const isEditing = Boolean(eventId);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [latitude, setLatitude] = useState<number | null>(initial?.latitude ?? null);
  const [longitude, setLongitude] = useState<number | null>(initial?.longitude ?? null);
  const [eventType, setEventType] = useState(initial?.eventType ?? "AUTRE");
  const [scheduleType, setScheduleType] = useState<"SPECIFIC" | "RECURRING">(
    (initial?.scheduleType as "SPECIFIC" | "RECURRING") ?? "SPECIFIC",
  );
  const [eventDate, setEventDate] = useState(toDatetimeLocal(initial?.eventDate));
  const [recurrenceDays, setRecurrenceDays] = useState<number[]>(initial?.recurrenceDays ?? []);
  const [recurrenceTime, setRecurrenceTime] = useState(initial?.recurrenceTime ?? "");
  const [price, setPrice] = useState(initial?.price != null ? String(initial.price) : "");
  const [link, setLink] = useState(initial?.link ?? "");
  const [selectedStyles, setSelectedStyles] = useState<string[]>(
    initial?.styles?.map((s) => s.name) ?? [],
  );
  const [showOrganizer, setShowOrganizer] = useState(initial?.showOrganizer ?? true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initial?.image ?? null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Liste lue en base : ce sont les seuls noms de style acceptés par l'API.
  const [availableStyles, setAvailableStyles] = useState<string[] | null>(null);
  const [stylesError, setStylesError] = useState(false);

  useEffect(() => {
    getAdminStyles()
      .then((styles) => setAvailableStyles(styles.map((s) => s.name)))
      .catch(() => setStylesError(true));
  }, []);

  const toggleDay = (day: number) => {
    setRecurrenceDays((current) =>
      current.includes(day) ? current.filter((d) => d !== day) : [...current, day].sort()
    );
  };

  const toggleStyle = (style: string) => {
    setSelectedStyles((current) =>
      current.includes(style) ? current.filter((s) => s !== style) : [...current, style]
    );
  };

  const handleFile = (file: File | null) => {
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : initial?.image ?? null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (scheduleType === "SPECIFIC" && !eventDate) {
      setError("La date est requise pour un événement ponctuel.");
      return;
    }
    if (scheduleType === "RECURRING" && (recurrenceDays.length === 0 || !recurrenceTime)) {
      setError("Jours et heure de récurrence requis pour un événement récurrent.");
      return;
    }

    setIsSubmitting(true);
    try {
      let image: string | undefined;
      let imageObjectKey: string | undefined;

      if (imageFile) {
        const presigned = await getPresignedUpload({
          type: "image",
          contentType: imageFile.type,
          fileSize: imageFile.size,
        });
        await uploadFileToR2(presigned.uploadUrl, imageFile);
        image = presigned.url;
        imageObjectKey = presigned.objectKey;
      }

      const payload = {
        title,
        description,
        city: city || undefined,
        latitude: latitude ?? undefined,
        longitude: longitude ?? undefined,
        eventType,
        scheduleType,
        eventDate: scheduleType === "SPECIFIC" ? new Date(eventDate).toISOString() : undefined,
        recurrenceDays: scheduleType === "RECURRING" ? recurrenceDays : undefined,
        recurrenceTime: scheduleType === "RECURRING" ? recurrenceTime : undefined,
        price: price ? Number(price) : undefined,
        link: link || undefined,
        styles: selectedStyles,
        image,
        imageObjectKey,
        showOrganizer,
      };

      if (isEditing && eventId) {
        await updateAdminEvent(eventId, payload);
      } else {
        await createEvent(payload);
      }

      router.push("/admin/events");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'enregistrer l'événement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <AdminHeading
        title={isEditing ? "Modifier l'événement" : "Nouvel événement"}
        description="Visible par tous les utilisateurs une fois publié."
        back={{ href: "/admin/events", label: "Événements" }}
      />

      {error && <div className={alertError}>{error}</div>}

      <form className="flex max-w-[760px] flex-col gap-4 sm:gap-5" onSubmit={handleSubmit}>
        <section className={formSection}>
          <h2 className={formSectionTitle}>Informations</h2>

          <div className={field}>
            <label htmlFor="title" className={label}>Titre</label>
            <input id="title" className={input} required maxLength={100} value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className={field}>
            <label htmlFor="description" className={label}>Description</label>
            <textarea id="description" className={textarea} required maxLength={2000} value={description} onChange={(e) => setDescription(e.target.value)} />
            <span className={hint}>{description.length}/2000</span>
          </div>

          <div className={field}>
            <label htmlFor="eventType" className={label}>Type</label>
            <select id="eventType" className={input} value={eventType} onChange={(e) => setEventType(e.target.value)}>
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>{EVENT_TYPE_LABELS[type] ?? type}</option>
              ))}
            </select>
          </div>

          <div className={field}>
            <label htmlFor="image" className={label}>Image {isEditing ? "(laisser vide pour la garder)" : "(optionnelle)"}</label>
            <input id="image" className={fileInput} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
            {imagePreview && (
              <div className="mt-1 max-w-[280px] overflow-hidden rounded-lg border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Aperçu" className="block w-full" />
              </div>
            )}
          </div>
        </section>

        <section className={formSection}>
          <h2 className={formSectionTitle}>Date et lieu</h2>

          <PlacesInput
            label="Lieu (optionnel)"
            value={city}
            onSelect={({ address, latitude: lat, longitude: lng }) => {
              setCity(address);
              setLatitude(lat);
              setLongitude(lng);
            }}
          />

          <div className={field}>
            <span className={label}>Périodicité</span>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={chip(scheduleType === "SPECIFIC")} onClick={() => setScheduleType("SPECIFIC")}>Date unique</button>
              <button type="button" className={chip(scheduleType === "RECURRING")} onClick={() => setScheduleType("RECURRING")}>Récurrent</button>
            </div>
          </div>

          {scheduleType === "SPECIFIC" ? (
            <div className={field}>
              <label htmlFor="eventDate" className={label}>Date et heure</label>
              <input id="eventDate" className={cx(input, "sm:max-w-[260px]")} type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
            </div>
          ) : (
            <>
              <div className={field}>
                <span className={label}>Jours</span>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      className={chip(recurrenceDays.includes(day.value))}
                      onClick={() => toggleDay(day.value)}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className={field}>
                <label htmlFor="recurrenceTime" className={label}>Heure</label>
                <input id="recurrenceTime" className={cx(input, "sm:max-w-[160px]")} type="time" value={recurrenceTime} onChange={(e) => setRecurrenceTime(e.target.value)} />
              </div>
            </>
          )}
        </section>

        <section className={formSection}>
          <h2 className={formSectionTitle}>Détails</h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-[180px_1fr]">
            <div className={field}>
              <label htmlFor="price" className={label}>Prix en € (optionnel)</label>
              <input id="price" className={input} type="number" min={0} step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className={field}>
              <label htmlFor="link" className={label}>Lien « En savoir plus » (optionnel)</label>
              <input id="link" className={input} type="url" placeholder="https://..." value={link} onChange={(e) => setLink(e.target.value)} />
            </div>
          </div>

          <div className={field}>
            <span className={label}>Styles (optionnel)</span>
            <div className="flex max-h-[200px] flex-wrap gap-2 overflow-y-auto rounded-lg border border-line bg-white/[.02] p-3">
              {stylesError && <span className={hint}>Impossible de charger les styles.</span>}
              {!stylesError && !availableStyles && <span className={hint}>Chargement des styles...</span>}
              {availableStyles?.map((style) => (
                <button
                  key={style}
                  type="button"
                  className={chip(selectedStyles.includes(style))}
                  onClick={() => toggleStyle(style)}
                >
                  {style}
                </button>
              ))}
            </div>
            <span className={hint}>
              {selectedStyles.length > 0 ? `${selectedStyles.length} sélectionné${selectedStyles.length > 1 ? "s" : ""}` : "Aucun style sélectionné"}
            </span>
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              className="mt-0.5 size-4 shrink-0 cursor-pointer accent-accent"
              checked={showOrganizer}
              onChange={(e) => setShowOrganizer(e.target.checked)}
            />
            <span>
              <span className="block text-sm text-ink">Afficher « Organisé par » sur la fiche</span>
              <span className={hint}>À décocher si l’événement n’est pas organisé par ViewZ (repris d’un autre réseau, etc.).</span>
            </span>
          </label>
        </section>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Link href="/admin/events" className={btnSecondary}>Annuler</Link>
          <button type="submit" className={btnPrimary} disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : isEditing ? "Enregistrer les modifications" : "Publier l'événement"}
          </button>
        </div>
      </form>
    </div>
  );
}
