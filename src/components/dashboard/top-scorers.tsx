"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, ChevronDown, Star, Trophy } from "lucide-react";

import type { TopScorerItem } from "@/services/dashboard.service";
import { TopScorerPeriod } from "@/types/dashboard.types";
import { cn } from "@/lib/utils";

const PERIOD_OPTIONS: { id: TopScorerPeriod; label: string }[] = [
  { id: "all", label: "All Time" },
  { id: "this_month", label: "This Month" },
  { id: "this_week", label: "This Week" },
];

type TopScorersProps = {
  scorers?: TopScorerItem[];
};

function filterTopScorers(scorers: TopScorerItem[], period: TopScorerPeriod) {
  if (period === "all") return scorers;

  const now = new Date();
  return scorers.filter((scorer) => {
    const issuedAt = new Date(scorer.issued_at);
    if (Number.isNaN(issuedAt.getTime())) return false;

    if (period === "this_month") {
      return issuedAt.getMonth() === now.getMonth() && issuedAt.getFullYear() === now.getFullYear();
    }

    const start = new Date(now);
    const weekday = start.getDay() || 7;
    start.setDate(start.getDate() - (weekday - 1));
    start.setHours(0, 0, 0, 0);
    return issuedAt >= start;
  });
}

export function TopScorers({ scorers = [] }: TopScorersProps) {
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

  const filteredScorers = filterTopScorers(scorers, period);
  const currentPeriodLabel = PERIOD_OPTIONS.find((p) => p.id === period)?.label || "All Time";

  return (
    <section className="rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Trophy className="size-5 text-[#f59e0b]" />
          <h2 className="text-lg font-bold text-[#111827]">Top Scorers</h2>
        </div>

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

      {filteredScorers.length === 0 ? (
        <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-[#e5e7eb] bg-[#fafbfc] text-sm font-medium text-[#6b7280]">
          No data found
        </div>
      ) : (
        <ul className="space-y-3">
          {filteredScorers.map((scorer, index) => {
            const starCount = scorer.stars ?? Math.max(1, Math.min(5, Math.round(scorer.percentage / 20)));

            return (
              <li
                key={`${scorer.user_id}-${scorer.certificate_id}`}
                className="flex items-center gap-3 rounded-xl border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5 transition hover:bg-[#f3f6fa]"
              >
                <div className="relative">
                  {scorer.avatar_url ? (
                    <Image
                      src={scorer.avatar_url}
                      alt={scorer.username}
                      width={40}
                      height={40}
                      className="size-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-500">
                      {scorer.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 flex size-4.5 items-center justify-center rounded-full bg-[#111827] text-[10px] font-bold text-white">
                    {index + 1}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#111827]">
                    {scorer.username}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-[#6b7280]">
                    <span className="truncate">{scorer.quiz_name}</span>
                    <span>•</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star
                          key={`${scorer.user_id}-${starIndex}`}
                          className={cn(
                            "size-3",
                            starIndex < starCount ? "fill-[#fbbf24] text-[#fbbf24]" : "text-[#d1d5db]"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="rounded-lg bg-[#dbeafe] px-2 py-1 text-xs font-bold text-[#1d4ed8]">
                  {Math.round(scorer.percentage)}%
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
