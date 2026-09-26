"use client";

import { useCallback, useState, type ReactNode } from "react";
import { badge, cx } from "../adminUi";
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

const detailRow = "flex flex-col gap-1 border-b border-line py-3 text-sm first:pt-0 last:border-b-0 sm:flex-row sm:gap-4";
const detailLabel = "shrink-0 text-[13px] text-muted sm:w-[150px]";

function DetailRow({ label, stacked, children }: { label: string; stacked?: boolean; children: ReactNode }) {
  return (
    <div className={cx(detailRow, stacked && "sm:flex-col sm:gap-1.5")}>
      <span className={detailLabel}>{label}</span>
      <span className="whitespace-pre-wrap leading-relaxed text-ink">{children}</span>
    </div>
  );
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
      getEditHref={(item) => `/admin/posts/${item.id}/edit`}
      renderDetail={(item) => {
        const post = item as PostItem;
        return (
          <div>
            <DetailRow label="Auteur">@{post.author?.username ?? "?"}</DetailRow>
            <DetailRow label="Ville">{post.city ?? "—"}</DetailRow>
            {post.eventDate && <DetailRow label="Date de l'événement">{formatDate(post.eventDate)}</DetailRow>}
            <DetailRow label="Publiée le">{formatDate(post.createdAt)}</DetailRow>
            {post.isOfficial && <DetailRow label="Statut">Officielle ViewZ</DetailRow>}
            {post.styles && post.styles.length > 0 && (
              <div className={detailRow}>
                <span className={detailLabel}>Styles</span>
                <span className="flex flex-wrap gap-1.5">
                  {post.styles.map((style) => (
                    <span key={style.id} className={badge}>
                      {style.name}
                    </span>
                  ))}
                </span>
              </div>
            )}
            <DetailRow label="Description" stacked>{post.description}</DetailRow>
          </div>
        );
      }}
    />
  );
}
