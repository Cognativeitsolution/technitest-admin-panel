import { type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type UserMetricCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  iconWrapClassName: string;
  iconClassName: string;
};

export function UserMetricCard({
  label,
  value,
  icon: Icon,
  iconWrapClassName,
  iconClassName,
}: UserMetricCardProps) {
  return (
    <article className="flex items-center justify-between gap-3 rounded-2xl border border-[#eef1f6] bg-white px-4 py-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div>
        <p className="text-sm font-medium text-[#6b7280]">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-[#111827]">
          {value}
        </p>
      </div>
      <div
        className={cn(
          "flex size-11 items-center justify-center rounded-xl",
          iconWrapClassName
        )}
      >
        <Icon className={cn("size-5", iconClassName)} />
      </div>
    </article>
  );
}
