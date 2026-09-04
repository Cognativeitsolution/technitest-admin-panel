"use client";

import Image from "next/image";
import { BookOpen, FolderOpen, Layers } from "lucide-react";

import type { TopCategoryItem } from "@/services/dashboard.service";
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

type TopCategoriesProps = {
  categories?: TopCategoryItem[];
  className?: string;
};

export function TopCategories({ categories = [], className }: TopCategoriesProps) {
  const maxAttempts = Math.max(...categories.map((item) => item.attempt_count), 1);
  const totalAttempts = categories.reduce((sum, item) => sum + item.attempt_count, 0);

  return (
    <section className={cn("flex h-full min-w-0 flex-col", dashboardCardClass, className)}>
      <DashboardPanelHeader
        icon={FolderOpen}
        iconWrapClassName="bg-[#ffedd5]"
        iconClassName="text-[#ea580c]"
        title="Top Categories"
        subtitle="Ranked by quiz attempts"
        badge={categories.length > 0 ? { label: "Total", value: totalAttempts } : undefined}
      />

      {categories.length === 0 ? (
        <div className={cn(dashboardEmptyStateClass, dashboardScrollListHeightClass)}>
          No data found
        </div>
      ) : (
        <ul className={dashboardScrollListClass}>
          {categories.map((category, index) => {
            const theme = getRankTheme(index);
            const progress = (category.attempt_count / maxAttempts) * 100;

            return (
              <li
                key={category.category_id}
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

                  {category.image_url ? (
                    <Image
                      src={category.image_url}
                      alt={category.title}
                      width={40}
                      height={40}
                      className="size-9 shrink-0 rounded-lg border border-white/80 object-cover shadow-sm sm:size-10"
                    />
                  ) : (
                    <div
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg shadow-sm sm:size-10",
                        theme.icon,
                      )}
                    >
                      <Layers className="size-4" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#111827]">{category.title}</p>
                    <div className="mt-1">
                      <span
                        className={cn(
                          "inline-flex max-w-full items-center gap-1 truncate rounded-md px-2 py-0.5 text-[10px] font-semibold",
                          theme.pill,
                        )}
                      >
                        <BookOpen className="size-3 shrink-0" />
                        {category.quiz_count}{" "}
                        {category.quiz_count === 1 ? "Quiz" : "Quizzes"}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-[#9ca3af]">
                      Attempts
                    </p>
                    <p className={cn("text-base font-extrabold leading-none sm:text-lg", theme.accent)}>
                      {category.attempt_count.toLocaleString()}
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
