"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { AdminRecord } from "@/lib/adminApi";

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
      <div className="admin-heading">
        <div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        {headerAction}
      </div>

      {onSearch && (
        <div className="admin-toolbar">
          <input
            className="admin-search"
            placeholder={searchPlaceholder ?? "Rechercher..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {error && <div className="admin-error">{error}</div>}

      {isLoading ? (
        <div className="admin-loading">Chargement...</div>
      ) : items.length === 0 ? (
        <div className="admin-empty">{emptyLabel}</div>
      ) : (
        <div className="admin-list">
          {items.map((item) => (
            <div
              key={item.id}
              className={`admin-row${renderDetail ? " admin-row-clickable" : ""}`}
              onClick={renderDetail ? () => setViewItem(item) : undefined}
              role={renderDetail ? "button" : undefined}
              tabIndex={renderDetail ? 0 : undefined}
              onKeyDown={renderDetail ? (e) => { if (e.key === "Enter") setViewItem(item); } : undefined}
            >
              <div className="admin-row-body">
                <div className="admin-row-title">{renderTitle(item)}</div>
                <div className="admin-row-sub">{renderSubtitle(item)}</div>
              </div>
              <button
                type="button"
                className="btn-danger"
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
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed", inset: 0, zIndex: 50,
            background: "rgba(0,0,0,.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setViewItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(560px, 100%)",
              maxHeight: "min(80vh, 720px)",
              overflowY: "auto",
              background: "#0f0d14",
              border: "1px solid var(--line)",
              borderRadius: 20,
              padding: 26,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 19 }}>{renderTitle(viewItem)}</h2>
              <button
                type="button"
                onClick={() => setViewItem(null)}
                aria-label="Fermer"
                style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 20, cursor: "pointer", lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            {renderDetail(viewItem)}

            <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn-ghost"
                style={{ padding: "10px 18px", fontSize: 13 }}
                onClick={() => setViewItem(null)}
              >
                Fermer
              </button>
              <button
                type="button"
                className="btn-small"
                style={{ background: "linear-gradient(135deg,#f87171,#b91c1c)" }}
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
          style={{
            position: "fixed", inset: 0, zIndex: 50,
            background: "rgba(0,0,0,.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20,
          }}
          onClick={() => (deletingId ? null : setPendingDelete(null))}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(380px, 100%)",
              background: "#0f0d14",
              border: "1px solid var(--line)",
              borderRadius: 20,
              padding: 26,
            }}
          >
            <h2 style={{ margin: "0 0 10px", fontSize: 18 }}>Confirmer la suppression</h2>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Supprimer définitivement « {confirmLabel(pendingDelete)} » ? Cette action est irréversible.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn-ghost"
                style={{ padding: "10px 18px", fontSize: 13 }}
                disabled={deletingId !== null}
                onClick={() => setPendingDelete(null)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn-small"
                style={{ background: "linear-gradient(135deg,#f87171,#b91c1c)" }}
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
