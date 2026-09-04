"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Calendar, Check, ChevronDown, LineChart as LineChartIcon } from "lucide-react";

import type { QuizTrendItem } from "@/services/dashboard.service";
import { QuizAttemptPeriod } from "@/types/dashboard.types";
import { DashboardPanelHeader } from "@/components/dashboard/dashboard-panel-header";
import {
  dashboardCardClass,
  dashboardChartShellClass,
  dashboardEmptyStateClass,
} from "@/components/dashboard/dashboard-styles";
import { cn } from "@/lib/utils";

type ChartPeriod = QuizAttemptPeriod | "all";

const PERIOD_OPTIONS: { id: ChartPeriod; label: string }[] = [
  { id: "all", label: "All" },
  { id: "this_week", label: "This Week" },
  { id: "last_week", label: "Last Week" },
  { id: "this_month", label: "This Month" },
  { id: "last_30d", label: "Last 30 Days" },
];

interface QuizAttemptChartProps {
  data?: QuizTrendItem[];
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getPeriodBounds(period: Exclude<ChartPeriod, "all">) {
  const now = startOfDay(new Date());
  const start = new Date(now);
  const end = new Date(now);

  if (period === "this_week") {
    const weekday = now.getDay() || 7;
    start.setDate(now.getDate() - (weekday - 1));
  } else if (period === "last_week") {
    const weekday = now.getDay() || 7;
    end.setDate(now.getDate() - (weekday - 1) - 1);
    start.setDate(end.getDate() - 6);
  } else if (period === "this_month") {
    start.setDate(1);
  } else {
    start.setDate(now.getDate() - 29);
  }

  return { start, end };
}

export function QuizAttemptChart({ data }: QuizAttemptChartProps) {
  const [period, setPeriod] = useState<ChartPeriod>("all");
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
    const scopedData =
      period === "all"
        ? sourceData
        : sourceData.filter((item) => {
            const { start, end } = getPeriodBounds(period);
            const date = startOfDay(new Date(item.date));
            return date >= start && date <= end;
          });

    return scopedData.map((item) => ({
      day: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      attempts: item.count,
    }));
  }, [sourceData, period]);

  const currentPeriodLabel = PERIOD_OPTIONS.find((p) => p.id === period)?.label || "All";

  const totalAttempts = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.attempts, 0);
  }, [chartData]);

  return (
    <section className={cn("flex h-full flex-col", dashboardCardClass)}>
      <DashboardPanelHeader
        icon={LineChartIcon}
        iconWrapClassName="bg-[#dbeafe]"
        iconClassName="text-[#2563eb]"
        title="Quiz Attempt Trends"
        subtitle="Daily quiz participation"
        badge={hasData ? { label: "Total", value: totalAttempts } : undefined}
        actions={
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 text-xs font-semibold text-[#374151] shadow-xs transition hover:bg-[#f9fafb]"
            >
              <Calendar className="size-3.5 text-[#6b7280]" />
              <span>{currentPeriodLabel}</span>
              <ChevronDown
                className={cn(
                  "size-3.5 text-[#9ca3af] transition-transform",
                  dropdownOpen && "rotate-180",
                )}
              />
            </button>

            {dropdownOpen ? (
              <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-44 overflow-hidden rounded-xl border border-[#eef1f6] bg-white py-1 shadow-lg">
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

      {!hasData || chartData.length === 0 ? (
        <div className={cn(dashboardEmptyStateClass, "min-h-[280px] flex-1")}>No data found</div>
      ) : (
        <div className={cn(dashboardChartShellClass, "min-h-[280px] flex-1")}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
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
                name="Attempts"
                dataKey="attempts"
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
