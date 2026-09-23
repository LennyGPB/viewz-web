"use client";

import { useCallback, useState, type FormEvent } from "react";
import AdminResourceList from "../AdminResourceList";
import { createAdminStyle, deleteAdminStyle, getAdminStyles, type AdminRecord, type AdminStyle } from "@/lib/adminApi";
import AdminIcon from "../AdminIcon";
import { btnPrimary, cx, input } from "../adminUi";

const usageLabel = ({ _count }: AdminStyle) => {
  const parts = [
    _count.users && `${_count.users} profil${_count.users > 1 ? "s" : ""}`,
    _count.posts && `${_count.posts} annonce${_count.posts > 1 ? "s" : ""}`,
    _count.events && `${_count.events} événement${_count.events > 1 ? "s" : ""}`,
  ].filter(Boolean);
  return parts.length ? `Utilisé par ${parts.join(", ")}` : "Pas encore utilisé";
};

export default function AdminStylesPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [newName, setNewName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // refreshKey change l'identité de fetchItems, ce qui recharge la liste après un ajout.
  const fetchItems = useCallback(
    () => getAdminStyles() as unknown as Promise<AdminRecord[]>,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refreshKey],
  );

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newName.trim()) return;
    setIsCreating(true);
    setCreateError(null);
    try {
      await createAdminStyle(newName);
      setNewName("");
      setRefreshKey((key) => key + 1);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Impossible d'ajouter le style.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <AdminResourceList
      title="Styles"
      description="Styles de danse proposés dans l'app et sur le site. Supprimer un style le retire des profils, annonces et événements qui l'utilisent."
      emptyLabel="Aucun style pour le moment."
      fetchItems={fetchItems}
      deleteItem={deleteAdminStyle}
      renderTitle={(item) => (item as unknown as AdminStyle).name}
      renderSubtitle={(item) => usageLabel(item as unknown as AdminStyle)}
      confirmLabel={(item) => (item as unknown as AdminStyle).name}
      headerAction={
        <form onSubmit={handleCreate} className="flex w-full flex-col gap-1.5 sm:w-auto sm:items-end">
          <div className="flex gap-2">
            <input
              className={cx(input, "sm:w-[220px]")}
              placeholder="Nom du nouveau style"
              aria-label="Nom du nouveau style"
              maxLength={40}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button type="submit" className={cx(btnPrimary, "h-10")} disabled={isCreating || !newName.trim()}>
              <AdminIcon name="plus" size={16} />
              {isCreating ? "Ajout..." : "Ajouter"}
            </button>
          </div>
          {createError && <span className="text-xs text-red-300">{createError}</span>}
        </form>
      }
    />
  );
}
