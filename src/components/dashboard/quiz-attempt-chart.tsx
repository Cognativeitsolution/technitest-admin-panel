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
import { Calendar, Check, ChevronDown } from "lucide-react";

import { QUIZ_ATTEMPT_DATASETS } from "@/lib/dashboard-data";
import { QuizAttemptPeriod } from "@/types/dashboard.types";
import { cn } from "@/lib/utils";

const PERIOD_OPTIONS: { id: QuizAttemptPeriod; label: string }[] = [
  { id: "this_week", label: "This Week" },
  { id: "last_week", label: "Last Week" },
  { id: "this_month", label: "This Month" },
  { id: "last_30d", label: "Last 30 Days" },
];

export function QuizAttemptChart() {
  const [period, setPeriod] = useState<QuizAttemptPeriod>("this_week");
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

  const rawData = QUIZ_ATTEMPT_DATASETS[period] || QUIZ_ATTEMPT_DATASETS.this_week;
  const currentPeriodLabel = PERIOD_OPTIONS.find((p) => p.id === period)?.label || "This Week";

  const totalAttempts = useMemo(() => {
    return rawData.reduce((acc, curr) => acc + curr.attempts, 0);
  }, [rawData]);

  return (
    <section className="rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#111827]">
            Quiz Attempt Trends
          </h2>
          <p className="text-xs text-[#6b7280]">
            Total: <span className="font-bold text-[#111827]">{totalAttempts.toLocaleString()}</span> attempts
          </p>
        </div>

        {/* Timeframe Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 text-sm font-medium text-[#374151] shadow-xs transition hover:bg-[#f9fafb]"
          >
            <Calendar className="size-3.5 text-[#6b7280]" />
            <span>{currentPeriodLabel}</span>
            <ChevronDown className={cn("size-3.5 text-[#9ca3af] transition-transform", dropdownOpen && "rotate-180")} />
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
          <BarChart data={rawData} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
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
    </section>
  );
}
