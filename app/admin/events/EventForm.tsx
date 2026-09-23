"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createEvent, updateAdminEvent, getPresignedUpload, uploadFileToR2 } from "@/lib/adminApi";
import { DANCE_STYLES } from "@/lib/styles";
import { alertError, btnSmall, chip, cx, field, fileDrop, hint, input, label, textarea } from "@/lib/ui";
import AdminHeading from "../AdminHeading";
import PlacesInput from "../PlacesInput";

const EVENT_TYPES = [
  "COURS_DE_DANSE", "BATTLE", "SPECTACLE", "TOURNAGE", "SOIREE", "STAGE", "WORKSHOP", "FESTIVAL", "AUTRE",
];
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
      />

      {error && <div className={alertError}>{error}</div>}

      <form className="flex max-w-[640px] flex-col gap-[18px]" onSubmit={handleSubmit}>
        <div className={field}>
          <label htmlFor="title" className={label}>Titre</label>
          <input id="title" className={input} required maxLength={100} value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className={field}>
          <label htmlFor="description" className={label}>Description</label>
          <textarea id="description" className={textarea} required maxLength={2000} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className={field}>
          <label className={label}>Image {isEditing ? "(laisser vide pour ne pas la changer)" : "(optionnelle)"}</label>
          <div className={fileDrop}>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
          </div>
          {imagePreview && (
            <div className="mt-2.5 max-w-[280px] overflow-hidden rounded-[14px] border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="Aperçu" className="block w-full" />
            </div>
          )}
        </div>

        <div className={field}>
          <label htmlFor="eventType" className={label}>Type</label>
          <select id="eventType" className={input} value={eventType} onChange={(e) => setEventType(e.target.value)}>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>{type.replaceAll("_", " ")}</option>
            ))}
          </select>
        </div>

        <PlacesInput
          label="Lieu (optionnel)"
          value={city}
          onSelect={({ address, latitude: lat, longitude: lng }) => {
            setCity(address);
            setLatitude(lat);
            setLongitude(lng);
          }}
        />
        {latitude !== null && longitude !== null && (
          <span className={hint}>Position enregistrée : {latitude.toFixed(5)}, {longitude.toFixed(5)}</span>
        )}

        <div className={field}>
          <label className={label}>Périodicité</label>
          <div className="flex flex-wrap gap-1.5">
            <button type="button" className={chip(scheduleType === "SPECIFIC")} onClick={() => setScheduleType("SPECIFIC")}>Date unique</button>
            <button type="button" className={chip(scheduleType === "RECURRING")} onClick={() => setScheduleType("RECURRING")}>Récurrent</button>
          </div>
        </div>

        {scheduleType === "SPECIFIC" ? (
          <div className={field}>
            <label htmlFor="eventDate" className={label}>Date</label>
            <input id="eventDate" className={input} type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
          </div>
        ) : (
          <>
            <div className={field}>
              <label className={label}>Jours de récurrence</label>
              <div className="flex flex-wrap gap-1.5">
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
              <input id="recurrenceTime" className={input} type="time" value={recurrenceTime} onChange={(e) => setRecurrenceTime(e.target.value)} />
            </div>
          </>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className={field}>
            <label htmlFor="price" className={label}>Prix (€, optionnel)</label>
            <input id="price" className={input} type="number" min={0} step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div className={field}>
            <label htmlFor="link" className={label}>Lien (optionnel)</label>
            <input id="link" className={input} type="url" placeholder="https://..." value={link} onChange={(e) => setLink(e.target.value)} />
          </div>
        </div>

        <div className={field}>
          <label className={cx(label, "flex cursor-pointer items-center gap-2")}>
            <input
              type="checkbox"
              checked={showOrganizer}
              onChange={(e) => setShowOrganizer(e.target.checked)}
            />
            Afficher « Organisé par » sur la fiche
          </label>
          <span className={hint}>
            À décocher si l’événement n’est pas organisé par ViewZ (repris d’un autre réseau, etc.).
          </span>
        </div>

        <div className={field}>
          <label className={label}>Styles (optionnel)</label>
          <div className="flex max-h-[180px] flex-wrap gap-1.5 overflow-y-auto rounded-[14px] border border-line bg-white/2 p-3">
            {DANCE_STYLES.map((style) => (
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
            {selectedStyles.length > 0 ? `${selectedStyles.length} sélectionné(s)` : "Aucun style sélectionné"}
          </span>
        </div>

        <button type="submit" className={cx(btnSmall, "self-start")} disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : isEditing ? "Enregistrer les modifications" : "Publier l'événement"}
        </button>
      </form>
    </div>
  );
}
