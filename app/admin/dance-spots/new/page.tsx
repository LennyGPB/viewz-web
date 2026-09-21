"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createDanceSpot } from "@/lib/adminApi";
import PlacesInput from "../../PlacesInput";

const SPOT_TYPES = ["STUDIO", "PARC", "SALLE", "RUE", "AUTRE"];

export default function NewDanceSpotPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("STUDIO");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (latitude === null || longitude === null) {
      setError("Choisis une adresse dans les suggestions pour localiser le spot.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createDanceSpot({
        name,
        address,
        type,
        latitude,
        longitude,
        description: description || undefined,
      });
      router.push("/admin/dance-spots");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de créer le spot.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="admin-heading">
        <div>
          <h1>Nouveau spot</h1>
          <p>Ajoute un lieu à la carte des spots de danse.</p>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name">Nom</label>
          <input id="name" required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} />
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
          <span className="form-hint">Position enregistrée : {latitude.toFixed(5)}, {longitude.toFixed(5)}</span>
        )}

        <div className="form-field">
          <label htmlFor="type">Type</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            {SPOT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="description">Description (optionnelle)</label>
          <textarea id="description" maxLength={1000} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <button type="submit" className="btn-small" disabled={isSubmitting} style={{ alignSelf: "flex-start" }}>
          {isSubmitting ? "Création..." : "Créer le spot"}
        </button>
      </form>
    </div>
  );
}
