"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CalendarDays, Check, ChevronDown, TrendingUp } from "lucide-react";

import type { UserGrowthItem } from "@/services/dashboard.service";
import { UserGrowthPeriod, UserGrowthSegment } from "@/types/dashboard.types";
import { DashboardPanelHeader } from "@/components/dashboard/dashboard-panel-header";
import {
  dashboardCardClass,
  dashboardChartShellClass,
  dashboardEmptyStateClass,
} from "@/components/dashboard/dashboard-styles";
import { cn } from "@/lib/utils";

const PERIOD_OPTIONS: { id: UserGrowthPeriod; label: string }[] = [
  { id: "30d", label: "Last 30 Days" },
  { id: "3m", label: "Last 3 Months" },
  { id: "6m", label: "Last 6 Months" },
  { id: "this_year", label: "This Year (Quarterly)" },
  { id: "all", label: "All 12 Months" },
];

interface UserGrowthChartProps {
  data?: UserGrowthItem[];
}

function filterGrowthByPeriod(data: UserGrowthItem[], period: UserGrowthPeriod) {
  if (period === "all") return data;
  if (period === "this_year") {
    const currentYear = new Date().getFullYear();
    return data.filter((item) => item.year === currentYear);
  }

  const months = period === "30d" ? 1 : period === "3m" ? 3 : 6;
  return data.slice(-months);
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  const [period, setPeriod] = useState<UserGrowthPeriod>("all");
  const [segment, setSegment] = useState<UserGrowthSegment>("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const sourceData = data ?? [];
  const hasData = sourceData.length > 0;

  const chartData = useMemo(() => {
    return filterGrowthByPeriod(sourceData, period).map((item) => {
      const students = Number(item.students) || 0;
      const professionals = Number(item.professionals) || 0;
      return {
        month: item.month_name,
        students,
        professionals,
        total: students + professionals,
      };
    });
  }, [sourceData, period]);

  const currentPeriodLabel = PERIOD_OPTIONS.find((p) => p.id === period)?.label || "Select Period";

  const totals = useMemo(() => {
    return chartData.reduce(
      (acc, curr) => ({
        students: acc.students + curr.students,
        professionals: acc.professionals + curr.professionals,
        total: acc.total + curr.total,
      }),
      { students: 0, professionals: 0, total: 0 }
    );
  }, [chartData]);

  return (
    <section className={dashboardCardClass}>
      <DashboardPanelHeader
        icon={TrendingUp}
        iconWrapClassName="bg-[#dcfce7]"
        iconClassName="text-[#16a34a]"
        title="User Growth"
        subtitle="Students and professionals over time"
        badge={hasData ? { label: "Total", value: totals.total } : undefined}
        actions={
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 text-xs font-semibold text-[#374151] shadow-xs transition hover:bg-[#f9fafb]"
            >
              <CalendarDays className="size-3.5 text-[#6b7280]" />
              <span>{currentPeriodLabel}</span>
              <ChevronDown
                className={cn(
                  "size-3.5 text-[#9ca3af] transition-transform",
                  dropdownOpen && "rotate-180",
                )}
              />
            </button>

            {dropdownOpen ? (
              <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-52 overflow-hidden rounded-xl border border-[#eef1f6] bg-white py-1 shadow-lg">
                {PERIOD_OPTIONS.map((opt) => {
                  const isSelected = period === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setPeriod(opt.id);
                        setDropdownOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between px-3.5 py-2 text-left text-xs font-medium transition",
                        isSelected
                          ? "bg-[#eff6ff] text-[#2563eb]"
                          : "text-[#374151] hover:bg-[#f8fafc]",
                      )}
                    >
                      <span>{opt.label}</span>
                      {isSelected ? <Check className="size-3.5" /> : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-[#eef1f6] bg-[#f8fafc] p-1">
        <button
          type="button"
          onClick={() => setSegment("all")}
          className={cn(
            "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition",
            segment === "all"
              ? "bg-white text-[#111827] shadow-xs"
              : "text-[#6b7280] hover:text-[#111827]",
          )}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setSegment("students")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition",
            segment === "students"
              ? "bg-[#22c55e] text-white shadow-xs"
              : "text-[#6b7280] hover:text-[#111827]",
          )}
        >
          <span
            className={cn(
              "size-2 rounded-full",
              segment === "students" ? "bg-white" : "bg-[#22c55e]",
            )}
          />
          Students ({totals.students.toLocaleString()})
        </button>
        <button
          type="button"
          onClick={() => setSegment("professionals")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition",
            segment === "professionals"
              ? "bg-[#8b5cf6] text-white shadow-xs"
              : "text-[#6b7280] hover:text-[#111827]",
          )}
        >
          <span
            className={cn(
              "size-2 rounded-full",
              segment === "professionals" ? "bg-white" : "bg-[#8b5cf6]",
            )}
          />
          Professionals ({totals.professionals.toLocaleString()})
        </button>
      </div>

      {!hasData || chartData.length === 0 ? (
        <div className={cn(dashboardEmptyStateClass, "h-[280px]")}>No data found</div>
      ) : (
        <div className={cn(dashboardChartShellClass, "h-[280px]")}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid stroke="#eef2f7" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                domain={[0, "auto"]}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                }}
              />
              {(segment === "all" || segment === "students") && (
                <Line
                  name="Students"
                  type="monotone"
                  dataKey="students"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ r: 3, fill: "#22c55e" }}
                  activeDot={{ r: 6 }}
                />
              )}
              {(segment === "all" || segment === "professionals") && (
                <Line
                  name="Professionals"
                  type="monotone"
                  dataKey="professionals"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 3, fill: "#8b5cf6" }}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
