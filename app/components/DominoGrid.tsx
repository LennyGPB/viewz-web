"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/ui";

// Déclenche la chute en cascade des cartes (.domino-card, voir globals.css)
// la première fois que la grille entre dans l'écran.
export default function DominoGrid({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cx("domino-grid", visible && "is-visible", className)}>
      {children}
    </div>
  );
}
