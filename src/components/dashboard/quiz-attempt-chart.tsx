"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { QuizTrendItem } from "@/services/dashboard.service";

interface QuizAttemptChartProps {
  data?: QuizTrendItem[];
}

export function QuizAttemptChart({ data }: QuizAttemptChartProps) {
  const defaultData = [
    { date: "Mon", count: 42 },
    { date: "Tue", count: 68 },
    { date: "Wed", count: 55 },
    { date: "Thu", count: 88 },
    { date: "Fri", count: 72 },
    { date: "Sat", count: 48 },
    { date: "Sun", count: 35 },
  ];

  const chartData = (data && data.length > 0
    ? data.map((item) => ({
        date: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        count: item.count,
      }))
    : defaultData);
  const hasData = (data?.length ?? 0) > 0;

  return (
    <section className="rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <h2 className="mb-5 text-lg font-bold text-[#111827]">
        Quiz Attempt Trends
      </h2>

      {!hasData ? (
        <div className="flex h-[280px] items-center justify-center rounded-xl border border-dashed border-[#e5e7eb] bg-[#fafbfc] text-sm font-medium text-[#6b7280]">
          No data found
        </div>
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="#eef2f7" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "rgba(59,130,246,0.08)" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                }}
              />
              <Bar
                dataKey="count"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
                barSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
