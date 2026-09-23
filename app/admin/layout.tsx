import type { Metadata } from "next";
import { requireAdmin } from "@/lib/session";
import AdminShell from "./AdminShell";

export const metadata: Metadata = { title: "Administration" };

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Revérifie le rôle ADMIN auprès de l'API à chaque navigation vers /admin/*
  // (le proxy ne fait qu'un contrôle optimiste sur la présence du cookie).
  const user = await requireAdmin();

  return <AdminShell user={user}>{children}</AdminShell>;
}
