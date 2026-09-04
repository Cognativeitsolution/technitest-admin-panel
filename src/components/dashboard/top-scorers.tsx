"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, ChevronDown, Star, Trophy } from "lucide-react";

import type { TopScorerItem } from "@/services/dashboard.service";
import { TopScorerPeriod } from "@/types/dashboard.types";
import { DashboardPanelHeader } from "@/components/dashboard/dashboard-panel-header";
import {
  dashboardCardClass,
  dashboardEmptyStateClass,
  dashboardScrollListClass,
  dashboardScrollListHeightClass,
  getRankTheme,
  RANK_COLORS,
} from "@/components/dashboard/dashboard-styles";
import { cn } from "@/lib/utils";

const PERIOD_OPTIONS: { id: TopScorerPeriod; label: string }[] = [
  { id: "all", label: "All Time" },
  { id: "this_month", label: "This Month" },
  { id: "this_week", label: "This Week" },
];

type TopScorersProps = {
  scorers?: TopScorerItem[];
  className?: string;
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

function PeriodDropdown({
  period,
  onChange,
}: {
  period: TopScorerPeriod;
  onChange: (period: TopScorerPeriod) => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentPeriodLabel = PERIOD_OPTIONS.find((p) => p.id === period)?.label || "All Time";

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

  return (
    <div className="relative w-full sm:w-auto" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-white px-3 text-xs font-semibold text-[#374151] shadow-xs transition hover:bg-[#f9fafb] sm:w-auto sm:justify-start"
      >
        <span>{currentPeriodLabel}</span>
        <ChevronDown
          className={cn("size-3.5 text-[#9ca3af] transition-transform", dropdownOpen && "rotate-180")}
        />
      </button>

      {dropdownOpen ? (
        <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-full overflow-hidden rounded-xl border border-[#eef1f6] bg-white py-1 shadow-lg sm:w-36">
          {PERIOD_OPTIONS.map((opt) => {
            const isSelected = period === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onChange(opt.id);
                  setDropdownOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between px-3 py-2 text-left text-xs font-medium transition",
                  isSelected ? "bg-[#eff6ff] text-[#2563eb]" : "text-[#374151] hover:bg-[#f8fafc]",
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
  );
}

export function TopScorers({ scorers = [], className }: TopScorersProps) {
  const [period, setPeriod] = useState<TopScorerPeriod>("all");
  const filteredScorers = filterTopScorers(scorers, period);
  const maxScore = Math.max(...filteredScorers.map((s) => s.percentage), 1);

  return (
    <section className={cn("flex h-full min-w-0 flex-col", dashboardCardClass, className)}>
      <DashboardPanelHeader
        icon={Trophy}
        iconWrapClassName="bg-[#fef3c7]"
        iconClassName="text-[#d97706]"
        title="Top Scorers"
        subtitle="Highest quiz scores"
        badge={
          filteredScorers.length > 0
            ? { label: "Scorers", value: filteredScorers.length }
            : undefined
        }
        wideBadge
        actions={<PeriodDropdown period={period} onChange={setPeriod} />}
      />

      {filteredScorers.length === 0 ? (
        <div className={cn(dashboardEmptyStateClass, dashboardScrollListHeightClass)}>
          No data found
        </div>
      ) : (
        <ul className={dashboardScrollListClass}>
          {filteredScorers.map((scorer, index) => {
            const theme = getRankTheme(index);
            const starCount = scorer.stars ?? Math.max(1, Math.min(5, Math.round(scorer.percentage / 20)));
            const progress = (scorer.percentage / maxScore) * 100;
            const scoreLabel = `${Math.round(scorer.percentage)}%`;

            return (
              <li
                key={`${scorer.user_id}-${scorer.certificate_id}`}
                className={cn(
                  "shrink-0 overflow-hidden rounded-xl border px-2.5 py-2.5 sm:px-3",
                  theme.card,
                )}
              >
                <div className="flex items-start gap-2 sm:items-center sm:gap-3">
                  <span
                    className="flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white shadow-sm sm:size-8 sm:text-xs"
                    style={{ backgroundColor: RANK_COLORS[index] ?? RANK_COLORS[3] }}
                  >
                    {index + 1}
                  </span>

                  <div className="relative shrink-0">
                    {scorer.avatar_url ? (
                      <Image
                        src={scorer.avatar_url}
                        alt={scorer.username}
                        width={40}
                        height={40}
                        className="size-9 rounded-lg border border-white/80 object-cover shadow-sm sm:size-10"
                      />
                    ) : (
                      <div
                        className={cn(
                          "flex size-9 items-center justify-center rounded-lg text-sm font-bold shadow-sm sm:size-10",
                          theme.icon,
                        )}
                      >
                        {scorer.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-bold text-[#111827]">{scorer.username}</p>
                      <p className={cn("shrink-0 text-base font-extrabold leading-none sm:hidden", theme.accent)}>
                        {scoreLabel}
                      </p>
                    </div>

                    <span
                      className={cn(
                        "mt-1 block w-full truncate rounded-md px-2 py-0.5 text-[10px] font-semibold",
                        theme.pill,
                      )}
                    >
                      {scorer.quiz_name}
                    </span>

                    <div className="mt-1 flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star
                          key={`${scorer.user_id}-${starIndex}`}
                          className={cn(
                            "size-3 shrink-0",
                            starIndex < starCount
                              ? "fill-[#fbbf24] text-[#fbbf24]"
                              : "text-[#d1d5db]",
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="hidden shrink-0 text-right sm:block">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-[#9ca3af]">
                      Score
                    </p>
                    <p className={cn("text-lg font-extrabold leading-none", theme.accent)}>
                      {scoreLabel}
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-white/70">
                  <div
                    className={cn("h-full max-w-full rounded-full transition-all duration-500", theme.bar)}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
