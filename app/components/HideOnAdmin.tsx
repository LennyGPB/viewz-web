"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// Pages plein écran qui ont leur propre interface : le back-office (barre
// latérale) et le dossier de présentation. On y masque la navbar et le footer.
const FULLSCREEN_SECTIONS = ["/admin", "/presentation"];

export default function HideOnAdmin({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (FULLSCREEN_SECTIONS.some((section) => pathname === section || pathname.startsWith(`${section}/`))) return null;
  return children;
}
