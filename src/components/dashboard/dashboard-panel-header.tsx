import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type DashboardPanelHeaderProps = {
  icon: LucideIcon;
  iconWrapClassName: string;
  iconClassName: string;
  title: string;
  subtitle?: ReactNode;
  badge?: {
    label: string;
    value: string | number;
  };
  wideBadge?: boolean;
  actions?: ReactNode;
  className?: string;
};

export function DashboardPanelHeader({
  icon: Icon,
  iconWrapClassName,
  iconClassName,
  title,
  subtitle,
  badge,
  wideBadge = false,
  actions,
  className,
}: DashboardPanelHeaderProps) {
  return (
    <div
      className={cn(
        "mb-4 flex shrink-0 flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            iconWrapClassName,
          )}
        >
          <Icon className={cn("size-5", iconClassName)} />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-bold leading-tight text-[#111827]">{title}</h2>
          {subtitle ? (
            <p className="text-xs text-[#6b7280]">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center gap-2 sm:ml-auto sm:w-auto sm:justify-end">
        {badge ? (
          <div
            className={cn(
              "rounded-lg bg-[#f8fafc] py-1.5 text-right",
              wideBadge ? "min-w-[88px] px-4" : "px-2.5",
            )}
          >
            <p className="text-[10px] font-medium uppercase tracking-wide text-[#9ca3af]">
              {badge.label}
            </p>
            <p className="text-sm font-bold text-[#111827]">
              {typeof badge.value === "number" ? badge.value.toLocaleString() : badge.value}
            </p>
          </div>
        ) : null}
        {actions}
      </div>
    </div>
  );
}
