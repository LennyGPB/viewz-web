"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  createAdminBadge,
  deleteAdminBadge,
  getAdminBadges,
  updateAdminBadge,
  type AdminBadge,
  type BadgeInput,
} from "@/lib/adminApi";
import { BADGE_ICONS, CRITERIA, RARITIES, criterionOf, rarityOf, type BadgeCriterion } from "@/lib/badges";
import AdminHeading from "../AdminHeading";
import AdminIcon from "../AdminIcon";
import AdminModal from "../AdminModal";
import BadgeIcon from "../BadgeIcon";
import {
  alertError, badge, btnDanger, btnPrimary, btnSecondary, chip, cx, emptyState, field, hint, iconBtn, iconBtnDanger, input, label,
  loadingState, surface, textarea,
} from "../adminUi";

const EMPTY_BADGE: BadgeInput = { name: "", description: "", icon: "workspace-premium", rarity: "COMMON", criterion: null, threshold: null };

const ruleLabel = (item: Pick<AdminBadge, "criterion" | "threshold">) => {
  const criterion = criterionOf(item.criterion);
  return criterion && item.threshold ? `Automatique · ${item.threshold} ${criterion.unit}` : "Attribué à la main";
};

export default function AdminBadgesPage() {
  const [badges, setBadges] = useState<AdminBadge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Badge en cours d'édition (id null = nouveau badge)
  const [editing, setEditing] = useState<{ id: string | null; values: BadgeInput } | null>(null);
  const [deleting, setDeleting] = useState<AdminBadge | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setBadges(await getAdminBadges());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chargement impossible.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => void load(), 0);
    return () => clearTimeout(timeout);
  }, [load]);

  const openEditor = (item?: AdminBadge) => {
    setFormError(null);
    setEditing(
      item
        ? { id: item.id, values: { name: item.name, description: item.description, icon: item.icon, rarity: item.rarity, criterion: item.criterion, threshold: item.threshold } }
        : { id: null, values: EMPTY_BADGE },
    );
  };

  const closeEditor = useCallback(() => {
    if (!isSubmitting) setEditing(null);
  }, [isSubmitting]);

  const setValues = (patch: Partial<BadgeInput>) =>
    setEditing((current) => current && { ...current, values: { ...current.values, ...patch } });

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;
    const { values } = editing;
    if (values.criterion && !values.threshold) {
      setFormError("Indique le seuil du badge automatique.");
      return;
    }
    setIsSubmitting(true);
    setFormError(null);
    try {
      if (editing.id) await updateAdminBadge(editing.id, values);
      else await createAdminBadge(values);
      setEditing(null);
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Enregistrement impossible.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setIsSubmitting(true);
    try {
      await deleteAdminBadge(deleting.id);
      setBadges((current) => current.filter((item) => item.id !== deleting.id));
      setDeleting(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible.");
      setDeleting(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const values = editing?.values;

  return (
    <div>
      <AdminHeading
        title="Badges"
        description="Récompenses affichées sur les profils. Un badge automatique est donné dès que le seuil est atteint (y compris aux membres qui l'ont déjà atteint) ; les autres s'attribuent à la main depuis la fiche d'un utilisateur."
        action={
          <button type="button" className={btnPrimary} onClick={() => openEditor()}>
            <AdminIcon name="plus" size={16} />
            Nouveau badge
          </button>
        }
      />

      {error && <div className={alertError}>{error}</div>}

      {isLoading ? (
        <div className={loadingState}>Chargement...</div>
      ) : badges.length === 0 ? (
        <div className={emptyState}>Aucun badge pour le moment.</div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {badges.map((item) => (
            <section key={item.id} className={cx(surface, "flex items-center gap-3.5 p-4")}>
              <BadgeIcon icon={item.icon} rarity={item.rarity} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="m-0 text-sm font-semibold text-ink">{item.name}</p>
                  <span className={cx(badge, rarityOf(item.rarity).className)}>{rarityOf(item.rarity).label}</span>
                </div>
                <p className="m-0 mt-0.5 text-[13px] text-muted">{item.description}</p>
                <p className="m-0 mt-1 text-xs text-faint">
                  {ruleLabel(item)} · {item._count.users} membre{item._count.users > 1 ? "s" : ""}
                </p>
              </div>
              <button type="button" className={iconBtn} onClick={() => openEditor(item)} aria-label={`Modifier ${item.name}`}>
                <AdminIcon name="edit" size={17} />
              </button>
              <button type="button" className={iconBtnDanger} onClick={() => setDeleting(item)} aria-label={`Supprimer ${item.name}`}>
                <AdminIcon name="trash" size={17} />
              </button>
            </section>
          ))}
        </div>
      )}

      {editing && values && (
        <AdminModal title={editing.id ? "Modifier le badge" : "Nouveau badge"} onClose={closeEditor} size="lg">
          <form className="flex flex-col gap-5" onSubmit={submit}>
            {formError && <div className={alertError}>{formError}</div>}

            <div className="flex items-center gap-3">
              <BadgeIcon icon={values.icon} rarity={values.rarity} />
              <div className="min-w-0">
                <p className="m-0 text-sm font-semibold text-ink">{values.name || "Nom du badge"}</p>
                <p className="m-0 text-xs text-muted">{values.description || "Description"}</p>
              </div>
            </div>

            <div className={field}>
              <label htmlFor="badge-name" className={label}>Nom</label>
              <input id="badge-name" className={input} required maxLength={40} value={values.name} onChange={(e) => setValues({ name: e.target.value })} />
            </div>

            <div className={field}>
              <label htmlFor="badge-description" className={label}>Description</label>
              <textarea
                id="badge-description"
                className={cx(textarea, "min-h-[72px]")}
                required
                maxLength={200}
                value={values.description}
                onChange={(e) => setValues({ description: e.target.value })}
              />
            </div>

            <div className={field}>
              <span className={label}>Rareté</span>
              <div className="flex flex-wrap gap-2">
                {RARITIES.map((rarity) => (
                  <button key={rarity.value} type="button" className={chip(values.rarity === rarity.value)} onClick={() => setValues({ rarity: rarity.value })}>
                    {rarity.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={field}>
              <span className={label}>Icône</span>
              <div className="flex flex-wrap gap-2">
                {BADGE_ICONS.map((icon) => (
                  <button
                    key={icon.value}
                    type="button"
                    title={icon.label}
                    aria-label={icon.label}
                    aria-pressed={values.icon === icon.value}
                    onClick={() => setValues({ icon: icon.value })}
                    className={cx(
                      "cursor-pointer rounded-full p-0.5 transition",
                      values.icon === icon.value ? "ring-2 ring-accent" : "opacity-60 hover:opacity-100",
                    )}
                  >
                    <BadgeIcon icon={icon.value} rarity={values.rarity} size="sm" />
                  </button>
                ))}
              </div>
            </div>

            <div className={field}>
              <span className={label}>Attribution</span>
              <div className="flex flex-wrap gap-2">
                <button type="button" className={chip(!values.criterion)} onClick={() => setValues({ criterion: null, threshold: null })}>
                  À la main
                </button>
                {CRITERIA.map((criterion) => (
                  <button
                    key={criterion.value}
                    type="button"
                    className={chip(values.criterion === criterion.value)}
                    onClick={() => setValues({ criterion: criterion.value as BadgeCriterion, threshold: values.threshold ?? 10 })}
                  >
                    {criterion.label}
                  </button>
                ))}
              </div>
              {values.criterion ? (
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={100000}
                    className={cx(input, "w-28")}
                    aria-label="Seuil"
                    value={values.threshold ?? ""}
                    onChange={(e) => setValues({ threshold: e.target.value ? Number(e.target.value) : null })}
                  />
                  <span className="text-sm text-muted">{criterionOf(values.criterion)?.unit}</span>
                </div>
              ) : (
                <span className={hint}>Tu l’attribues depuis la fiche d’un utilisateur (Utilisateurs › Modifier).</span>
              )}
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
              <button type="button" className={btnSecondary} disabled={isSubmitting} onClick={closeEditor}>
                Annuler
              </button>
              <button type="submit" className={btnPrimary} disabled={isSubmitting}>
                {isSubmitting ? "Enregistrement..." : editing.id ? "Enregistrer" : "Créer le badge"}
              </button>
            </div>
          </form>
        </AdminModal>
      )}

      {deleting && (
        <AdminModal
          title="Supprimer ce badge ?"
          onClose={() => !isSubmitting && setDeleting(null)}
          footer={
            <>
              <button type="button" className={btnSecondary} disabled={isSubmitting} onClick={() => setDeleting(null)}>
                Annuler
              </button>
              <button type="button" className={btnDanger} disabled={isSubmitting} onClick={confirmDelete}>
                {isSubmitting ? "Suppression..." : "Supprimer"}
              </button>
            </>
          }
        >
          <p className="m-0 text-sm leading-relaxed text-muted">
            « {deleting.name} » sera retiré des {deleting._count.users} profil{deleting._count.users > 1 ? "s" : ""} qui l’ont. Cette action est définitive.
          </p>
        </AdminModal>
      )}
    </div>
  );
}
