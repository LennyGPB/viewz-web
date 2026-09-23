import type { ReactNode } from "react";

export default function AdminHeading({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-[22px] flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="m-0 text-2xl tracking-[-.02em]">{title}</h1>
        {description && <p className="mt-1 text-[13px] text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
