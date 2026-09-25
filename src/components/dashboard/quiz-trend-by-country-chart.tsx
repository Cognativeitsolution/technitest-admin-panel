"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Globe2, MoreHorizontal } from "lucide-react";

import type { QuizTrendByCountryItem } from "@/services/dashboard.service";
import { dashboardCardClass, dashboardEmptyStateClass } from "@/components/dashboard/dashboard-styles";
import { cn } from "@/lib/utils";

type QuizTrendByCountryChartProps = {
  data?: QuizTrendByCountryItem[];
  className?: string;
};

const FLAG_BY_COUNTRY: Record<string, string> = {
  Pakistan: "🇵🇰",
  Canada: "🇨🇦",
  UAE: "🇦🇪",
  "United Arab Emirates": "🇦🇪",
  Germany: "🇩🇪",
  UK: "🇬🇧",
  "United Kingdom": "🇬🇧",
  Australia: "🇦🇺",
  USA: "🇺🇸",
  "United States": "🇺🇸",
  India: "🇮🇳",
  China: "🇨🇳",
  France: "🇫🇷",
  Saudi: "🇸🇦",
  "Saudi Arabia": "🇸🇦",
};

function percentColor(value: number) {
  if (value >= 75) return "text-[#16a34a]";
  if (value >= 60) return "text-[#ea580c]";
  return "text-[#dc2626]";
}

function aggregateCountries(data: QuizTrendByCountryItem[]) {
  const totals = new Map<string, number>();
  for (const item of data) {
    const key = item.country?.trim() || "Unknown";
    totals.set(key, (totals.get(key) ?? 0) + (Number(item.count) || 0));
  }

  const sorted = [...totals.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const total = sorted.reduce((sum, row) => sum + row.count, 0);
  const maxCount = sorted[0]?.count ?? 0;
  if (total <= 0 || maxCount <= 0) return { rows: [], total: 0, overall: 0 };

  const top = sorted.slice(0, 5);
  const rest = sorted.slice(5);
  const othersCount = rest.reduce((sum, row) => sum + row.count, 0);

  const toScore = (count: number) => Math.round((count / maxCount) * 100);

  const rows = [
    ...top.map((row) => ({
      name: row.name,
      count: row.count,
      percent: toScore(row.count),
      isOthers: false,
    })),
  ];

  if (othersCount > 0) {
    rows.push({
      name: "Others",
      count: othersCount,
      percent: toScore(othersCount),
      isOthers: true,
    });
  }

  const overall = Math.round(
    rows.reduce((sum, row) => sum + row.percent, 0) / Math.max(rows.length, 1),
  );

  return { rows, total, overall };
}

export function QuizTrendByCountryChart({
  data = [],
  className,
}: QuizTrendByCountryChartProps) {
  const { rows, total, overall } = useMemo(() => aggregateCountries(data), [data]);
  const donutData = useMemo(
    () => [
      { name: "filled", value: overall },
      { name: "rest", value: Math.max(0, 100 - overall) },
    ],
    [overall],
  );

  return (
    <section className={cn("flex h-full flex-col", dashboardCardClass, className)}>
      <h2 className="mb-4 text-[18px] font-bold text-[#1e293b]">Quiz Trends by Country</h2>

      {rows.length === 0 ? (
        <div className={cn(dashboardEmptyStateClass, "min-h-70 flex-1")}>No data found</div>
      ) : (
        <div className="flex min-h-70 flex-1 flex-col gap-5 lg:flex-row lg:items-center">
          <div className="relative mx-auto h-44 w-44 shrink-0 sm:h-48 sm:w-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  innerRadius="72%"
                  outerRadius="92%"
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                  paddingAngle={0}
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#e8eef5" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-[28px] font-bold leading-none text-[#1e3a5f] sm:text-[32px]">
                {overall}%
              </p>
              <p className="mt-1 max-w-24 text-[11px] font-medium leading-tight text-[#64748b]">
                Overall Readiness
              </p>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <ul className="divide-y divide-[#eef2f7]">
              {rows.map((row) => (
                <li
                  key={row.name}
                  className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f1f5f9] text-lg">
                    {row.isOthers ? (
                      <MoreHorizontal className="size-4 text-[#64748b]" />
                    ) : FLAG_BY_COUNTRY[row.name] ? (
                      <span aria-hidden>{FLAG_BY_COUNTRY[row.name]}</span>
                    ) : (
                      <Globe2 className="size-4 text-[#64748b]" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#1e293b]">
                    {row.name}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 text-sm font-bold tabular-nums",
                      percentColor(row.percent),
                    )}
                  >
                    {row.percent}%
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs font-medium text-[#94a3b8]">
              {total.toLocaleString()} total attempts
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
