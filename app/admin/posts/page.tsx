"use client";

import { useCallback, useState } from "react";
import AdminResourceList from "../AdminResourceList";
import { getAdminPosts, deleteAdminPost, type AdminRecord } from "@/lib/adminApi";

interface PostItem extends AdminRecord {
  title: string;
  description: string;
  city?: string | null;
  eventDate?: string | null;
  createdAt: string;
  isOfficial?: boolean;
  styles?: { id: string; name: string }[];
  author?: { username: string };
}

const formatDate = (value?: string | null) => {
  if (!value) return null;
  return new Date(value).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" });
};

export default function AdminPostsPage() {
  const [search, setSearch] = useState("");
  const fetchItems = useCallback(() => getAdminPosts(search), [search]);

  return (
    <AdminResourceList
      title="Recherches"
      description="Annonces publiées par les utilisateurs. Clique sur une annonce pour la voir en entier."
      emptyLabel="Aucune recherche pour le moment."
      fetchItems={fetchItems}
      deleteItem={deleteAdminPost}
      onSearch={setSearch}
      searchPlaceholder="Rechercher par titre, ville ou auteur..."
      renderTitle={(item) => (item as PostItem).title}
      renderSubtitle={(item) => {
        const post = item as PostItem;
        return `@${post.author?.username ?? "?"} · ${post.city ?? "Sans ville"}`;
      }}
      confirmLabel={(item) => (item as PostItem).title}
      renderDetail={(item) => {
        const post = item as PostItem;
        return (
          <div>
            <div className="admin-detail-row">
              <span className="admin-detail-label">Auteur</span>
              <span className="admin-detail-value">@{post.author?.username ?? "?"}</span>
            </div>
            <div className="admin-detail-row">
              <span className="admin-detail-label">Ville</span>
              <span className="admin-detail-value">{post.city ?? "—"}</span>
            </div>
            {post.eventDate && (
              <div className="admin-detail-row">
                <span className="admin-detail-label">Date de l&apos;événement</span>
                <span className="admin-detail-value">{formatDate(post.eventDate)}</span>
              </div>
            )}
            <div className="admin-detail-row">
              <span className="admin-detail-label">Publiée le</span>
              <span className="admin-detail-value">{formatDate(post.createdAt)}</span>
            </div>
            {post.isOfficial && (
              <div className="admin-detail-row">
                <span className="admin-detail-label">Statut</span>
                <span className="admin-detail-value">Officielle ViewZ</span>
              </div>
            )}
            {post.styles && post.styles.length > 0 && (
              <div className="admin-detail-row">
                <span className="admin-detail-label">Styles</span>
                <span className="admin-detail-badges">
                  {post.styles.map((style) => (
                    <span key={style.id} className="admin-detail-badge">{style.name}</span>
                  ))}
                </span>
              </div>
            )}
            <div className="admin-detail-row" style={{ flexDirection: "column", gap: 6 }}>
              <span className="admin-detail-label">Description</span>
              <span className="admin-detail-value">{post.description}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
