"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { AdminRecord } from "@/lib/adminApi";
import AdminHeading from "./AdminHeading";
import AdminIcon from "./AdminIcon";
import AdminModal from "./AdminModal";
import {
  alertError, btnDanger, btnSecondary, cx, emptyState, iconBtn, iconBtnDanger, loadingState, searchInput, surface,
} from "./adminUi";

interface AdminResourceListProps {
  title: string;
  description?: string;
  emptyLabel: string;
  fetchItems: () => Promise<AdminRecord[]>;
  deleteItem: (id: string) => Promise<unknown>;
  renderTitle: (item: AdminRecord) => string;
  renderSubtitle: (item: AdminRecord) => string;
  confirmLabel: (item: AdminRecord) => string;
  renderDetail?: (item: AdminRecord) => ReactNode;
  getEditHref?: (item: AdminRecord) => string;
  headerAction?: ReactNode;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
}

export default function AdminResourceList({
  title,
  description,
  emptyLabel,
  fetchItems,
  deleteItem,
  renderTitle,
  renderSubtitle,
  confirmLabel,
  renderDetail,
  getEditHref,
  headerAction,
  onSearch,
  searchPlaceholder,
}: AdminResourceListProps) {
  const [items, setItems] = useState<AdminRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminRecord | null>(null);
  const [viewItem, setViewItem] = useState<AdminRecord | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setItems(await fetchItems());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chargement impossible.");
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchItems]);

  useEffect(() => {
    // La récupération des données est le cas d'usage canonique d'un effect ;
    // le setState a lieu après l'await, jamais de façon synchrone au montage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  useEffect(() => {
    if (!onSearch) return;
    const timeout = setTimeout(() => onSearch(search), 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeletingId(pendingDelete.id);
    try {
      await deleteItem(pendingDelete.id);
      setItems((current) => current.filter((item) => item.id !== pendingDelete.id));
      setPendingDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible.");
      setPendingDelete(null);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <AdminHeading title={title} description={description} action={headerAction} />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {onSearch ? (
          <input
            type="search"
            className={searchInput}
            placeholder={searchPlaceholder ?? "Rechercher..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={searchPlaceholder ?? "Rechercher"}
          />
        ) : <span />}
        {!isLoading && items.length > 0 && (
          <span className="text-[13px] text-faint">
            {items.length} élément{items.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {error && <div className={alertError}>{error}</div>}

      {isLoading ? (
        <div className={loadingState}>Chargement...</div>
      ) : items.length === 0 ? (
        <div className={emptyState}>{emptyLabel}</div>
      ) : (
        <ul className={cx(surface, "divide-y divide-line overflow-hidden")}>
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-2 px-4 py-3 transition-colors hover:bg-white/[.02] sm:gap-3 sm:px-5">
              {renderDetail ? (
                <button
                  type="button"
                  onClick={() => setViewItem(item)}
                  className="min-w-0 flex-1 cursor-pointer border-none bg-transparent p-0 text-left"
                >
                  <RowText title={renderTitle(item)} subtitle={renderSubtitle(item)} />
                </button>
              ) : (
                <div className="min-w-0 flex-1">
                  <RowText title={renderTitle(item)} subtitle={renderSubtitle(item)} />
                </div>
              )}
              {renderDetail && (
                <button type="button" className={cx(iconBtn, "hidden sm:inline-flex")} onClick={() => setViewItem(item)} aria-label="Voir le détail" title="Voir le détail">
                  <AdminIcon name="chevronRight" />
                </button>
              )}
              {getEditHref && (
                <Link href={getEditHref(item)} className={iconBtn} aria-label="Modifier" title="Modifier">
                  <AdminIcon name="edit" />
                </Link>
              )}
              <button
                type="button"
                className={iconBtnDanger}
                disabled={deletingId !== null}
                onClick={() => setPendingDelete(item)}
                aria-label="Supprimer"
                title="Supprimer"
              >
                <AdminIcon name="trash" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {viewItem && renderDetail && (
        <AdminModal
          title={renderTitle(viewItem)}
          size="lg"
          onClose={() => setViewItem(null)}
          footer={
            <>
              <button type="button" className={btnSecondary} onClick={() => setViewItem(null)}>Fermer</button>
              <button type="button" className={btnDanger} onClick={() => { setPendingDelete(viewItem); setViewItem(null); }}>
                Supprimer
              </button>
            </>
          }
        >
          {renderDetail(viewItem)}
        </AdminModal>
      )}

      {pendingDelete && (
        <AdminModal
          title="Confirmer la suppression"
          onClose={() => (deletingId ? null : setPendingDelete(null))}
          footer={
            <>
              <button type="button" className={btnSecondary} disabled={deletingId !== null} onClick={() => setPendingDelete(null)}>
                Annuler
              </button>
              <button type="button" className={btnDanger} disabled={deletingId !== null} onClick={confirmDelete}>
                {deletingId ? "Suppression..." : "Supprimer"}
              </button>
            </>
          }
        >
          <p className="m-0 text-sm leading-relaxed text-muted">
            Supprimer définitivement <strong className="text-ink">« {confirmLabel(pendingDelete)} »</strong> ? Cette action est irréversible.
          </p>
        </AdminModal>
      )}
    </div>
  );
}

function RowText({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <span className="block truncate text-sm font-semibold text-ink">{title}</span>
      <span className="mt-0.5 block truncate text-[13px] text-muted">{subtitle}</span>
    </>
  );
}
