"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react";
import {
  approveAdminSpotSuggestion,
  getAdminSpotSuggestions,
  rejectAdminSpotSuggestion,
  type AdminSpotSuggestion,
  type SpotSuggestionStatus,
} from "@/lib/adminApi";
import AdminHeading from "../AdminHeading";
import AdminIcon from "../AdminIcon";
import AdminModal from "../AdminModal";
import { alertError, badge, btnDanger, btnPrimary, btnSecondary, chip, cx, emptyState, loadingState, surface } from "../adminUi";

const FILTERS: { value: SpotSuggestionStatus | undefined; label: string }[] = [
  { value: "PENDING", label: "En attente" },
  { value: "APPROVED", label: "Acceptées" },
  { value: "REJECTED", label: "Refusées" },
  { value: undefined, label: "Toutes" },
];

const STATUS_BADGE: Record<SpotSuggestionStatus, { label: string; className: string }> = {
  PENDING: { label: "En attente", className: "border-amber-400/30 bg-amber-400/10 text-amber-200" },
  APPROVED: { label: "Acceptée", className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" },
  REJECTED: { label: "Refusée", className: "border-red-400/30 bg-red-400/10 text-red-300" },
};

type PendingAction = { suggestion: AdminSpotSuggestion; action: "approve" | "reject" };

export default function AdminSpotSuggestionsPage() {
  const [status, setStatus] = useState<SpotSuggestionStatus | undefined>("PENDING");
  const [suggestions, setSuggestions] = useState<AdminSpotSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = useCallback(async (filter?: SpotSuggestionStatus) => {
    setIsLoading(true);
    setError(null);
    try {
      setSuggestions(await getAdminSpotSuggestions(filter));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chargement impossible.");
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => void load(status), 0);
    return () => clearTimeout(timeout);
  }, [status, load]);

  const closeModal = useCallback(() => {
    if (!isSubmitting) setPending(null);
  }, [isSubmitting]);

  const confirmAction = async () => {
    if (!pending) return;
    const { suggestion, action } = pending;
    setIsSubmitting(true);
    setError(null);
    try {
      if (action === "approve") {
        const result = await approveAdminSpotSuggestion(suggestion.id);
        setNotice(
          result.messageSent
            ? `Spot de @${suggestion.user.username} accepté. @ViewZ lui a envoyé un message.`
            : `Spot de @${suggestion.user.username} accepté, mais le message de @ViewZ n'a pas pu être envoyé.`,
        );
      } else {
        await rejectAdminSpotSuggestion(suggestion.id);
        setNotice(`Le spot proposé par @${suggestion.user.username} a été refusé.`);
      }
      const nextStatus: SpotSuggestionStatus = action === "approve" ? "APPROVED" : "REJECTED";
      setSuggestions((current) =>
        current
          .map((item) => (item.id === suggestion.id ? { ...item, status: nextStatus } : item))
          .filter((item) => !status || item.status === status),
      );
      setPending(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action impossible.");
      setPending(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <AdminHeading
        title="Demandes de spot"
        description="Spots proposés depuis la carte de l'app. En acceptant, l'utilisateur reçoit un message du compte officiel @ViewZ et la demande compte pour ses badges « spots approuvés ». Pense à ajouter le spot sur la carte (Spots)."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.label}
            type="button"
            className={chip(status === filter.value)}
            onClick={() => {
              setNotice(null);
              setStatus(filter.value);
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {error && <div className={alertError}>{error}</div>}
      {notice && (
        <div className="mb-5 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          {notice}
        </div>
      )}

      {isLoading ? (
        <div className={loadingState}>Chargement...</div>
      ) : suggestions.length === 0 ? (
        <div className={emptyState}>Aucune demande.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {suggestions.map((suggestion) => (
            <section key={suggestion.id} className={cx(surface, "p-4 sm:p-5")}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  {suggestion.user.profilePic ? (
                    <img src={suggestion.user.profilePic} alt="" className="size-10 shrink-0 rounded-full object-cover" />
                  ) : (
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/[.08] text-sm font-bold uppercase text-ink">
                      {suggestion.user.username.charAt(0)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="m-0 truncate text-sm font-semibold text-ink">@{suggestion.user.username}</p>
                    <p className="m-0 truncate text-xs text-muted">{suggestion.user.email}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={cx(badge, STATUS_BADGE[suggestion.status].className)}>{STATUS_BADGE[suggestion.status].label}</span>
                  <span className="text-xs text-faint">{new Date(suggestion.createdAt).toLocaleDateString("fr-FR")}</span>
                </div>
              </div>

              <p className="mt-4 mb-0 flex items-start gap-2 whitespace-pre-line text-sm leading-relaxed text-lavender">
                <AdminIcon name="pin" size={16} className="mt-0.5 shrink-0 text-brand-light" />
                {suggestion.content}
              </p>

              {suggestion.status !== "APPROVED" && (
                <div className="mt-4 flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
                  {suggestion.status === "PENDING" && (
                    <button type="button" className={btnSecondary} onClick={() => setPending({ suggestion, action: "reject" })}>
                      <AdminIcon name="close" size={16} />
                      Refuser
                    </button>
                  )}
                  <button type="button" className={btnPrimary} onClick={() => setPending({ suggestion, action: "approve" })}>
                    <AdminIcon name="check" size={16} />
                    Accepter
                  </button>
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      {pending && (
        <AdminModal
          title={pending.action === "approve" ? "Accepter ce spot ?" : "Refuser ce spot ?"}
          onClose={closeModal}
          footer={
            <>
              <button type="button" className={btnSecondary} disabled={isSubmitting} onClick={closeModal}>
                Annuler
              </button>
              <button
                type="button"
                className={pending.action === "approve" ? btnPrimary : btnDanger}
                disabled={isSubmitting}
                onClick={confirmAction}
              >
                {isSubmitting ? "Envoi..." : pending.action === "approve" ? "Accepter" : "Refuser"}
              </button>
            </>
          }
        >
          <p className="m-0 text-sm leading-relaxed text-muted">
            {pending.action === "approve"
              ? `Le compte officiel @ViewZ enverra un message à @${pending.suggestion.user.username} pour le remercier. Le spot comptera pour ses badges.`
              : `Le spot proposé par @${pending.suggestion.user.username} sera refusé. Aucun message ne lui sera envoyé.`}
          </p>
        </AdminModal>
      )}
    </div>
  );
}
