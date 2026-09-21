"use client";

import { useCallback, useState } from "react";
import AdminResourceList from "../AdminResourceList";
import { getAdminUsers, deleteAdminUser, type AdminRecord } from "@/lib/adminApi";

interface UserItem extends AdminRecord {
  username: string;
  email: string;
  role: string;
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const fetchItems = useCallback(() => getAdminUsers(search), [search]);

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
        return `${user.email} · ${user.role}`;
      }}
      confirmLabel={(item) => `@${(item as UserItem).username}`}
      onSearch={setSearch}
      searchPlaceholder="Rechercher par pseudo ou email..."
    />
  );
}
