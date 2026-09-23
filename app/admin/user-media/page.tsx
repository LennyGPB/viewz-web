"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react";
import { deleteAdminUserMedia, getAdminUserMedia, type AdminUserMedia } from "@/lib/adminApi";
import AdminHeading from "../AdminHeading";
import AdminIcon from "../AdminIcon";
import AdminModal from "../AdminModal";
import { alertError, btnDanger, btnSecondary, cx, emptyState, loadingState, searchInput, surface } from "../adminUi";

const tile = "group relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg border border-line bg-black/40 p-0 transition-colors hover:border-white/30";
const tileBadge = "absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-md bg-black/75 px-1.5 py-0.5 text-[11px] font-medium text-white";

type MediaKind = "Photo de profil" | "Photo" | "Vidéo";

interface OpenMedia {
  user: AdminUserMedia;
  url: string;
  kind: MediaKind;
}

const mediaOf = (user: AdminUserMedia) => [
  ...(user.profilePic ? [{ url: user.profilePic, kind: "Photo de profil" as const }] : []),
  ...user.profilePhotos.map((url) => ({ url, kind: "Photo" as const })),
  ...(user.videoUrl ? [{ url: user.videoUrl, kind: "Vidéo" as const }] : []),
];

export default function AdminUserMediaPage() {
  const [users, setUsers] = useState<AdminUserMedia[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMedia, setOpenMedia] = useState<OpenMedia | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      setUsers(await getAdminUserMedia(query));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chargement impossible.");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => void load(search), search ? 300 : 0);
    return () => clearTimeout(timeout);
  }, [search, load]);

  const closeMedia = useCallback(() => {
    if (isDeleting) return;
    setOpenMedia(null);
    setConfirming(false);
  }, [isDeleting]);

  const confirmDelete = async () => {
    if (!openMedia) return;
    setIsDeleting(true);
    try {
      await deleteAdminUserMedia(openMedia.user.id, openMedia.url);
      const { user, url } = openMedia;
      setUsers((current) =>
        current
          .map((u) => u.id !== user.id ? u : {
            ...u,
            profilePic: u.profilePic === url ? null : u.profilePic,
            videoUrl: u.videoUrl === url ? null : u.videoUrl,
            profilePhotos: u.profilePhotos.filter((photo) => photo !== url),
          })
          .filter((u) => mediaOf(u).length > 0),
      );
      setOpenMedia(null);
      setConfirming(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible.");
      setConfirming(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <AdminHeading
        title="Médias des profils"
        description="Photos et vidéos que les utilisateurs mettent sur leur profil, profils modifiés récemment en premier. Clique sur un média pour l'agrandir ou le supprimer."
      />

      <div className="mb-4">
        <input
          type="search"
          className={searchInput}
          placeholder="Rechercher par pseudo..."
          aria-label="Rechercher par pseudo"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className={alertError}>{error}</div>}

      {isLoading ? (
        <div className={loadingState}>Chargement...</div>
      ) : users.length === 0 ? (
        <div className={emptyState}>Aucun média trouvé.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {users.map((user) => (
            <section key={user.id} className={cx(surface, "p-4 sm:p-5")}>
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <span className="truncate text-sm font-semibold text-ink">@{user.username}</span>
                <span className="shrink-0 text-xs text-faint">
                  Modifié le {new Date(user.updatedAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
                {mediaOf(user).map((media) => (
                  <button
                    key={media.url}
                    type="button"
                    className={tile}
                    onClick={() => setOpenMedia({ user, ...media })}
                    aria-label={`Voir ${media.kind.toLowerCase()} de @${user.username}`}
                  >
                    {media.kind === "Vidéo" ? (
                      <video src={media.url} muted preload="metadata" className="size-full object-cover" />
                    ) : (
                      <img src={media.url} alt="" loading="lazy" className="size-full object-cover" />
                    )}
                    <span className={tileBadge}>
                      {media.kind === "Vidéo" && <AdminIcon name="play" size={10} />}
                      {media.kind === "Photo de profil" ? "Profil" : media.kind}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {openMedia && (
        <AdminModal
          title={`@${openMedia.user.username} · ${openMedia.kind}`}
          size="lg"
          onClose={closeMedia}
          footer={
            confirming ? (
              <>
                <button type="button" className={btnSecondary} disabled={isDeleting} onClick={() => setConfirming(false)}>
                  Annuler
                </button>
                <button type="button" className={btnDanger} disabled={isDeleting} onClick={confirmDelete}>
                  {isDeleting ? "Suppression..." : "Confirmer la suppression"}
                </button>
              </>
            ) : (
              <>
                <button type="button" className={btnSecondary} onClick={closeMedia}>Fermer</button>
                <button type="button" className={btnDanger} onClick={() => setConfirming(true)}>
                  <AdminIcon name="trash" size={16} />
                  Supprimer ce média
                </button>
              </>
            )
          }
        >
          {openMedia.kind === "Vidéo" ? (
            <video src={openMedia.url} controls autoPlay className="max-h-[60vh] w-full rounded-lg bg-black" />
          ) : (
            <img src={openMedia.url} alt={openMedia.kind} className="max-h-[60vh] w-full rounded-lg bg-black object-contain" />
          )}
          {confirming && (
            <p className="mt-4 mb-0 text-sm text-muted">
              Le média sera retiré du profil et supprimé définitivement.
            </p>
          )}
        </AdminModal>
      )}
    </div>
  );
}
