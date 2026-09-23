"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// Le back-office a sa propre interface (barre latérale) : on y masque la
// navbar et le footer du site public.
export default function HideOnAdmin({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  return children;
}
