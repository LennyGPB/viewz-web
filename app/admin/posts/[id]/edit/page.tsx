"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState, type FormEvent } from "react";
import { getAdminPost, getAdminStyles, updateAdminPost, type AdminRecord } from "@/lib/adminApi";
import AdminHeading from "../../../AdminHeading";
import PlacesInput from "../../../PlacesInput";
import {
  alertError, btnPrimary, btnSecondary, chip, cx, field, formSection, formSectionTitle, hint, input, label, loadingState, textarea,
} from "../../../adminUi";

interface PostRecord extends AdminRecord {
  title: string;
  description: string;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  eventDate?: string | null;
  isOfficial?: boolean;
  bypassFilters?: boolean;
  styles?: { id: string; name: string }[];
  author?: { username: string };
}

const toDatetimeLocal = (iso?: string | null) => {
  if (!iso) return "";
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<PostRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAdminPost(id)
      .then((record) => setPost(record as PostRecord))
      .catch((err) => setError(err instanceof Error ? err.message : "Chargement impossible."))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <div className={loadingState}>Chargement...</div>;
  if (error || !post) return <div className={alertError}>{error ?? "Annonce introuvable."}</div>;

  return <PostForm post={post} />;
}

function PostForm({ post }: { post: PostRecord }) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [city, setCity] = useState(post.city ?? "");
  const [latitude, setLatitude] = useState<number | null>(post.latitude ?? null);
  const [longitude, setLongitude] = useState<number | null>(post.longitude ?? null);
  const [eventDate, setEventDate] = useState(toDatetimeLocal(post.eventDate));
  const [selectedStyles, setSelectedStyles] = useState<string[]>(post.styles?.map((s) => s.name) ?? []);
  const [isOfficial, setIsOfficial] = useState(post.isOfficial ?? false);
  const [bypassFilters, setBypassFilters] = useState(post.bypassFilters ?? false);
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

  const toggleStyle = (style: string) => {
    setSelectedStyles((current) =>
      current.includes(style) ? current.filter((s) => s !== style) : [...current, style]
    );
  };

  const clearCity = () => {
    setCity("");
    setLatitude(null);
    setLongitude(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await updateAdminPost(post.id, {
        title: title.trim(),
        description: description.trim(),
        // null efface la ville (et ses coordonnées côté serveur).
        city: city || null,
        ...(city && latitude != null && longitude != null ? { latitude, longitude } : {}),
        eventDate: eventDate ? new Date(eventDate).toISOString() : null,
        styles: selectedStyles,
        isOfficial,
        bypassFilters,
      });
      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'enregistrer l'annonce.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <AdminHeading
        title="Modifier la recherche"
        description={`Annonce publiée par @${post.author?.username ?? "?"}.`}
        back={{ href: "/admin/posts", label: "Recherches" }}
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
            <textarea id="description" className={textarea} required maxLength={1000} value={description} onChange={(e) => setDescription(e.target.value)} />
            <span className={hint}>{description.length}/1000</span>
          </div>
        </section>

        <section className={formSection}>
          <h2 className={formSectionTitle}>Date et lieu</h2>

          <PlacesInput
            label="Ville ou lieu (optionnel)"
            value={city}
            onSelect={({ address, latitude: lat, longitude: lng }) => {
              setCity(address);
              setLatitude(lat);
              setLongitude(lng);
            }}
          />
          {city && (
            <button type="button" className={cx(btnSecondary, "self-start")} onClick={clearCity}>
              Retirer le lieu
            </button>
          )}

          <div className={field}>
            <label htmlFor="eventDate" className={label}>Date (optionnelle)</label>
            <div className="flex flex-wrap items-center gap-2">
              <input id="eventDate" className={cx(input, "sm:max-w-[260px]")} type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
              {eventDate && (
                <button type="button" className={btnSecondary} onClick={() => setEventDate("")}>Retirer la date</button>
              )}
            </div>
          </div>
        </section>

        <section className={formSection}>
          <h2 className={formSectionTitle}>Détails</h2>

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
              checked={isOfficial}
              onChange={(e) => setIsOfficial(e.target.checked)}
            />
            <span>
              <span className="block text-sm text-ink">Annonce officielle ViewZ</span>
              <span className={hint}>Mise en avant en haut du fil.</span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              className="mt-0.5 size-4 shrink-0 cursor-pointer accent-accent"
              checked={bypassFilters}
              onChange={(e) => setBypassFilters(e.target.checked)}
            />
            <span>
              <span className="block text-sm text-ink">Visible par tout le monde</span>
              <span className={hint}>Ignore les filtres de distance et de styles des utilisateurs.</span>
            </span>
          </label>
        </section>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Link href="/admin/posts" className={btnSecondary}>Annuler</Link>
          <button type="submit" className={btnPrimary} disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}
