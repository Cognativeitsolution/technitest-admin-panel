"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import type { QuizTrendItem } from "@/services/dashboard.service";
import { dashboardCardClass, dashboardEmptyStateClass } from "@/components/dashboard/dashboard-styles";
import { cn } from "@/lib/utils";

type QuizAttemptChartProps = {
  data?: QuizTrendItem[];
  className?: string;
};

function percentColor(value: number) {
  if (value >= 75) return "text-[#16a34a]";
  if (value >= 60) return "text-[#ea580c]";
  return "text-[#dc2626]";
}

function formatDayLabel(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function buildDayRows(data: QuizTrendItem[]) {
  const sorted = [...data]
    .map((item) => ({
      date: item.date,
      count: Number(item.count) || 0,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  const total = data.reduce((sum, item) => sum + (Number(item.count) || 0), 0);
  const maxCount = sorted[0]?.count ?? 0;
  if (total <= 0 || maxCount <= 0) return { rows: [], total: 0, overall: 0 };

  const rows = sorted.slice(0, 5).map((row) => ({
    date: row.date,
    label: formatDayLabel(row.date),
    count: row.count,
    percent: Math.round((row.count / maxCount) * 100),
  }));

  const overall = Math.round(
    rows.reduce((sum, row) => sum + row.percent, 0) / Math.max(rows.length, 1),
  );

  return { rows, total, overall };
}

export function QuizAttemptChart({ data = [], className }: QuizAttemptChartProps) {
  const { rows, total, overall } = useMemo(() => buildDayRows(data), [data]);
  const donutData = useMemo(
    () => [
      { name: "filled", value: overall },
      { name: "rest", value: Math.max(0, 100 - overall) },
    ],
    [overall],
  );

  return (
    <section className={cn("flex h-full min-w-0 flex-col", dashboardCardClass, className)}>
      <h2 className="mb-4 text-[16px] font-bold text-[#1e293b]">Quiz Attempt Trends</h2>

      {rows.length === 0 ? (
        <div className={cn(dashboardEmptyStateClass, "min-h-56 flex-1")}>No data found</div>
      ) : (
        <div className="flex min-h-56 min-w-0 flex-1 items-center gap-4">
          <div className="relative h-44 w-44 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  innerRadius="72%"
                  outerRadius="94%"
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#e8eef5" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-[28px] font-bold leading-none text-[#1e3a5f]">{overall}%</p>
              <p className="mt-1 text-[11px] font-medium text-[#64748b]">Overall</p>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <ul className="divide-y divide-[#eef2f7]">
              {rows.map((row) => (
                <li
                  key={row.date}
                  className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0"
                >
                  <span className="min-w-0 truncate text-[13px] font-semibold text-[#1e293b]">
                    {row.label}
                  </span>
                  <span className="shrink-0 text-[12px] font-medium text-[#64748b]">
                    {row.count}
                    <span className={cn("ml-1.5 font-bold", percentColor(row.percent))}>
                      {row.percent}%
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[11px] font-medium text-[#94a3b8]">
              {total.toLocaleString()} total attempts
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
