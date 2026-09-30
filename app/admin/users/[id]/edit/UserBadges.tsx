"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  awardAdminUserBadge,
  getAdminBadges,
  getAdminUserBadges,
  revokeAdminUserBadge,
  type AdminBadge,
  type AdminUserBadge,
} from "@/lib/adminApi";
import { rarityOf } from "@/lib/badges";
import AdminIcon from "../../../AdminIcon";
import BadgeIcon from "../../../BadgeIcon";
import { alertError, badge, btnPrimary, cx, formSection, formSectionTitle, hint, iconBtnDanger, loadingState, select } from "../../../adminUi";

// Badges d'un utilisateur : attribution et retrait à la main (actions immédiates,
// indépendantes du formulaire du profil).
export default function UserBadges({ userId }: { userId: string }) {
  const [userBadges, setUserBadges] = useState<AdminUserBadge[]>([]);
  const [allBadges, setAllBadges] = useState<AdminBadge[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [owned, badges] = await Promise.all([getAdminUserBadges(userId), getAdminBadges()]);
      setUserBadges(owned);
      setAllBadges(badges);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chargement des badges impossible.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const timeout = setTimeout(() => void load(), 0);
    return () => clearTimeout(timeout);
  }, [load]);

  const ownedIds = new Set(userBadges.map((item) => item.badge.id));
  const available = allBadges.filter((item) => !ownedIds.has(item.id));

  const run = async (action: () => Promise<unknown>) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await action();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action impossible.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={cx(formSection, "mt-4 max-w-[760px] sm:mt-5")}>
      <h2 className={formSectionTitle}>Badges</h2>
      {error && <div className={alertError}>{error}</div>}

      {isLoading ? (
        <div className={cx(loadingState, "py-6")}>Chargement...</div>
      ) : (
        <>
          {userBadges.length === 0 ? (
            <p className="m-0 text-sm text-muted">Aucun badge pour le moment.</p>
          ) : (
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {userBadges.map((item) => (
                <li key={item.badge.id} className="flex items-center gap-3 rounded-lg border border-line bg-white/[.02] px-3 py-2.5">
                  <BadgeIcon icon={item.badge.icon} rarity={item.badge.rarity} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-ink">{item.badge.name}</span>
                      <span className={cx(badge, rarityOf(item.badge.rarity).className)}>{rarityOf(item.badge.rarity).label}</span>
                      {!item.visible && <span className={badge}>Masqué par l’utilisateur</span>}
                    </div>
                    <span className="text-xs text-faint">
                      {new Date(item.awardedAt).toLocaleDateString("fr-FR")} ·{" "}
                      {item.awardedBy ? `attribué par @${item.awardedBy.username}` : "automatique"}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={iconBtnDanger}
                    disabled={isSubmitting}
                    onClick={() => void run(() => revokeAdminUserBadge(userId, item.badge.id))}
                    aria-label={`Retirer ${item.badge.name}`}
                    title="Retirer"
                  >
                    <AdminIcon name="trash" size={17} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {available.length > 0 ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <select className={cx(select, "sm:flex-1")} value={selectedId} onChange={(e) => setSelectedId(e.target.value)} aria-label="Badge à attribuer">
                <option value="">Choisir un badge à attribuer…</option>
                {available.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({rarityOf(item.rarity).label})
                  </option>
                ))}
              </select>
              <button
                type="button"
                className={btnPrimary}
                disabled={!selectedId || isSubmitting}
                onClick={() => void run(async () => {
                  await awardAdminUserBadge(userId, selectedId);
                  setSelectedId("");
                })}
              >
                <AdminIcon name="plus" size={16} />
                Attribuer
              </button>
            </div>
          ) : (
            <span className={hint}>
              Il a déjà tous les badges. <Link href="/admin/badges" className="text-brand-light">Créer un badge</Link>
            </span>
          )}
        </>
      )}
    </section>
  );
}
