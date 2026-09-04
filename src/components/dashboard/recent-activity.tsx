"use client";

import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Award,
  BookOpen,
  Check,
  ChevronDown,
  MessageSquare,
  Sparkles,
  Users,
} from "lucide-react";

import type { RecentActivityItem } from "@/services/dashboard.service";
import { ActivityFilter } from "@/types/dashboard.types";
import { DashboardPanelHeader } from "@/components/dashboard/dashboard-panel-header";
import {
  ACTIVITY_THEMES,
  dashboardCardClass,
  dashboardEmptyStateClass,
  dashboardScrollListClass,
  dashboardScrollListHeightClass,
} from "@/components/dashboard/dashboard-styles";
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

function getActivityIcon(category: ActivityCategory) {
  switch (category) {
    case "quizzes":
      return BookOpen;
    case "certificates":
      return Award;
    case "referrals":
      return Users;
    case "reviews":
      return MessageSquare;
    default:
      return Sparkles;
  }
}

function formatActivityTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
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

  const filteredActivities = filterActivities(activities, filter);
  const currentFilterLabel = FILTER_OPTIONS.find((f) => f.id === filter)?.label || "All Activities";

  return (
    <section className={cn("flex h-full min-w-0 flex-col", dashboardCardClass, className)}>
      <DashboardPanelHeader
        icon={Activity}
        iconWrapClassName="bg-[#ede9fe]"
        iconClassName="text-[#7c3aed]"
        title="Recent User Activity"
        subtitle="Latest platform events"
        badge={{ label: "Showing", value: filteredActivities.length }}
        wideBadge
        actions={
          <div className="relative w-full sm:w-auto" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 text-xs font-semibold text-[#374151] shadow-xs transition hover:bg-[#f9fafb] sm:w-auto sm:justify-start"
            >
              <span>{currentFilterLabel}</span>
              <ChevronDown
                className={cn(
                  "size-3.5 text-[#9ca3af] transition-transform",
                  dropdownOpen && "rotate-180",
                )}
              />
            </button>

            {dropdownOpen ? (
              <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-full overflow-hidden rounded-xl border border-[#eef1f6] bg-white py-1 shadow-lg sm:w-48">
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

      {filteredActivities.length === 0 ? (
        <div className={cn(dashboardEmptyStateClass, dashboardScrollListHeightClass)}>
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
        <ul className={dashboardScrollListClass}>
          {filteredActivities.map((activity) => {
            const category = mapActivityCategory(activity.type);
            const theme = ACTIVITY_THEMES[category];
            const Icon = getActivityIcon(category);

            return (
              <li
                key={`${activity.type}-${activity.reference_id}`}
                className={cn(
                  "flex flex-col gap-2 rounded-xl border px-3 py-2.5 transition hover:brightness-[0.99] sm:flex-row sm:items-center sm:justify-between sm:gap-4",
                  theme.card,
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-lg shadow-sm",
                      theme.icon,
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                  <p className="text-sm font-semibold text-[#111827]">{activity.description}</p>
                </div>
                <span className="shrink-0 pl-12 text-xs font-medium text-[#6b7280] sm:pl-0 sm:text-right">
                  {formatActivityTime(activity.created_at)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
