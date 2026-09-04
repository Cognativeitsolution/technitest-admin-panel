"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";

import { Can } from "@/components/shared/can";
import {
  formatFaqCategory,
  getFaqCategoryStyle,
  isFaqInactive,
} from "@/lib/faq-utils";
import { cn, formatDateTime } from "@/lib/utils";
import type { FaqRecord } from "@/types/faq.types";

type FaqsListProps = {
  faqs: FaqRecord[];
  loading?: boolean;
  restoringId?: number | null;
  onEdit: (faq: FaqRecord) => void;
  onDelete: (faq: FaqRecord) => void;
  onRestore: (faq: FaqRecord) => void;
};

export function FaqsList({
  faqs,
  loading = false,
  restoringId = null,
  onEdit,
  onDelete,
  onRestore,
}: FaqsListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const grouped = useMemo(() => {
    const groups = new Map<string, FaqRecord[]>();
    for (const faq of faqs) {
      const key = faq.faq_category || "others";
      const list = groups.get(key) ?? [];
      list.push(faq);
      groups.set(key, list);
    }
    return Array.from(groups.entries());
  }, [faqs]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[72px] animate-pulse rounded-2xl border border-[#e8ecf2] bg-white"
          />
        ))}
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#dbe3ef] bg-white px-6 py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#fff7ed] text-[#f0a500]">
          <HelpCircle className="size-7" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-[#111827]">
          No FAQs found
        </h3>
        <p className="mt-1 max-w-sm text-sm text-[#6b7280]">
          Try a different search or category, or add a new question for the
          public help center.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {grouped.map(([category, items]) => {
        const style = getFaqCategoryStyle(category);

        return (
          <section
            key={category}
            className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]"
          >
            <div className="flex items-center justify-between border-b border-[#eef1f6] px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className={cn("size-2 rounded-full", style.dot)} />
                <h2 className="text-sm font-semibold text-[#111827]">
                  {formatFaqCategory(category)}
                </h2>
              </div>
              <span className="text-xs font-medium text-[#6b7280]">
                {items.length} {items.length === 1 ? "question" : "questions"}
              </span>
            </div>

            <ul>
              {items.map((faq, index) => {
                const inactive = isFaqInactive(faq);
                const expanded = expandedId === faq.id;
                const restoring = restoringId === faq.id;

                return (
                  <li
                    key={faq.id}
                    className={cn(
                      "border-t border-[#eef1f6] first:border-t-0",
                      inactive && "bg-[#fafafa]",
                    )}
                  >
                    <div className="flex items-start gap-3 px-5 py-4">
                      <span className="mt-0.5 w-8 shrink-0 text-xs font-semibold tabular-nums text-[#9ca3af]">
                        {String(faq.display_order ?? index + 1).padStart(2, "0")}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(expanded ? null : faq.id)
                        }
                        className="min-w-0 flex-1 text-left"
                      >
                        <div className="flex items-start gap-2">
                          <p
                            className={cn(
                              "text-sm font-semibold",
                              inactive ? "text-[#9ca3af]" : "text-[#111827]",
                            )}
                          >
                            {faq.question}
                          </p>
                          <ChevronDown
                            className={cn(
                              "mt-0.5 size-4 shrink-0 text-[#9ca3af] transition",
                              expanded && "rotate-180",
                            )}
                          />
                        </div>
                        {!expanded ? (
                          <p className="mt-1 line-clamp-1 text-sm text-[#6b7280]">
                            {faq.answer}
                          </p>
                        ) : null}
                      </button>

                      <div className="flex shrink-0 items-center gap-2">
                        <span
                          className={cn(
                            "hidden rounded-full px-2.5 py-1 text-[11px] font-semibold sm:inline-flex",
                            inactive
                              ? "bg-[#fee2e2] text-[#dc2626]"
                              : "bg-[#dcfce7] text-[#16a34a]",
                          )}
                        >
                          {inactive ? "Inactive" : "Active"}
                        </span>

                        {inactive ? (
                          <Can permission="faq:restore">
                            <button
                              type="button"
                              aria-label={`Restore ${faq.question}`}
                              disabled={restoring}
                              onClick={() => onRestore(faq)}
                              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-[#2563eb] transition hover:bg-[#eff6ff] disabled:opacity-50"
                            >
                              <RotateCcw
                                className={cn(
                                  "size-3.5",
                                  restoring && "animate-spin",
                                )}
                              />
                              {restoring ? "Restoring..." : "Restore"}
                            </button>
                          </Can>
                        ) : (
                          <>
                            <Can permission="faq:update">
                              <button
                                type="button"
                                aria-label={`Edit ${faq.question}`}
                                onClick={() => onEdit(faq)}
                                className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]"
                              >
                                <Pencil className="size-4" />
                              </button>
                            </Can>
                            <Can permission="faq:delete">
                              <button
                                type="button"
                                aria-label={`Delete ${faq.question}`}
                                onClick={() => onDelete(faq)}
                                className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#fef2f2] hover:text-[#ef4444]"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </Can>
                          </>
                        )}
                      </div>
                    </div>

                    {expanded ? (
                      <div className="border-t border-[#f3f4f6] bg-[#fafbfc] px-5 py-4 pl-[4.25rem] sm:pl-[4.5rem]">
                        <p className="whitespace-pre-wrap text-sm leading-6 text-[#374151]">
                          {faq.answer}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#9ca3af]">
                          {faq.creator?.username ? (
                            <span>Created by {faq.creator.username}</span>
                          ) : null}
                          {faq.created_at ? (
                            <span>{formatDateTime(faq.created_at)}</span>
                          ) : null}
                          {faq.updator?.username ? (
                            <span>Updated by {faq.updator.username}</span>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
