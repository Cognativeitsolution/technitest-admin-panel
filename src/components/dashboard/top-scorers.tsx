"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, ChevronDown, Star, Trophy } from "lucide-react";

import { filterTopScorers, TOP_SCORERS } from "@/lib/dashboard-data";
import { TopScorerPeriod } from "@/types/dashboard.types";
import { cn } from "@/lib/utils";

const PERIOD_OPTIONS: { id: TopScorerPeriod; label: string }[] = [
  { id: "all", label: "All Time" },
  { id: "this_month", label: "This Month" },
  { id: "this_week", label: "This Week" },
];

export function TopScorers() {
  const [period, setPeriod] = useState<TopScorerPeriod>("all");
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

  const filteredScorers = filterTopScorers(TOP_SCORERS, period);
  const currentPeriodLabel = PERIOD_OPTIONS.find((p) => p.id === period)?.label || "All Time";

  return (
    <section className="rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Trophy className="size-5 text-[#f59e0b]" />
          <h2 className="text-lg font-bold text-[#111827]">Top Scorers</h2>
        </div>

        {/* Timeframe Filter Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-white px-2.5 text-xs font-medium text-[#374151] shadow-xs transition hover:bg-[#f9fafb]"
          >
            <span>{currentPeriodLabel}</span>
            <ChevronDown className={cn("size-3.5 text-[#9ca3af] transition-transform", dropdownOpen && "rotate-180")} />
          </button>

          {dropdownOpen ? (
            <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-36 overflow-hidden rounded-xl border border-[#eef1f6] bg-white py-1 shadow-lg">
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
                      "flex w-full items-center justify-between px-3 py-1.5 text-left text-xs font-medium transition",
                      isSelected
                        ? "bg-[#eff6ff] text-[#2563eb]"
                        : "text-[#374151] hover:bg-[#f8fafc]"
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected ? <Check className="size-3" /> : null}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      <ul className="space-y-3">
        {filteredScorers.map((scorer, index) => (
          <li
            key={scorer.name}
            className="flex items-center gap-3 rounded-xl border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5 transition hover:bg-[#f3f6fa]"
          >
            <div className="relative">
              <Image
                src={scorer.avatar}
                alt={scorer.name}
                width={40}
                height={40}
                className="size-10 rounded-full object-cover"
              />
              <span className="absolute -bottom-1 -right-1 flex size-4.5 items-center justify-center rounded-full bg-[#111827] text-[10px] font-bold text-white">
                {index + 1}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#111827]">
                {scorer.name}
              </p>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-[#6b7280]">
                <span>{scorer.quizzesTaken} quizzes</span>
                <span>•</span>
                <div className="flex items-center gap-0.5">
                  <Star className="size-3 fill-[#fbbf24] text-[#fbbf24]" />
                  <span className="font-medium text-[#111827]">5.0</span>
                </div>
              </div>
            </div>
            <span className="rounded-lg bg-[#dbeafe] px-2 py-1 text-xs font-bold text-[#1d4ed8]">
              {scorer.score}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
