"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { UserGrowthItem } from "@/services/dashboard.service";
import { cn } from "@/lib/utils";

type UserGrowthChartProps = {
  data?: UserGrowthItem[];
  className?: string;
};

const STUDENTS_COLOR = "#38bdf8";
const PROFESSIONALS_COLOR = "#14b8a6";
const TOTAL_COLOR = "#8b5cf6";

function shortMonth(name: string) {
  if (name.length <= 10) return name;
  return `${name.slice(0, 3)}`;
}

export function UserGrowthChart({ data = [], className }: UserGrowthChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => {
      const students = Number(item.students) || 0;
      const professionals = Number(item.professionals) || 0;
      return {
        name: shortMonth(item.month_name),
        fullName: `${item.month_name} ${item.year}`,
        students,
        professionals,
        total: students + professionals,
      };
    });
  }, [data]);

  return (
    <section
      className={cn(
        "flex h-full min-w-0 flex-col rounded-[10px] border border-[#e5eaf2] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]",
        className,
      )}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[18px] font-bold text-[#1e293b]">User Growth</h2>
        <div className="flex flex-wrap items-center gap-4 text-[12px] font-medium text-[#64748b]">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: STUDENTS_COLOR }} />
            Students
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: PROFESSIONALS_COLOR }}
            />
            Professionals
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: TOTAL_COLOR }} />
            Total
          </span>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="flex min-h-70 flex-1 items-center justify-center rounded-xl border border-dashed border-[#e5e7eb] bg-[#fafbfc] text-sm font-medium text-[#64748b]">
          No data found
        </div>
      ) : (
        <div className="min-h-70 w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 8, left: -8, bottom: 4 }}
              barCategoryGap="26%"
              barGap={3}
            >
              <CartesianGrid stroke="#eef2f7" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(148,163,184,0.08)" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                }}
                labelFormatter={(_, payload) =>
                  String(payload?.[0]?.payload?.fullName ?? "")
                }
                formatter={(value, name) => {
                  const label =
                    name === "students"
                      ? "Students"
                      : name === "professionals"
                        ? "Professionals"
                        : "Total";
                  return [value, label];
                }}
              />
              <Bar
                dataKey="students"
                fill={STUDENTS_COLOR}
                radius={[10, 10, 0, 0]}
                barSize={16}
                background={{ fill: "#e0f2fe" }}
              />
              <Bar
                dataKey="professionals"
                fill={PROFESSIONALS_COLOR}
                radius={[10, 10, 0, 0]}
                barSize={16}
                background={{ fill: "#ccfbf1" }}
              />
              <Bar
                dataKey="total"
                fill={TOTAL_COLOR}
                radius={[10, 10, 0, 0]}
                barSize={16}
                background={{ fill: "#ede9fe" }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
