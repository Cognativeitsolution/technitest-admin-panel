"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, ChevronDown } from "lucide-react";

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
  className?: string;
};

function filterTopScorers(scorers: TopScorerItem[], period: TopScorerPeriod) {
  if (period === "all") return scorers;

  const now = new Date();
  return scorers.filter((scorer) => {
    const issuedAt = new Date(scorer.issued_at);
    if (Number.isNaN(issuedAt.getTime())) return false;

    if (period === "this_month") {
      return (
        issuedAt.getMonth() === now.getMonth() &&
        issuedAt.getFullYear() === now.getFullYear()
      );
    }

    const start = new Date(now);
    const weekday = start.getDay() || 7;
    start.setDate(start.getDate() - (weekday - 1));
    start.setHours(0, 0, 0, 0);
    return issuedAt >= start;
  });
}

function levelFromScorer(scorer: TopScorerItem) {
  if (scorer.stars != null && scorer.stars > 0) {
    return Math.min(5, Math.max(1, Math.round(scorer.stars)));
  }
  return Math.min(5, Math.max(1, Math.round((scorer.percentage || 0) / 20)));
}

function levelBadgeClass(level: number) {
  if (level === 3) return "bg-[#fef3c7] text-[#b45309]";
  if (level >= 4) return "bg-[#dcfce7] text-[#15803d]";
  return "bg-[#dbeafe] text-[#2563eb]";
}

function formatIssuedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
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
  const currentPeriodLabel =
    PERIOD_OPTIONS.find((p) => p.id === period)?.label || "All Time";

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
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-[13px] font-medium text-[#64748b] transition hover:bg-[#f8fafc] hover:text-[#1e293b]"
      >
        <span>{currentPeriodLabel}</span>
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform",
            dropdownOpen && "rotate-180",
          )}
        />
      </button>

      {dropdownOpen ? (
        <div className="absolute right-0 top-[calc(100%+4px)] z-30 w-36 overflow-hidden rounded-lg border border-[#e5eaf2] bg-white py-1 shadow-lg">
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
                  isSelected
                    ? "bg-[#eff6ff] text-[#2563eb]"
                    : "text-[#334155] hover:bg-[#f8fafc]",
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
  const filteredScorers = filterTopScorers(scorers, period).slice(0, 10);

  return (
    <section
      className={cn(
        "flex h-[420px] min-w-0 flex-col rounded-[10px] border border-[#e5eaf2] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]",
        className,
      )}
    >
      <div className="mb-4 flex shrink-0 flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-[#1e293b]">Top Scorers</h2>
          <p className="mt-0.5 text-[12px] font-medium text-[#64748b]">
            Highest certificate scores across quizzes
          </p>
        </div>
        <PeriodDropdown period={period} onChange={setPeriod} />
      </div>

      {filteredScorers.length === 0 ? (
        <div className="flex min-h-0 flex-1 items-center justify-center rounded-xl border border-dashed border-[#e5e7eb] bg-[#fafbfc] text-sm font-medium text-[#64748b]">
          No data found
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto pr-1">
          <table className="w-full table-fixed border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="border-b border-[#eef2f7]">
                <th className="w-10 pb-3 pr-2 text-[12px] font-semibold text-[#64748b]">#</th>
                <th className="w-[18%] pb-3 pr-2 text-[12px] font-semibold text-[#64748b]">User</th>
                <th className="w-[20%] pb-3 pr-2 text-[12px] font-semibold text-[#64748b]">Email</th>
                <th className="w-[22%] pb-3 pr-2 text-[12px] font-semibold text-[#64748b]">Quiz</th>
                <th className="w-[10%] pb-3 pr-2 text-[12px] font-semibold text-[#64748b]">Points</th>
                <th className="w-[12%] pb-3 pr-2 text-[12px] font-semibold text-[#64748b]">%</th>
                <th className="w-[12%] pb-3 pr-2 text-[12px] font-semibold text-[#64748b]">Issued</th>
                <th className="w-[12%] pb-3 text-[12px] font-semibold text-[#64748b]">Level</th>
              </tr>
            </thead>
            <tbody>
              {filteredScorers.map((scorer, index) => {
                const level = levelFromScorer(scorer);
                return (
                  <tr
                    key={`${scorer.user_id}-${scorer.certificate_id}`}
                    className="border-b border-[#eef2f7] last:border-0"
                  >
                    <td className="py-3 pr-2 align-middle text-[14px] font-bold text-[#1e293b]">
                      {index + 1}
                    </td>
                    <td className="py-3 pr-2 align-middle">
                      <div className="flex min-w-0 items-center gap-2">
                        {scorer.avatar_url ? (
                          <Image
                            src={scorer.avatar_url}
                            alt={scorer.username}
                            width={28}
                            height={28}
                            className="size-7 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#1e3a5f] text-[11px] font-bold text-white">
                            {scorer.username?.charAt(0).toUpperCase() || "U"}
                          </span>
                        )}
                        <span className="truncate text-[13px] font-semibold text-[#1e293b]">
                          {scorer.username}
                        </span>
                      </div>
                    </td>
                    <td className="truncate py-3 pr-2 align-middle text-[12px] font-medium text-[#475569]">
                      {scorer.email || "—"}
                    </td>
                    <td
                      className="truncate py-3 pr-2 align-middle text-[13px] font-semibold text-[#1e293b]"
                      title={scorer.quiz_name}
                    >
                      {scorer.quiz_name}
                    </td>
                    <td className="py-3 pr-2 align-middle text-[13px] font-semibold text-[#1e293b]">
                      {Number(scorer.score ?? 0).toLocaleString()}
                    </td>
                    <td className="py-3 pr-2 align-middle text-[13px] font-semibold text-[#1e293b]">
                      {Math.round(scorer.percentage).toLocaleString()}%
                    </td>
                    <td className="truncate py-3 pr-2 align-middle text-[12px] font-medium text-[#475569]">
                      {formatIssuedAt(scorer.issued_at)}
                    </td>
                    <td className="py-3 align-middle">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold",
                          levelBadgeClass(level),
                        )}
                      >
                        Level {level}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
