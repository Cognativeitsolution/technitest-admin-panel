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
import { CalendarDays, Check, ChevronDown } from "lucide-react";

import { USER_GROWTH_DATASETS } from "@/lib/dashboard-data";
import { UserGrowthPeriod, UserGrowthSegment } from "@/types/dashboard.types";
import { cn } from "@/lib/utils";

const PERIOD_OPTIONS: { id: UserGrowthPeriod; label: string }[] = [
  { id: "30d", label: "Last 30 Days" },
  { id: "3m", label: "Last 3 Months" },
  { id: "6m", label: "Last 6 Months" },
  { id: "this_year", label: "This Year (Quarterly)" },
  { id: "all", label: "All 12 Months" },
];

export function UserGrowthChart() {
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

  const rawData = USER_GROWTH_DATASETS[period] || USER_GROWTH_DATASETS.all;

  const currentPeriodLabel = PERIOD_OPTIONS.find((p) => p.id === period)?.label || "Select Period";

  const totals = useMemo(() => {
    return rawData.reduce(
      (acc, curr) => ({
        students: acc.students + curr.students,
        professionals: acc.professionals + curr.professionals,
        total: acc.total + curr.total,
      }),
      { students: 0, professionals: 0, total: 0 }
    );
  }, [rawData]);

  return (
    <section className="rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">User Growth</h2>
            <p className="text-xs text-[#6b7280]">
              Total: <span className="font-bold text-[#111827]">{totals.total.toLocaleString()}</span> users acquired
            </p>
          </div>

          {/* Interactive Segment Filters */}
          <div className="flex items-center gap-2 rounded-lg bg-[#f8fafc] p-1 border border-[#eef1f6]">
            <button
              type="button"
              onClick={() => setSegment("all")}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-semibold transition",
                segment === "all"
                  ? "bg-white text-[#111827] shadow-xs"
                  : "text-[#6b7280] hover:text-[#111827]"
              )}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSegment("students")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition",
                segment === "students"
                  ? "bg-[#22c55e] text-white shadow-xs"
                  : "text-[#6b7280] hover:text-[#111827]"
              )}
            >
              <span className={cn("size-2 rounded-full", segment === "students" ? "bg-white" : "bg-[#22c55e]")} />
              Students ({totals.students.toLocaleString()})
            </button>
            <button
              type="button"
              onClick={() => setSegment("professionals")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition",
                segment === "professionals"
                  ? "bg-[#8b5cf6] text-white shadow-xs"
                  : "text-[#6b7280] hover:text-[#111827]"
              )}
            >
              <span className={cn("size-2 rounded-full", segment === "professionals" ? "bg-white" : "bg-[#8b5cf6]")} />
              Professionals ({totals.professionals.toLocaleString()})
            </button>
          </div>
        </div>

        {/* Interactive Period Filter Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 text-sm font-medium text-[#374151] shadow-xs transition hover:bg-[#f9fafb]"
          >
            <CalendarDays className="size-3.5 text-[#6b7280]" />
            <span>{currentPeriodLabel}</span>
            <ChevronDown className={cn("size-3.5 text-[#9ca3af] transition-transform", dropdownOpen && "rotate-180")} />
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
                        : "text-[#374151] hover:bg-[#f8fafc]"
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
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rawData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
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
    </section>
  );
}
