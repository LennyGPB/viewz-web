"use client";

import { useEffect, useRef, useState } from "react";
import { getPlacePredictions, getPlaceDetails, type PlacePrediction } from "@/lib/adminApi";

interface PlacesInputProps {
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  onSelect: (result: { address: string; latitude: number; longitude: number }) => void;
}

export default function PlacesInput({ label, value, placeholder, required, onSelect }: PlacesInputProps) {
  const [query, setQuery] = useState(value);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (query.trim().length < 3) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPredictions([]);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    const timeout = setTimeout(() => {
      getPlacePredictions(query)
        .then((data) => {
          if (!cancelled) setPredictions(data.predictions ?? []);
        })
        .catch(() => {
          if (!cancelled) setPredictions([]);
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePick = async (prediction: PlacePrediction) => {
    setIsResolving(true);
    setIsOpen(false);
    try {
      const details = await getPlaceDetails(prediction.place_id);
      const { lat, lng } = details.result.geometry.location;
      setQuery(prediction.description);
      onSelect({ address: prediction.description, latitude: lat, longitude: lng });
    } catch {
      // silencieux : l'utilisateur peut retaper sa recherche
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="form-field" ref={containerRef} style={{ position: "relative" }}>
      <label>{label}</label>
      <input
        value={query}
        required={required}
        placeholder={placeholder ?? "Rechercher une ville ou une adresse..."}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        autoComplete="off"
      />
      {isResolving && <span className="form-hint">Localisation en cours...</span>}
      {isOpen && (isLoading || predictions.length > 0) && (
        <div className="places-dropdown">
          {isLoading ? (
            <div className="places-option places-option-static">Recherche...</div>
          ) : (
            predictions.map((prediction) => (
              <button
                type="button"
                key={prediction.place_id}
                className="places-option"
                onClick={() => handlePick(prediction)}
              >
                {prediction.description}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
