"use client";

import { useState, type FormEvent } from "react";
import { CONTACT_LIMITS, CONTACT_SUBJECTS } from "@/lib/contact";
import { btnGradient, cx, field, input, label, textarea } from "@/lib/ui";

type Status = "idle" | "sending" | "sent";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setError(null);
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message ?? "Envoi impossible.");
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Envoi impossible.");
      setStatus("idle");
    }
  };

  if (status === "sent") {
    return (
      <div className="flex flex-col items-start gap-4 py-6">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-purple/20 text-brand-light">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <h2 className="text-2xl font-extrabold text-white">Message envoyé !</h2>
        <p className="text-sm leading-relaxed text-muted">Merci, on a bien reçu ton message. On te répond au plus vite par email.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="cursor-pointer text-sm font-bold text-brand-light underline-offset-4 hover:underline"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className={field}>
          <label htmlFor="name" className={label}>Nom</label>
          <input id="name" name="name" required maxLength={CONTACT_LIMITS.name} autoComplete="name" className={input} />
        </div>
        <div className={field}>
          <label htmlFor="email" className={label}>Email</label>
          <input id="email" name="email" type="email" required maxLength={CONTACT_LIMITS.email} autoComplete="email" className={input} />
        </div>
      </div>

      <div className={field}>
        <label htmlFor="subject" className={label}>Sujet</label>
        <select id="subject" name="subject" required defaultValue={CONTACT_SUBJECTS[0]} className={cx(input, "[&_option]:bg-panel")}>
          {CONTACT_SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </div>

      <div className={field}>
        <label htmlFor="message" className={label}>Message</label>
        <textarea
          id="message"
          name="message"
          required
          minLength={CONTACT_LIMITS.minMessage}
          maxLength={CONTACT_LIMITS.message}
          rows={6}
          className={cx(textarea, "min-h-[160px]")}
        />
      </div>

      {/* Piège à robots : invisible pour les humains, ignoré par les lecteurs d'écran. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />

      {error && (
        <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-3.5 py-3 text-[13px] text-danger">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className={cx(
          btnGradient,
          "mt-1 cursor-pointer rounded-full border-none px-8 py-4 text-sm shadow-[0_12px_30px_rgba(124,58,237,.35)] hover:-translate-y-px disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:self-start",
        )}
      >
        {status === "sending" ? "Envoi en cours..." : "Envoyer le message"}
      </button>
    </form>
  );
}
