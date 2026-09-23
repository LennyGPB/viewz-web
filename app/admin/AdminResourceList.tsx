"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { AdminRecord } from "@/lib/adminApi";
import { adminLoading, alertError, btnGhostSmall, btnSmallDanger, cx, iconButtonDanger, iconButtonEdit } from "@/lib/ui";
import AdminHeading from "./AdminHeading";

const modalOverlay = "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5";
const modalPanel = "rounded-[20px] border border-line bg-panel p-[26px]";

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
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <AdminHeading title={title} description={description} action={headerAction} />

      {onSearch && (
        <div className="mb-[18px] flex flex-wrap items-center justify-between gap-3">
          <input
            className="min-w-[200px] max-w-[320px] flex-1 rounded-full border border-line bg-white/5 px-3.5 py-2.5 text-[13px] text-ink focus:border-brand/60 focus:outline-none"
            placeholder={searchPlaceholder ?? "Rechercher..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {error && <div className={alertError}>{error}</div>}

      {isLoading ? (
        <div className={adminLoading}>Chargement...</div>
      ) : items.length === 0 ? (
        <div className={cx(adminLoading, "rounded-[18px] border border-dashed border-line")}>{emptyLabel}</div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {items.map((item) => (
            <div
              key={item.id}
              className={cx(
                "flex items-center gap-3.5 rounded-2xl border border-line bg-white/[.035] px-[18px] py-4",
                renderDetail && "cursor-pointer transition duration-150 hover:border-brand/40 hover:bg-white/6",
              )}
              onClick={renderDetail ? () => setViewItem(item) : undefined}
              role={renderDetail ? "button" : undefined}
              tabIndex={renderDetail ? 0 : undefined}
              onKeyDown={renderDetail ? (e) => { if (e.key === "Enter") setViewItem(item); } : undefined}
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-white">{renderTitle(item)}</div>
                <div className="mt-[3px] truncate text-xs text-muted">{renderSubtitle(item)}</div>
              </div>
              {getEditHref && (
                <Link
                  href={getEditHref(item)}
                  className={iconButtonEdit}
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Modifier"
                  title="Modifier"
                >
                  ✎
                </Link>
              )}
              <button
                type="button"
                className={iconButtonDanger}
                disabled={deletingId !== null}
                onClick={(e) => { e.stopPropagation(); setPendingDelete(item); }}
                aria-label="Supprimer"
                title="Supprimer"
              >
                {deletingId === item.id ? "…" : "🗑"}
              </button>
            </div>
          ))}
        </div>
      )}

      {viewItem && renderDetail && (
        <div role="dialog" aria-modal="true" className={modalOverlay} onClick={() => setViewItem(null)}>
          <div onClick={(e) => e.stopPropagation()} className={cx(modalPanel, "max-h-[min(80vh,720px)] w-[min(560px,100%)] overflow-y-auto")}>
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2 className="m-0 text-[19px]">{renderTitle(viewItem)}</h2>
              <button
                type="button"
                onClick={() => setViewItem(null)}
                aria-label="Fermer"
                className="cursor-pointer border-none bg-transparent text-xl leading-none text-muted"
              >
                ×
              </button>
            </div>

            {renderDetail(viewItem)}

            <div className="mt-6 flex justify-end gap-2.5">
              <button type="button" className={btnGhostSmall} onClick={() => setViewItem(null)}>
                Fermer
              </button>
              <button
                type="button"
                className={btnSmallDanger}
                onClick={() => { setPendingDelete(viewItem); setViewItem(null); }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className={modalOverlay}
          onClick={() => (deletingId ? null : setPendingDelete(null))}
        >
          <div onClick={(e) => e.stopPropagation()} className={cx(modalPanel, "w-[min(380px,100%)]")}>
            <h2 className="mt-0 mb-2.5 text-lg">Confirmer la suppression</h2>
            <p className="m-0 text-sm leading-[1.6] text-muted">
              Supprimer définitivement « {confirmLabel(pendingDelete)} » ? Cette action est irréversible.
            </p>
            <div className="mt-[22px] flex justify-end gap-2.5">
              <button
                type="button"
                className={btnGhostSmall}
                disabled={deletingId !== null}
                onClick={() => setPendingDelete(null)}
              >
                Annuler
              </button>
              <button
                type="button"
                className={btnSmallDanger}
                disabled={deletingId !== null}
                onClick={confirmDelete}
              >
                {deletingId ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
