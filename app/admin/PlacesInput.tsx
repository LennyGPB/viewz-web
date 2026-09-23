"use client";

import { useEffect, useRef, useState } from "react";
import { getPlacePredictions, getPlaceDetails, type PlacePrediction } from "@/lib/adminApi";
import { cx, field, hint, input, label as labelClass } from "@/lib/ui";

const option = "block w-full border-b border-line bg-transparent px-3.5 py-[11px] text-left text-[13px] last:border-b-0";

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
    <div className={cx(field, "relative")} ref={containerRef}>
      <label className={labelClass}>{label}</label>
      <input
        className={input}
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
      {isResolving && <span className={hint}>Localisation en cours...</span>}
      {isOpen && (isLoading || predictions.length > 0) && (
        <div className="absolute inset-x-0 top-[calc(100%_+_6px)] z-20 max-h-60 overflow-y-auto rounded-[14px] border border-line bg-[#100d16] shadow-[0_16px_40px_rgba(0,0,0,.5)]">
          {isLoading ? (
            <div className={cx(option, "cursor-default text-muted")}>Recherche...</div>
          ) : (
            predictions.map((prediction) => (
              <button
                type="button"
                key={prediction.place_id}
                className={cx(option, "cursor-pointer text-ink hover:bg-purple/12")}
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
