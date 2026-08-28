"use client";

import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
};

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <tr>
      <td colSpan={99} className="px-5 py-12 text-center">
        <div className="mx-auto flex w-fit flex-col items-center gap-2">
          {Icon ? (
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#f3f4f6] text-[#9ca3af]">
              <Icon className="size-5" />
            </span>
          ) : null}
          <p className="text-sm font-medium text-[#374151]">{title}</p>
          {description ? (
            <p className="max-w-sm text-xs text-[#9ca3af]">{description}</p>
          ) : null}
        </div>
      </td>
    </tr>
  );
}