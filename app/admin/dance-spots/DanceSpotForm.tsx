"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createDanceSpot, updateAdminDanceSpot, getPresignedUpload, uploadFileToR2 } from "@/lib/adminApi";
import { alertError, btnSmall, cx, field, fileDrop, hint, input, label, textarea } from "@/lib/ui";
import AdminHeading from "../AdminHeading";
import PlacesInput from "../PlacesInput";

const SPOT_TYPES = ["STUDIO", "PARC", "SALLE", "RUE", "AUTRE"];
const MAX_IMAGES = 3;

const thumb = "size-[100px] rounded-lg object-cover";
const thumbRemove = "absolute -top-2 -right-2 size-[22px] cursor-pointer rounded-full border border-white/30 bg-black text-xs leading-none text-white";

interface SpotImage {
  url: string;
  objectKey: string;
}

export interface DanceSpotFormInitial {
  name: string;
  address: string;
  type: string;
  latitude: number;
  longitude: number;
  description?: string | null;
  images?: string[];
  imageObjectKeys?: string[];
}

interface DanceSpotFormProps {
  spotId?: string;
  initial?: DanceSpotFormInitial;
}

export default function DanceSpotForm({ spotId, initial }: DanceSpotFormProps) {
  const router = useRouter();
  const isEditing = Boolean(spotId);

  const [name, setName] = useState(initial?.name ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [type, setType] = useState(initial?.type ?? "STUDIO");
  const [latitude, setLatitude] = useState<number | null>(initial?.latitude ?? null);
  const [longitude, setLongitude] = useState<number | null>(initial?.longitude ?? null);
  const [description, setDescription] = useState(initial?.description ?? "");
  // Photos déjà en ligne : on garde l'URL ET la clé R2 ensemble, la clé étant
  // nécessaire pour reconstituer le payload attendu par le backend en édition.
  const [existingImages, setExistingImages] = useState<SpotImage[]>(
    (initial?.images ?? []).map((url, i) => ({ url, objectKey: initial?.imageObjectKeys?.[i] ?? "" })),
  );
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalImageCount = existingImages.length + newImageFiles.length;
  const remainingSlots = MAX_IMAGES - totalImageCount;

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const selected = Array.from(files).slice(0, remainingSlots);
    setNewImageFiles((current) => [...current, ...selected]);
    setNewImagePreviews((current) => [...current, ...selected.map((file) => URL.createObjectURL(file))]);
  };

  const removeExistingImage = (objectKey: string) => {
    setExistingImages((current) => current.filter((img) => img.objectKey !== objectKey));
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles((current) => current.filter((_, i) => i !== index));
    setNewImagePreviews((current) => current.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (latitude === null || longitude === null) {
      setError("Choisis une adresse dans les suggestions pour localiser le spot.");
      return;
    }

    setIsSubmitting(true);
    try {
      const uploaded: SpotImage[] = [];
      for (const file of newImageFiles) {
        const presigned = await getPresignedUpload({
          type: "image",
          contentType: file.type,
          fileSize: file.size,
        });
        await uploadFileToR2(presigned.uploadUrl, file);
        uploaded.push({ url: presigned.url, objectKey: presigned.objectKey });
      }

      const allImages = [...existingImages, ...uploaded];

      const payload = {
        name,
        address,
        type,
        latitude,
        longitude,
        description: description || undefined,
      };

      if (isEditing && spotId) {
        await updateAdminDanceSpot(spotId, {
          ...payload,
          images: allImages.map((img) => img.url),
          imageObjectKeys: allImages.map((img) => img.objectKey),
        });
      } else {
        await createDanceSpot({
          ...payload,
          images: allImages.length ? allImages.map((img) => img.url) : undefined,
          imageObjectKeys: allImages.length ? allImages.map((img) => img.objectKey) : undefined,
        });
      }

      router.push("/admin/dance-spots");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'enregistrer le spot.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <AdminHeading
        title={isEditing ? "Modifier le spot" : "Nouveau spot"}
        description={isEditing ? "Modifie les informations et les photos du spot." : "Ajoute un lieu à la carte des spots de danse."}
      />

      {error && <div className={alertError}>{error}</div>}

      <form className="flex max-w-[640px] flex-col gap-[18px]" onSubmit={handleSubmit}>
        <div className={field}>
          <label htmlFor="name" className={label}>Nom</label>
          <input id="name" className={input} required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <PlacesInput
          label="Adresse"
          value={address}
          required
          onSelect={({ address: pickedAddress, latitude: lat, longitude: lng }) => {
            setAddress(pickedAddress);
            setLatitude(lat);
            setLongitude(lng);
          }}
        />
        {latitude !== null && longitude !== null && (
          <span className={hint}>Position enregistrée : {latitude.toFixed(5)}, {longitude.toFixed(5)}</span>
        )}

        <div className={field}>
          <label htmlFor="type" className={label}>Type</label>
          <select id="type" className={input} value={type} onChange={(e) => setType(e.target.value)}>
            {SPOT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className={field}>
          <label htmlFor="description" className={label}>Description (optionnelle)</label>
          <textarea id="description" className={textarea} maxLength={1000} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className={field}>
          <label className={label}>Photos (optionnelles, {MAX_IMAGES} maximum)</label>
          {(existingImages.length > 0 || newImagePreviews.length > 0) && (
            <div className="mt-2.5 mb-2.5 flex flex-wrap gap-2">
              {existingImages.map((img) => (
                <div key={img.objectKey} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="Photo existante" className={thumb} />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.objectKey)}
                    aria-label="Retirer cette photo"
                    title="Retirer cette photo"
                    className={thumbRemove}
                  >
                    ×
                  </button>
                </div>
              ))}
              {newImagePreviews.map((src, i) => (
                <div key={src} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Nouvelle photo ${i + 1}`} className={thumb} />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    aria-label="Retirer cette photo"
                    title="Retirer cette photo"
                    className={thumbRemove}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          {remainingSlots > 0 ? (
            <div className={fileDrop}>
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => handleFiles(e.target.files)} />
            </div>
          ) : (
            <span className={hint}>Maximum de {MAX_IMAGES} photos atteint. Retire-en une pour en ajouter une autre.</span>
          )}
        </div>

        <button type="submit" className={cx(btnSmall, "self-start")} disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : isEditing ? "Enregistrer les modifications" : "Créer le spot"}
        </button>
      </form>
    </div>
  );
}
