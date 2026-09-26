"use client";

import { useCallback, useState } from "react";
import AdminResourceList from "../AdminResourceList";
import { alertError, chip, formSectionTitle, hint } from "../adminUi";
import {
  getAdminUsers, deleteAdminUser, updateAdminUserVerification, type AdminRecord, type UserVerification,
} from "@/lib/adminApi";

interface UserItem extends AdminRecord {
  username: string;
  email: string;
  role: string;
  verification?: UserVerification;
}

const VERIFICATION_LABELS: Record<UserVerification, string> = {
  DEFAULT: "Aucun badge",
  VERIFIED: "Vérifié (badge blanc)",
  OFFICIAL: "Officiel ViewZ (badge violet)",
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  // Badges modifiés depuis le chargement de la liste, pour mettre la ligne à jour sans recharger.
  const [verifications, setVerifications] = useState<Record<string, UserVerification>>({});
  const fetchItems = useCallback(() => getAdminUsers(search), [search]);
  const verificationOf = (user: UserItem) => verifications[user.id] ?? user.verification ?? "DEFAULT";

  return (
    <AdminResourceList
      title="Utilisateurs"
      description="Comptes inscrits sur ViewZ."
      emptyLabel="Aucun utilisateur trouvé."
      fetchItems={fetchItems}
      deleteItem={deleteAdminUser}
      renderTitle={(item) => `@${(item as UserItem).username}`}
      renderSubtitle={(item) => {
        const user = item as UserItem;
        const verification = verificationOf(user);
        return `${user.email} · ${user.role}${verification !== "DEFAULT" ? ` · ${verification}` : ""}`;
      }}
      renderDetail={(item) => (
        <VerificationPicker
          user={item as UserItem}
          value={verificationOf(item as UserItem)}
          onChange={(verification) => setVerifications((current) => ({ ...current, [item.id]: verification }))}
        />
      )}
      confirmLabel={(item) => `@${(item as UserItem).username}`}
      getEditHref={(item) => `/admin/users/${item.id}/edit`}
      onSearch={setSearch}
      searchPlaceholder="Rechercher par pseudo ou email..."
    />
  );
}

function VerificationPicker({ user, value, onChange }: {
  user: UserItem;
  value: UserVerification;
  onChange: (verification: UserVerification) => void;
}) {
  const [saving, setSaving] = useState<UserVerification | null>(null);
  const [error, setError] = useState<string | null>(null);

  const select = async (verification: UserVerification) => {
    if (verification === value || saving) return;
    setSaving(verification);
    setError(null);
    try {
      await updateAdminUserVerification(user.id, verification);
      onChange(verification);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Modification impossible.");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="m-0 text-sm text-muted">{user.email}</p>
      <span className={formSectionTitle}>Badge du compte</span>
      {error && <div className={alertError}>{error}</div>}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(VERIFICATION_LABELS) as UserVerification[]).map((verification) => (
          <button
            key={verification}
            type="button"
            className={chip(value === verification)}
            disabled={saving !== null}
            onClick={() => select(verification)}
          >
            {saving === verification ? "Enregistrement..." : VERIFICATION_LABELS[verification]}
          </button>
        ))}
      </div>
      <span className={hint}>Le badge s&apos;affiche à côté du pseudo dans l&apos;app (profil, messages, conversations).</span>
    </div>
  );
}
