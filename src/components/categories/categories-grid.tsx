"use client";

import Link from "next/link";
import { BookOpen, Layers, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";

import { Can } from "@/components/shared/can";
import { CardStatusBadge } from "@/components/shared/card-status-badge";
import { cn } from "@/lib/utils";
import type { CategoryItem } from "@/types/category.types";

type CategoriesGridProps = {
  categories: CategoryItem[];
  loading?: boolean;
  restoringId?: number | null;
  tradeNames?: Record<number, string>;
  onEdit: (category: CategoryItem) => void;
  onDelete: (category: CategoryItem) => void;
  onRestore: (category: CategoryItem) => void;
};

function isInactive(category: CategoryItem) {
  return category.is_active === false;
}

export function CategoriesGrid({
  categories,
  loading = false,
  restoringId = null,
  tradeNames,
  onEdit,
  onDelete,
  onRestore,
}: CategoriesGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-72 animate-pulse rounded-2xl border border-[#e8ecf2] bg-white"
          />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#dbe3ef] bg-white px-6 py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#eff6ff] text-[#2563eb]">
          <Layers className="size-7" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-[#111827]">
          No subcategories found
        </h3>
        <p className="mt-1 max-w-sm text-sm text-[#6b7280]">
          Try a different search, or add a subcategory under this trade.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => {
        const inactive = isInactive(category);
        const restoring = restoringId === category.id;
        const quizLabel =
          category.quiz_count === 1
            ? "1 quiz"
            : `${category.quiz_count ?? 0} quizzes`;

        return (
          <article
            key={category.id}
            className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)] transition hover:shadow-[0_8px_24px_rgba(16,24,40,0.06)]"
          >
            <div
              className={cn(
                "flex min-h-0 flex-1 flex-col",
                inactive && "pointer-events-none",
              )}
            >
              <div className="relative h-40 w-full shrink-0 overflow-hidden bg-[#eef2f7]">
                <div className={cn("h-full w-full", inactive && "opacity-40")}>
                  {category.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={category.image_url}
                      alt={category.title}
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#f3f6fb]">
                      <span className="flex size-14 items-center justify-center rounded-2xl bg-white text-xl font-bold text-[#2563eb] shadow-sm">
                        {category.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <CardStatusBadge inactive={inactive} />
              </div>

              <div
                className={cn(
                  "flex flex-1 flex-col px-5 pt-4",
                  inactive && "opacity-40",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="line-clamp-1 text-base font-semibold text-[#111827]">
                      {category.title}
                    </h3>
                    {tradeNames?.[category.trade_id] ? (
                      <p className="mt-0.5 truncate text-xs font-medium text-[#2563eb]">
                        {tradeNames[category.trade_id]}
                      </p>
                    ) : null}
                  </div>
                  {inactive ? null : (
                    <div className="flex shrink-0 items-center gap-0.5">
                      <Can permission="category:update">
                        <button
                          type="button"
                          title="Edit subcategory"
                          aria-label={`Edit subcategory ${category.title}`}
                          onClick={() => onEdit(category)}
                          className="rounded-lg p-1.5 text-[#16a34a] transition hover:bg-[#ecfdf5] hover:text-[#15803d]"
                        >
                          <Pencil className="size-4" />
                        </button>
                      </Can>
                      <Can permission="category:delete">
                        <button
                          type="button"
                          title="Delete subcategory"
                          aria-label={`Delete subcategory ${category.title}`}
                          onClick={() => onDelete(category)}
                          className="rounded-lg p-1.5 text-[#ef4444] transition hover:bg-[#fef2f2] hover:text-[#dc2626]"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </Can>
                    </div>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-[#6b7280]">
                  {category.detail && category.detail !== "string"
                    ? category.detail
                    : "No description"}
                </p>
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between gap-2 px-5 pt-3 pb-4">
              <Link
                href="/quizzes"
                className={cn(
                  "inline-flex items-center gap-1.5 text-xs font-medium text-[#2563eb] transition hover:underline",
                  inactive && "pointer-events-none opacity-40",
                )}
              >
                <BookOpen className="size-3.5" />
                {quizLabel}
              </Link>

              {inactive ? (
                <Can permission="category:restore">
                  <button
                    type="button"
                    aria-label={`Restore subcategory ${category.title}`}
                    disabled={restoring}
                    onClick={() => onRestore(category)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-[#2563eb] transition hover:bg-[#eff6ff] disabled:opacity-50"
                  >
                    <RotateCcw
                      className={cn("size-3.5", restoring && "animate-spin")}
                    />
                    {restoring ? "Restoring..." : "Restore"}
                  </button>
                </Can>
              ) : (
                <Can permission="quiz:create">
                  <Link
                    href={`/quizzes/new?category_id=${category.id}`}
                    title="Add quiz"
                    aria-label={`Add quiz to ${category.title}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#d97706] transition hover:text-[#b45309]"
                  >
                    <Plus className="size-3.5" />
                    Add quiz
                  </Link>
                </Can>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
