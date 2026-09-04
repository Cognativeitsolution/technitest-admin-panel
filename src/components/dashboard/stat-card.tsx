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
  cardClassName?: string;
  trendClassName?: string;
};

export function StatCard({
  title,
  value,
  trend,
  icon: Icon,
  iconWrapClassName,
  iconClassName,
  cardClassName,
  trendClassName,
}: StatCardProps) {
  const isUp = trend.direction === "up";

  return (
    <article
      className={cn(
        "rounded-2xl border p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)] transition hover:brightness-[0.99]",
        cardClassName ?? "border-[#eef1f6] bg-white",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-bold text-[#111827] sm:text-lg">{title}</p>
          <p className="mt-2 text-[28px] font-extrabold tracking-tight text-[#111827]">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex size-11 items-center justify-center rounded-xl shadow-sm",
            iconWrapClassName,
          )}
        >
          <Icon className={cn("size-5", iconClassName)} />
        </div>
      </div>

      <div
        className={cn(
          "mt-4 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold",
          isUp ? "bg-[#fffbeb] text-[#b45309]" : "bg-[#fef2f2] text-[#dc2626]",
          trendClassName,
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
