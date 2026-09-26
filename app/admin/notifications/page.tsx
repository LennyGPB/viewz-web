"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { getBroadcastRecipients, sendBroadcastNotification } from "@/lib/adminApi";
import AdminHeading from "../AdminHeading";
import AdminIcon from "../AdminIcon";
import AdminModal from "../AdminModal";
import { alertError, btnPrimary, btnSecondary, cx, field, formSection, hint, input, label, textarea } from "../adminUi";

// Mêmes limites que BroadcastNotificationDto côté NestJS.
const TITLE_MAX = 65;
const BODY_MAX = 240;

const plural = (count: number, word: string) => `${count.toLocaleString("fr-FR")} ${word}${count > 1 ? "s" : ""}`;

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [recipients, setRecipients] = useState<number | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<number | null>(null);

  useEffect(() => {
    getBroadcastRecipients()
      .then(({ count }) => setRecipients(count))
      .catch(() => setRecipients(null));
  }, []);

  const canSend = title.trim().length > 0 && body.trim().length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSend) return;
    setError(null);
    setSentTo(null);
    setIsConfirming(true);
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      const result = await sendBroadcastNotification(title.trim(), body.trim());
      setSentTo(result.recipients);
      setTitle("");
      setBody("");
      setIsConfirming(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Envoi impossible.");
      setIsConfirming(false);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <AdminHeading
        title="Notifications"
        description="Envoie une notification push à tous les utilisateurs de l'app qui les ont activées. Un appui sur la notif ouvre l'accueil."
      />

      {error && <div className={alertError}>{error}</div>}
      {sentTo !== null && (
        <div className="mb-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          Notification envoyée à {plural(sentTo, "appareil")}.
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <form onSubmit={handleSubmit} className={formSection}>
          <div className={field}>
            <label htmlFor="notif-title" className={label}>Titre</label>
            <input
              id="notif-title"
              className={input}
              placeholder="ViewZ"
              maxLength={TITLE_MAX}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <span className={hint}>{title.length}/{TITLE_MAX}</span>
          </div>

          <div className={field}>
            <label htmlFor="notif-body" className={label}>Message</label>
            <textarea
              id="notif-body"
              className={textarea}
              placeholder="Ce soir, battle au spot de la BnF à 20h !"
              maxLength={BODY_MAX}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <span className={hint}>{body.length}/{BODY_MAX}</span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className={hint}>
              {recipients === null ? "Destinataires en cours de calcul..." : `Sera envoyée à ${plural(recipients, "appareil")}.`}
            </span>
            <button type="submit" className={cx(btnPrimary, "h-10")} disabled={!canSend || isSending}>
              <AdminIcon name="bell" size={16} />
              Envoyer à tout le monde
            </button>
          </div>
        </form>

        {/* Aperçu façon bannière de notification */}
        <div className="flex flex-col gap-2">
          <p className="m-0 text-[11px] font-semibold uppercase tracking-wider text-faint">Aperçu</p>
          <div className="flex gap-3 rounded-2xl border border-line bg-white/[.06] p-3 backdrop-blur">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-black">
              <Image src="/images/viewz-mark.png" alt="" width={14} height={18} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <strong className="truncate text-sm text-ink">{title.trim() || "Titre"}</strong>
                <span className="shrink-0 text-[11px] text-faint">maintenant</span>
              </div>
              <p className="m-0 line-clamp-4 break-words text-[13px] leading-snug text-muted">
                {body.trim() || "Ton message apparaîtra ici."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isConfirming && (
        <AdminModal
          title="Envoyer la notification ?"
          onClose={() => !isSending && setIsConfirming(false)}
          footer={
            <>
              <button type="button" className={btnSecondary} onClick={() => setIsConfirming(false)} disabled={isSending}>
                Annuler
              </button>
              <button type="button" className={btnPrimary} onClick={handleSend} disabled={isSending}>
                {isSending ? "Envoi..." : "Envoyer"}
              </button>
            </>
          }
        >
          <p className="m-0 text-sm leading-relaxed text-muted">
            {recipients === null ? "Tous les utilisateurs" : plural(recipients, "appareil")} vont recevoir
            {" "}« <span className="text-ink">{title.trim()}</span> ». Impossible d&apos;annuler une fois envoyée.
          </p>
        </AdminModal>
      )}
    </div>
  );
}
