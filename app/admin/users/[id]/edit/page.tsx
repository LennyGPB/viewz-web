"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState, type FormEvent } from "react";
import { getAdminUser, updateAdminUser, type AdminRecord, type UserRole } from "@/lib/adminApi";
import AdminHeading from "../../../AdminHeading";
import {
  alertError, btnPrimary, btnSecondary, chip, field, formSection, formSectionTitle, hint, input, label, loadingState, textarea,
} from "../../../adminUi";

interface UserRecord extends AdminRecord {
  username: string;
  email: string;
  bio?: string | null;
  role: UserRole;
}

const ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: "USER", label: "Utilisateur", description: "Compte classique." },
  { value: "ORGANIZER", label: "Organisateur", description: "Peut publier des événements." },
  { value: "ADMIN", label: "Admin", description: "Accès complet au back-office." },
];

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [user, setUser] = useState<UserRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAdminUser(id)
      .then((record) => setUser(record as UserRecord))
      .catch((err) => setError(err instanceof Error ? err.message : "Chargement impossible."))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <div className={loadingState}>Chargement...</div>;
  if (error || !user) return <div className={alertError}>{error ?? "Utilisateur introuvable."}</div>;

  return <UserForm user={user} />;
}

function UserForm({ user }: { user: UserRecord }) {
  const router = useRouter();
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio ?? "");
  const [role, setRole] = useState<UserRole>(user.role);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const normalizedUsername = username.trim();
    if (/\s/.test(normalizedUsername)) {
      setError("Le pseudo ne doit pas contenir d’espace.");
      return;
    }
    setIsSubmitting(true);
    try {
      // On n'envoie que ce qui a changé : le rôle inchangé ne déclenche pas la protection « son propre rôle ».
      await updateAdminUser(user.id, {
        ...(normalizedUsername !== user.username && { username: normalizedUsername }),
        ...(bio.trim() !== (user.bio ?? "") && { bio: bio.trim() || null }),
        ...(role !== user.role && { role }),
      });
      router.push("/admin/users");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'enregistrer l'utilisateur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <AdminHeading
        title={`Modifier @${user.username}`}
        description={user.email}
        back={{ href: "/admin/users", label: "Utilisateurs" }}
      />

      {error && <div className={alertError}>{error}</div>}

      <form className="flex max-w-[760px] flex-col gap-4 sm:gap-5" onSubmit={handleSubmit}>
        <section className={formSection}>
          <h2 className={formSectionTitle}>Profil</h2>

          <div className={field}>
            <label htmlFor="username" className={label}>Pseudo</label>
            <input
              id="username"
              className={input}
              required
              minLength={3}
              maxLength={30}
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
              autoComplete="off"
            />
            <span className={hint}>Unique, sans espace. Le délai de 30 jours entre deux changements ne s’applique pas ici.</span>
          </div>

          <div className={field}>
            <label htmlFor="bio" className={label}>Bio</label>
            <textarea id="bio" className={textarea} maxLength={200} value={bio} onChange={(e) => setBio(e.target.value)} />
            <span className={hint}>{bio.length}/200</span>
          </div>
        </section>

        <section className={formSection}>
          <h2 className={formSectionTitle}>Rôle</h2>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((option) => (
              <button key={option.value} type="button" className={chip(role === option.value)} onClick={() => setRole(option.value)}>
                {option.label}
              </button>
            ))}
          </div>
          <span className={hint}>{ROLES.find((option) => option.value === role)?.description}</span>
        </section>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Link href="/admin/users" className={btnSecondary}>Annuler</Link>
          <button type="submit" className={btnPrimary} disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}
