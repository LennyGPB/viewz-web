"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createEvent, getPresignedUpload, uploadFileToR2 } from "@/lib/adminApi";
import { DANCE_STYLES } from "@/lib/styles";
import PlacesInput from "../../PlacesInput";

const EVENT_TYPES = [
  "COURS_DE_DANSE", "BATTLE", "SPECTACLE", "TOURNAGE", "SOIREE", "STAGE", "WORKSHOP", "FESTIVAL", "AUTRE",
];
const DAYS = [
  { value: 1, label: "Lun" }, { value: 2, label: "Mar" }, { value: 3, label: "Mer" },
  { value: 4, label: "Jeu" }, { value: 5, label: "Ven" }, { value: 6, label: "Sam" }, { value: 0, label: "Dim" },
];

export default function NewEventPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [eventType, setEventType] = useState("AUTRE");
  const [scheduleType, setScheduleType] = useState<"SPECIFIC" | "RECURRING">("SPECIFIC");
  const [eventDate, setEventDate] = useState("");
  const [recurrenceDays, setRecurrenceDays] = useState<number[]>([]);
  const [recurrenceTime, setRecurrenceTime] = useState("");
  const [price, setPrice] = useState("");
  const [link, setLink] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
    setImagePreview(file ? URL.createObjectURL(file) : null);
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

      await createEvent({
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
        styles: selectedStyles.length ? selectedStyles : undefined,
        image,
        imageObjectKey,
      });

      router.push("/admin/events");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de créer l'événement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="admin-heading">
        <div>
          <h1>Nouvel événement</h1>
          <p>Visible par tous les utilisateurs une fois publié.</p>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="title">Titre</label>
          <input id="title" required maxLength={100} value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="form-field">
          <label htmlFor="description">Description</label>
          <textarea id="description" required maxLength={2000} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="form-field">
          <label>Image (optionnelle)</label>
          <div className="form-file">
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
          </div>
          {imagePreview && (
            <div className="form-preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="Aperçu" />
            </div>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="eventType">Type</label>
          <select id="eventType" value={eventType} onChange={(e) => setEventType(e.target.value)}>
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
          <span className="form-hint">Position enregistrée : {latitude.toFixed(5)}, {longitude.toFixed(5)}</span>
        )}

        <div className="form-field">
          <label>Périodicité</label>
          <div className="form-days">
            <button type="button" className={`form-day${scheduleType === "SPECIFIC" ? " active" : ""}`} onClick={() => setScheduleType("SPECIFIC")}>Date unique</button>
            <button type="button" className={`form-day${scheduleType === "RECURRING" ? " active" : ""}`} onClick={() => setScheduleType("RECURRING")}>Récurrent</button>
          </div>
        </div>

        {scheduleType === "SPECIFIC" ? (
          <div className="form-field">
            <label htmlFor="eventDate">Date</label>
            <input id="eventDate" type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
          </div>
        ) : (
          <>
            <div className="form-field">
              <label>Jours de récurrence</label>
              <div className="form-days">
                {DAYS.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    className={`form-day${recurrenceDays.includes(day.value) ? " active" : ""}`}
                    onClick={() => toggleDay(day.value)}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="recurrenceTime">Heure</label>
              <input id="recurrenceTime" type="time" value={recurrenceTime} onChange={(e) => setRecurrenceTime(e.target.value)} />
            </div>
          </>
        )}

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="price">Prix (€, optionnel)</label>
            <input id="price" type="number" min={0} step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="link">Lien (optionnel)</label>
            <input id="link" type="url" placeholder="https://..." value={link} onChange={(e) => setLink(e.target.value)} />
          </div>
        </div>

        <div className="form-field">
          <label>Styles (optionnel)</label>
          <div className="form-style-grid">
            {DANCE_STYLES.map((style) => (
              <button
                key={style}
                type="button"
                className={`form-day${selectedStyles.includes(style) ? " active" : ""}`}
                onClick={() => toggleStyle(style)}
              >
                {style}
              </button>
            ))}
          </div>
          <span className="form-hint">
            {selectedStyles.length > 0 ? `${selectedStyles.length} sélectionné(s)` : "Aucun style sélectionné"}
          </span>
        </div>

        <button type="submit" className="btn-small" disabled={isSubmitting} style={{ alignSelf: "flex-start" }}>
          {isSubmitting ? "Publication..." : "Publier l'événement"}
        </button>
      </form>
    </div>
  );
}
