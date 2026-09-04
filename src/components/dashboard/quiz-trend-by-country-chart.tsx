"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Globe2 } from "lucide-react";

import type { QuizTrendByCountryItem } from "@/services/dashboard.service";
import { cn } from "@/lib/utils";

const COUNTRY_COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#64748b",
];

type QuizTrendByCountryChartProps = {
  data?: QuizTrendByCountryItem[];
  className?: string;
};

function formatDayLabel(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function buildChartData(data: QuizTrendByCountryItem[]) {
  const dates = [...new Set(data.map((item) => item.date))].sort();
  const countries = [...new Set(data.map((item) => item.country))].sort();

  const rows = dates.map((date) => {
    const row: Record<string, string | number> = {
      day: formatDayLabel(date),
      date,
    };

    countries.forEach((country) => {
      row[country] =
        data.find((item) => item.date === date && item.country === country)
          ?.count ?? 0;
    });

    return row;
  });

  return { rows, countries };
}

export function QuizTrendByCountryChart({
  data,
  className,
}: QuizTrendByCountryChartProps) {
  const sourceData = data ?? [];
  const hasData = sourceData.length > 0;

  const { rows, countries } = useMemo(
    () => buildChartData(sourceData),
    [sourceData],
  );

  const totalAttempts = useMemo(() => {
    return sourceData.reduce((sum, item) => sum + item.count, 0);
  }, [sourceData]);

  const countryColors = useMemo(() => {
    return Object.fromEntries(
      countries.map((country, index) => [
        country,
        COUNTRY_COLORS[index % COUNTRY_COLORS.length],
      ]),
    ) as Record<string, string>;
  }, [countries]);

  return (
    <section
      className={cn(
        "flex h-full flex-col rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]",
        className,
      )}
    >
      <div className="mb-5 flex shrink-0 flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Globe2 className="size-5 text-[#2563eb]" />
          <div>
            <h2 className="text-lg font-bold text-[#111827]">
              Quiz Trends by Country
            </h2>
            <p className="text-xs text-[#6b7280]">
              Total:{" "}
              <span className="font-bold text-[#111827]">
                {totalAttempts.toLocaleString()}
              </span>{" "}
              attempts
            </p>
          </div>
        </div>
      </div>

      {!hasData || rows.length === 0 ? (
        <div className="flex min-h-[280px] flex-1 items-center justify-center rounded-xl border border-dashed border-[#e5e7eb] bg-[#fafbfc] text-sm font-medium text-[#6b7280]">
          No data found
        </div>
      ) : (
        <div className="min-h-[280px] w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="#eef2f7" vertical={false} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(59,130,246,0.08)" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                iconType="circle"
              />
              {countries.map((country) => (
                <Bar
                  key={country}
                  name={country}
                  dataKey={country}
                  stackId="country"
                  fill={countryColors[country]}
                  radius={[0, 0, 0, 0]}
                  barSize={28}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
