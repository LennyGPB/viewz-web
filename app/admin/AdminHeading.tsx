import Link from "next/link";
import type { ReactNode } from "react";
import AdminIcon from "./AdminIcon";

interface AdminHeadingProps {
  title: string;
  description?: string;
  action?: ReactNode;
  // Lien de retour (ex. formulaire → liste)
  back?: { href: string; label: string };
}

export default function AdminHeading({ title, description, action, back }: AdminHeadingProps) {
  return (
    <div className="mb-6 sm:mb-8">
      {back && (
        <Link href={back.href} className="mb-3 inline-flex items-center gap-1.5 text-[13px] text-muted no-underline hover:text-ink">
          <AdminIcon name="arrowLeft" size={15} />
          {back.label}
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="m-0 text-xl font-bold tracking-[-.01em] text-ink sm:text-2xl">{title}</h1>
          {description && <p className="mt-1.5 max-w-[640px] text-sm leading-relaxed text-muted">{description}</p>}
        </div>
        {action && <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div>}
      </div>
    </div>
  );
}
