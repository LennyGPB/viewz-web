"use client";
import { FormEvent, useState } from "react";

export default function AccountDeletionForm() {
  const [status, setStatus] = useState<"idle"|"sending"|"success"|"error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("sending"); setMessage("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/suppression-compte", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error ?? "L’envoi a échoué. Réessaie dans quelques instants.");
      setStatus("success"); setMessage("Ta demande a bien été envoyée. Nous te contacterons par email."); formElement.reset();
    } catch (error) {
      setStatus("error"); setMessage(error instanceof Error ? error.message : "L’envoi a échoué. Réessaie dans quelques instants.");
    }
  }

  return <form className="deletion-form" onSubmit={submit}>
    <div className="form-field"><label htmlFor="email">Email du compte</label><input id="email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="toi@exemple.com" /></div>
    <div className="form-field"><label htmlFor="username">Nom d’utilisateur ViewZ</label><input id="username" name="username" required minLength={2} maxLength={50} autoComplete="username" placeholder="Ton pseudo" /></div>
    <div className="form-field"><label htmlFor="reason">Motif <span>(facultatif)</span></label><textarea id="reason" name="reason" maxLength={1000} rows={4} placeholder="Tu peux nous expliquer pourquoi tu pars…" /></div>
    <div className="honey" aria-hidden="true"><label htmlFor="website">Site web</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
    <label className="confirm-row"><input type="checkbox" name="confirmed" value="yes" required /><span>Je confirme vouloir supprimer définitivement mon compte ViewZ et les données qui y sont associées.</span></label>
    <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Envoi en cours…" : "Envoyer ma demande"}</button>
    {message && <p className={`form-message ${status}`} role="status">{message}</p>}
    <p className="form-privacy">Ces informations sont utilisées uniquement pour traiter ta demande de suppression.</p>
  </form>;
}
