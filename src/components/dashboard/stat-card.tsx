import { type LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

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
  iconClassName?: string;
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
        "rounded-[10px] border border-[#e5eaf2] bg-white p-5",
        cardClassName,
      )}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-full",
            iconWrapClassName,
          )}
        >
          <Icon className={cn("size-5 text-white", iconClassName)} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold leading-5 text-[#1e293b]">
            {title}
          </p>
          <p className="mt-1 text-[26px] font-extrabold leading-8 tracking-tight text-[#0f172a]">
            {value}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[13px]">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-semibold",
                isUp ? "text-[#10b981]" : "text-[#ef4444]",
                trendClassName,
              )}
            >
              {isUp ? (
                <ArrowUpRight className="size-3.5" strokeWidth={2.5} />
              ) : (
                <ArrowDownRight className="size-3.5" strokeWidth={2.5} />
              )}
              {trend.value}
            </span>
            <span className="font-medium text-[#64748b]">{trend.label}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
