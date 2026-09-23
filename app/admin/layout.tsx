import { requireAdmin } from "@/lib/session";
import AdminShell from "./AdminShell";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Revérifie le rôle ADMIN auprès de l'API à chaque navigation vers /admin/*
  // (le proxy ne fait qu'un contrôle optimiste sur la présence du cookie).
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-bg bg-[radial-gradient(circle_at_80%_0%,rgba(123,62,218,.16),transparent_40%)] pt-24">
      <AdminShell user={user}>{children}</AdminShell>
    </div>
  );
}
