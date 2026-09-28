"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react";
import {
  approveAdminOrganizerRequest,
  getAdminOrganizerRequests,
  rejectAdminOrganizerRequest,
  type AdminOrganizerRequest,
  type OrganizerRequestStatus,
} from "@/lib/adminApi";
import AdminHeading from "../AdminHeading";
import AdminIcon from "../AdminIcon";
import AdminModal from "../AdminModal";
import { alertError, badge, btnDanger, btnPrimary, btnSecondary, chip, cx, emptyState, loadingState, surface } from "../adminUi";

const FILTERS: { value: OrganizerRequestStatus | undefined; label: string }[] = [
  { value: "PENDING", label: "En attente" },
  { value: "APPROVED", label: "Acceptées" },
  { value: "REJECTED", label: "Refusées" },
  { value: undefined, label: "Toutes" },
];

const STATUS_BADGE: Record<OrganizerRequestStatus, { label: string; className: string }> = {
  PENDING: { label: "En attente", className: "border-amber-400/30 bg-amber-400/10 text-amber-200" },
  APPROVED: { label: "Acceptée", className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" },
  REJECTED: { label: "Refusée", className: "border-red-400/30 bg-red-400/10 text-red-300" },
};

type PendingAction = { request: AdminOrganizerRequest; action: "approve" | "reject" };

export default function AdminOrganizerRequestsPage() {
  const [status, setStatus] = useState<OrganizerRequestStatus | undefined>("PENDING");
  const [requests, setRequests] = useState<AdminOrganizerRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = useCallback(async (filter?: OrganizerRequestStatus) => {
    setIsLoading(true);
    setError(null);
    try {
      setRequests(await getAdminOrganizerRequests(filter));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chargement impossible.");
      setRequests([]);
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
    const { request, action } = pending;
    setIsSubmitting(true);
    setError(null);
    try {
      if (action === "approve") {
        const result = await approveAdminOrganizerRequest(request.id);
        setNotice(
          result.messageSent
            ? `@${request.user.username} est maintenant organisateur. @ViewZ lui a envoyé un message.`
            : `@${request.user.username} est maintenant organisateur, mais le message de @ViewZ n'a pas pu être envoyé.`,
        );
      } else {
        await rejectAdminOrganizerRequest(request.id);
        setNotice(`La demande de @${request.user.username} a été refusée.`);
      }
      const nextStatus: OrganizerRequestStatus = action === "approve" ? "APPROVED" : "REJECTED";
      setRequests((current) =>
        current
          .map((item) => (item.id === request.id ? { ...item, status: nextStatus } : item))
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
        title="Demandes organisateur"
        description="Demandes envoyées depuis l'app pour pouvoir publier des événements. En acceptant, l'utilisateur passe Organisateur et reçoit un message du compte officiel @ViewZ dans le chat."
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
      ) : requests.length === 0 ? (
        <div className={emptyState}>Aucune demande.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map((request) => (
            <section key={request.id} className={cx(surface, "p-4 sm:p-5")}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  {request.user.profilePic ? (
                    <img src={request.user.profilePic} alt="" className="size-10 shrink-0 rounded-full object-cover" />
                  ) : (
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/[.08] text-sm font-bold uppercase text-ink">
                      {request.user.username.charAt(0)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="m-0 truncate text-sm font-semibold text-ink">{request.orgName}</p>
                    <p className="m-0 truncate text-xs text-muted">
                      @{request.user.username} · {request.user.email}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={cx(badge, STATUS_BADGE[request.status].className)}>{STATUS_BADGE[request.status].label}</span>
                  <span className="text-xs text-faint">{new Date(request.createdAt).toLocaleDateString("fr-FR")}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <AdminIcon name="pin" size={14} />
                  {request.city}
                </span>
                {request.link && (
                  <a
                    href={request.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-w-0 items-center gap-1.5 text-brand-light no-underline hover:underline"
                  >
                    <AdminIcon name="external" size={14} />
                    <span className="truncate">{request.link}</span>
                  </a>
                )}
              </div>

              {request.eventTypes.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {request.eventTypes.map((type) => (
                    <span key={type} className={badge}>{type}</span>
                  ))}
                </div>
              )}

              <p className="mt-3 mb-0 whitespace-pre-line text-sm leading-relaxed text-lavender">{request.message}</p>

              {request.status !== "APPROVED" && (
                <div className="mt-4 flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
                  {request.status === "PENDING" && (
                    <button type="button" className={btnSecondary} onClick={() => setPending({ request, action: "reject" })}>
                      <AdminIcon name="close" size={16} />
                      Refuser
                    </button>
                  )}
                  <button type="button" className={btnPrimary} onClick={() => setPending({ request, action: "approve" })}>
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
          title={pending.action === "approve" ? "Accepter la demande ?" : "Refuser la demande ?"}
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
              ? `@${pending.request.user.username} (${pending.request.orgName}) passera Organisateur et pourra publier des événements. Le compte officiel @ViewZ lui enverra un message.`
              : `La demande de @${pending.request.user.username} (${pending.request.orgName}) sera refusée. L'utilisateur pourra en renvoyer une depuis l'app.`}
          </p>
        </AdminModal>
      )}
    </div>
  );
}
