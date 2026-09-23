"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { btnGradient, cx, eyebrow, field, input, label, shellBackground } from "@/lib/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.message ?? "Connexion impossible.");
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={cx("flex min-h-screen items-center justify-center px-5 pt-[120px] pb-[60px]", shellBackground)}>
      <div className="w-[min(380px,100%)] rounded-3xl border border-line bg-white/4 p-[34px] backdrop-blur-[10px]">
        <p className={eyebrow}>VIEWZ · BACK-OFFICE</p>
        <h1 className="mt-3.5 mb-1.5 text-[22px] tracking-[-.02em]">Administration</h1>
        <p className="mt-1.5 text-[13px] text-muted">
          Réservé aux comptes administrateurs.
        </p>

        <form onSubmit={handleSubmit}>
          <div className={cx(field, "mt-4")}>
            <label htmlFor="email" className={label}>Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              className={input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={cx(field, "mt-4")}>
            <label htmlFor="password" className={label}>Mot de passe</label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              className={input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-3.5 py-3 text-[13px] text-danger">{error}</div>
          )}

          <button
            type="submit"
            className={cx(btnGradient, "mt-6 w-full cursor-pointer rounded-full border-none p-[13px] text-sm disabled:cursor-not-allowed disabled:opacity-60")}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </main>
  );
}
