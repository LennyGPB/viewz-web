"use client";

import { useEffect, type ReactNode } from "react";
import AdminIcon from "./AdminIcon";
import { cx, iconBtn, modalOverlay, modalPanel } from "./adminUi";

interface AdminModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "lg";
}

// Fenêtre modale du back-office : feuille en bas d'écran sur mobile, centrée
// sur ordinateur. Se ferme avec Échap ou un clic à l'extérieur.
export default function AdminModal({ title, onClose, children, footer, size = "sm" }: AdminModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label={title} className={modalOverlay} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className={cx(modalPanel, size === "lg" ? "sm:max-w-[600px]" : "sm:max-w-[420px]")}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="m-0 text-base font-semibold text-ink sm:text-lg">{title}</h2>
          <button type="button" className={cx(iconBtn, "-mt-1 -mr-2")} onClick={onClose} aria-label="Fermer">
            <AdminIcon name="close" />
          </button>
        </div>
        {children}
        {footer && <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{footer}</div>}
      </div>
    </div>
  );
}
