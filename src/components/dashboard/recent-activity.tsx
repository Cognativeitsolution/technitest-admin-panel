"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, ChevronDown } from "lucide-react";

import type { RecentActivityItem } from "@/services/dashboard.service";
import { ActivityFilter } from "@/types/dashboard.types";
import { cn } from "@/lib/utils";

const FILTER_OPTIONS: { id: ActivityFilter; label: string }[] = [
  { id: "all", label: "All Activities" },
  { id: "today", label: "Today" },
  { id: "7d", label: "Last 7 Days" },
  { id: "30d", label: "Last 30 Days" },
  { id: "quizzes", label: "Quiz Attempts" },
  { id: "certificates", label: "Certificates" },
  { id: "referrals", label: "Referrals" },
  { id: "reviews", label: "Reviews & Feedback" },
];

type ActivityCategory = "quizzes" | "certificates" | "referrals" | "reviews" | "other";

type RecentActivityProps = {
  activities?: RecentActivityItem[];
  className?: string;
};

function mapActivityCategory(type: string): ActivityCategory {
  const value = type.toLowerCase();
  if (value.includes("quiz")) return "quizzes";
  if (value.includes("certificate")) return "certificates";
  if (value.includes("refer") || value.includes("coin")) return "referrals";
  if (value.includes("review") || value.includes("feedback")) return "reviews";
  return "other";
}

function formatActivityTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function parseScorePercent(detail: string | null | undefined) {
  if (!detail) return null;
  const match = detail.match(/(-?\d+(?:\.\d+)?)\s*%/);
  if (!match) return null;
  return Number(match[1]);
}

function scoreBadgeClass(percent: number) {
  if (percent >= 80) return "bg-[#dcfce7] text-[#15803d]";
  if (percent >= 50) return "bg-[#fef3c7] text-[#b45309]";
  return "bg-[#fee2e2] text-[#dc2626]";
}

function isToday(value: string) {
  const date = new Date(value);
  const now = new Date();
  return date.toDateString() === now.toDateString();
}

function isWithinDays(value: string, days: number) {
  const date = new Date(value);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  cutoff.setHours(0, 0, 0, 0);
  return date >= cutoff;
}

function filterActivities(activities: RecentActivityItem[], filter: ActivityFilter) {
  return activities.filter((activity) => {
    const category = mapActivityCategory(activity.type);

    if (filter === "all") return true;
    if (filter === "today") return isToday(activity.created_at);
    if (filter === "7d") return isWithinDays(activity.created_at, 7);
    if (filter === "30d") return isWithinDays(activity.created_at, 30);
    return category === filter;
  });
}

export function RecentActivity({ activities = [], className }: RecentActivityProps) {
  const [filter, setFilter] = useState<ActivityFilter>("all");
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

  const filteredActivities = filterActivities(activities, filter).slice(0, 12);
  const currentFilterLabel =
    FILTER_OPTIONS.find((f) => f.id === filter)?.label || "All Activities";

  return (
    <section
      className={cn(
        "flex h-[420px] min-w-0 flex-col rounded-[10px] border border-[#e5eaf2] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]",
        className,
      )}
    >
      <div className="mb-4 flex shrink-0 flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-[#1e293b]">Recent User Activity</h2>
          <p className="mt-0.5 text-[12px] font-medium text-[#64748b]">
            Latest quiz attempts, certificates, and platform events
          </p>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-[13px] font-medium text-[#64748b] transition hover:bg-[#f8fafc] hover:text-[#1e293b]"
          >
            <span>{currentFilterLabel}</span>
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform",
                dropdownOpen && "rotate-180",
              )}
            />
          </button>

          {dropdownOpen ? (
            <div className="absolute right-0 top-[calc(100%+4px)] z-30 w-48 overflow-hidden rounded-lg border border-[#e5eaf2] bg-white py-1 shadow-lg">
              {FILTER_OPTIONS.map((opt) => {
                const isSelected = filter === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setFilter(opt.id);
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
      </div>

      {filteredActivities.length === 0 ? (
        <div className="flex min-h-0 flex-1 items-center justify-center rounded-xl border border-dashed border-[#e5e7eb] bg-[#fafbfc] text-sm font-medium text-[#64748b]">
          <div className="text-center">
            <p>No activities found for this filter.</p>
            {filter !== "all" ? (
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="mt-2 text-xs font-semibold text-[#2563eb] hover:underline"
              >
                Clear Filter
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto pr-1">
          <table className="w-full table-fixed border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="border-b border-[#eef2f7]">
                <th className="w-10 pb-3 pr-2 text-[12px] font-semibold text-[#64748b]">#</th>
                <th className="w-[28%] pb-3 pr-2 text-[12px] font-semibold text-[#64748b]">User</th>
                <th className="w-[36%] pb-3 pr-2 text-[12px] font-semibold text-[#64748b]">Subject</th>
                <th className="w-[16%] pb-3 pr-2 text-[12px] font-semibold text-[#64748b]">Score</th>
                <th className="w-[20%] pb-3 text-[12px] font-semibold text-[#64748b]">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map((activity, index) => {
                const scorePercent = parseScorePercent(activity.detail);

                return (
                  <tr
                    key={`${activity.type}-${activity.reference_id}-${activity.created_at}`}
                    className="border-b border-[#eef2f7] last:border-0"
                  >
                    <td className="py-3 pr-2 align-middle text-[14px] font-bold text-[#1e293b]">
                      {index + 1}
                    </td>
                    <td className="py-3 pr-2 align-middle">
                      <div className="flex min-w-0 items-center gap-2">
                        {activity.avatar_url ? (
                          <Image
                            src={activity.avatar_url}
                            alt={activity.username}
                            width={28}
                            height={28}
                            className="size-7 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#1e3a5f] text-[11px] font-bold text-white">
                            {activity.username?.charAt(0).toUpperCase() || "U"}
                          </span>
                        )}
                        <span className="truncate text-[13px] font-semibold text-[#1e293b]">
                          {activity.username}
                        </span>
                      </div>
                    </td>
                    <td
                      className="truncate py-3 pr-2 align-middle text-[13px] font-semibold text-[#1e293b]"
                      title={activity.subject || undefined}
                    >
                      {activity.subject || "—"}
                    </td>
                    <td className="py-3 pr-2 align-middle">
                      {scorePercent != null ? (
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold",
                            scoreBadgeClass(scorePercent),
                          )}
                        >
                          {Math.round(scorePercent)}%
                        </span>
                      ) : (
                        <span className="text-[13px] font-medium text-[#94a3b8]">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap py-3 align-middle text-[12px] font-medium text-[#475569]">
                      {formatActivityTime(activity.created_at)}
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
