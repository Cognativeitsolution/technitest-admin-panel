"use client";

import Image from "next/image";
import { BookOpen, FolderOpen, Layers } from "lucide-react";

import type { TopCategoryItem } from "@/services/dashboard.service";
import { cn } from "@/lib/utils";

type TopCategoriesProps = {
  categories?: TopCategoryItem[];
  className?: string;
};

const RANK_THEMES = [
  {
    card: "border-[#fde68a] bg-linear-to-r from-[#fffbeb] to-[#fff7ed]",
    icon: "bg-[#fef3c7] text-[#d97706]",
    bar: "bg-[#f59e0b]",
    pill: "bg-[#fef3c7] text-[#b45309]",
    attempts: "text-[#b45309]",
  },
  {
    card: "border-[#e2e8f0] bg-linear-to-r from-[#f8fafc] to-[#f1f5f9]",
    icon: "bg-[#e2e8f0] text-[#475569]",
    bar: "bg-[#64748b]",
    pill: "bg-[#e2e8f0] text-[#475569]",
    attempts: "text-[#475569]",
  },
  {
    card: "border-[#fed7aa] bg-linear-to-r from-[#fff7ed] to-[#ffedd5]",
    icon: "bg-[#ffedd5] text-[#c2410c]",
    bar: "bg-[#ea580c]",
    pill: "bg-[#ffedd5] text-[#c2410c]",
    attempts: "text-[#c2410c]",
  },
  {
    card: "border-[#dbeafe] bg-linear-to-r from-[#eff6ff] to-[#f0f9ff]",
    icon: "bg-[#dbeafe] text-[#1d4ed8]",
    bar: "bg-[#3b82f6]",
    pill: "bg-[#dbeafe] text-[#1d4ed8]",
    attempts: "text-[#1d4ed8]",
  },
] as const;

const RANK_COLORS = ["#f59e0b", "#475569", "#ea580c", "#2563eb"] as const;

function getTheme(index: number) {
  return RANK_THEMES[Math.min(index, RANK_THEMES.length - 1)];
}

export function TopCategories({ categories = [], className }: TopCategoriesProps) {
  const maxAttempts = Math.max(...categories.map((item) => item.attempt_count), 1);
  const totalAttempts = categories.reduce((sum, item) => sum + item.attempt_count, 0);

  return (
    <section
      className={cn(
        "flex h-full flex-col rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]",
        className,
      )}
    >
      <div className="mb-5 flex shrink-0 items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#ffedd5]">
            <FolderOpen className="size-5 text-[#ea580c]" />
          </div>
          <div>
            <h2 className="text-lg font-bold leading-tight text-[#111827]">
              Top Categories
            </h2>
            <p className="text-xs text-[#6b7280]">Ranked by quiz attempts</p>
          </div>
        </div>
        {categories.length > 0 ? (
          <div className="rounded-lg bg-[#f8fafc] px-2.5 py-1.5 text-right">
            <p className="text-[10px] font-medium uppercase tracking-wide text-[#9ca3af]">
              Total
            </p>
            <p className="text-sm font-bold text-[#111827]">
              {totalAttempts.toLocaleString()}
            </p>
          </div>
        ) : null}
      </div>

      {categories.length === 0 ? (
        <div className="flex min-h-[280px] flex-1 items-center justify-center rounded-xl border border-dashed border-[#e5e7eb] bg-[#fafbfc] text-sm font-medium text-[#6b7280]">
          No data found
        </div>
      ) : (
        <ul className="flex min-h-[280px] flex-1 flex-col justify-between gap-2.5">
          {categories.map((category, index) => {
            const theme = getTheme(index);
            const progress = (category.attempt_count / maxAttempts) * 100;

            return (
              <li
                key={category.category_id}
                className={cn(
                  "shrink-0 rounded-xl border px-3 py-2.5 transition hover:brightness-[0.99]",
                  theme.card,
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white shadow-sm"
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
                      className="size-10 shrink-0 rounded-lg border border-white/80 object-cover shadow-sm"
                    />
                  ) : (
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-lg shadow-sm",
                        theme.icon,
                      )}
                    >
                      <Layers className="size-4" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-left text-sm font-bold text-[#111827]">
                      {category.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold",
                          theme.pill,
                        )}
                      >
                        <BookOpen className="size-3" />
                        {category.quiz_count}{" "}
                        {category.quiz_count === 1 ? "Quiz" : "Quizzes"}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-[#9ca3af]">
                      Attempts
                    </p>
                    <p className={cn("text-lg font-extrabold leading-none", theme.attempts)}>
                      {category.attempt_count.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 pl-11">
                  <div className="h-2 overflow-hidden rounded-full bg-white/70">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", theme.bar)}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
