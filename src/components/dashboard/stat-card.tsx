import { type LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string;
  trend: {
    value: string;
    direction: "up" | "down";
    label: string;
  };
  icon: LucideIcon;
  iconWrapClassName: string;
  iconClassName: string;
};

export function StatCard({
  title,
  value,
  trend,
  icon: Icon,
  iconWrapClassName,
  iconClassName,
}: StatCardProps) {
  const isUp = trend.direction === "up";

  return (
    <article className="rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#6b7280]">{title}</p>
          <p className="mt-2 text-[28px] font-bold tracking-tight text-[#111827]">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-2xl",
            iconWrapClassName
          )}
        >
          <Icon className={cn("size-6", iconClassName)} />
        </div>
      </div>

      <div
        className={cn(
          "mt-4 flex items-center gap-1.5 text-[13px] font-medium",
          isUp ? "text-[#f59e0b]" : "text-[#ef4444]"
        )}
      >
        {isUp ? (
          <TrendingUp className="size-3.5" />
        ) : (
          <TrendingDown className="size-3.5" />
        )}
        <span>
          {trend.value} {isUp ? "Up" : "Down"} {trend.label}
        </span>
      </div>
    </article>
  );
}
