"use client";

import { BookOpen, Layers, Pencil, RotateCcw, Trash2 } from "lucide-react";

import { Can } from "@/components/shared/can";
import { cn } from "@/lib/utils";
import type { CategoryItem } from "@/types/category.types";

type CategoriesGridProps = {
  categories: CategoryItem[];
  loading?: boolean;
  restoringId?: number | null;
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
          No categories found
        </h3>
        <p className="mt-1 max-w-sm text-sm text-[#6b7280]">
          Try a different search, or add a category for quizzes to live under.
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
                inactive && "pointer-events-none opacity-40",
              )}
            >
              <div className="relative h-40 w-full shrink-0 overflow-hidden bg-[#eef2f7]">
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

              <div className="flex flex-1 flex-col px-5 pt-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="line-clamp-1 text-base font-semibold text-[#111827]">
                    {category.title}
                  </h3>
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
                      inactive
                        ? "bg-[#fee2e2] text-[#dc2626]"
                        : "bg-[#dcfce7] text-[#16a34a]",
                    )}
                  >
                    {inactive ? "Inactive" : "Active"}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-[#6b7280]">
                  {category.detail && category.detail !== "string"
                    ? category.detail
                    : "No description"}
                </p>
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between px-5 pt-3 pb-4">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 text-xs font-medium text-[#6b7280]",
                  inactive && "opacity-40",
                )}
              >
                <BookOpen className="size-3.5" />
                {quizLabel}
              </span>

              {inactive ? (
                <Can permission="category:restore">
                  <button
                    type="button"
                    aria-label={`Restore ${category.title}`}
                    disabled={restoring}
                    onClick={() => onRestore(category)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-[#2563eb] transition hover:bg-[#eff6ff] disabled:opacity-50"
                  >
                    <RotateCcw
                      className={cn("size-3.5", restoring && "animate-spin")}
                    />
                    {restoring ? "Restoring..." : "Restore"}
                  </button>
                </Can>
              ) : (
                <div className="flex items-center gap-1">
                  <Can permission="category:update">
                    <button
                      type="button"
                      aria-label={`Edit ${category.title}`}
                      onClick={() => onEdit(category)}
                      className="rounded-lg p-2 text-[#16a34a] transition hover:bg-[#ecfdf5] hover:text-[#15803d]"
                    >
                      <Pencil className="size-4" />
                    </button>
                  </Can>
                  <Can permission="category:delete">
                    <button
                      type="button"
                      aria-label={`Delete ${category.title}`}
                      onClick={() => onDelete(category)}
                      className="rounded-lg p-2 text-[#ef4444] transition hover:bg-[#fef2f2] hover:text-[#dc2626]"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </Can>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
