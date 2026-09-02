"use client";

import { useEffect, useRef, useState } from "react";
import { Award, BookOpen, Check, ChevronDown, MessageSquare, Sparkles, Users } from "lucide-react";

import { filterActivities, RECENT_ACTIVITIES } from "@/lib/dashboard-data";
import { ActivityFilter, ActivityItem } from "@/types/dashboard.types";
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

function getActivityIcon(category: ActivityItem["category"]) {
  switch (category) {
    case "quizzes":
      return <BookOpen className="size-4 text-[#ea580c]" />;
    case "certificates":
      return <Award className="size-4 text-[#16a34a]" />;
    case "referrals":
      return <Users className="size-4 text-[#2563eb]" />;
    case "reviews":
      return <MessageSquare className="size-4 text-[#8b5cf6]" />;
    default:
      return <Sparkles className="size-4 text-[#6b7280]" />;
  }
}

function getActivityBadgeClass(category: ActivityItem["category"]) {
  switch (category) {
    case "quizzes":
      return "bg-[#ffedd5]";
    case "certificates":
      return "bg-[#dcfce7]";
    case "referrals":
      return "bg-[#dbeafe]";
    case "reviews":
      return "bg-[#ede9fe]";
    default:
      return "bg-[#f3f4f6]";
  }
}

export function RecentActivity() {
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

  const filteredActivities = filterActivities(RECENT_ACTIVITIES, filter);
  const currentFilterLabel = FILTER_OPTIONS.find((f) => f.id === filter)?.label || "All Activities";

  return (
    <section className="rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#111827]">
            Recent User Activity
          </h2>
          <p className="text-xs text-[#6b7280]">
            Showing {filteredActivities.length} {filteredActivities.length === 1 ? "activity" : "activities"}
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 text-sm font-medium text-[#374151] shadow-xs transition hover:bg-[#f9fafb]"
          >
            <span>{currentFilterLabel}</span>
            <ChevronDown className={cn("size-3.5 text-[#9ca3af] transition-transform", dropdownOpen && "rotate-180")} />
          </button>

          {dropdownOpen ? (
            <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-48 overflow-hidden rounded-xl border border-[#eef1f6] bg-white py-1 shadow-lg">
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

      {filteredActivities.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm font-medium text-[#6b7280]">No activities found for this filter.</p>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className="mt-2 text-xs font-semibold text-[#2563eb] hover:underline"
          >
            Clear Filter
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-[#eef1f6]">
          {filteredActivities.map((activity) => (
            <li
              key={activity.id}
              className="flex flex-col gap-2 py-3.5 first:pt-1 last:pb-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4 transition hover:bg-[#fafbfc] px-2 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", getActivityBadgeClass(activity.category))}>
                  {getActivityIcon(activity.category)}
                </div>
                <p className="text-sm font-medium text-[#374151]">{activity.text}</p>
              </div>
              <span className="shrink-0 text-xs font-medium text-[#9ca3af] sm:text-right">
                {activity.time}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
