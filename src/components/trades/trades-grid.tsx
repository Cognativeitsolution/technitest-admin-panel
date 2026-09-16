"use client";

import Link from "next/link";
import { FolderTree, Layers, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";

import { Can } from "@/components/shared/can";
import { cn } from "@/lib/utils";
import type { TradeItem } from "@/types/trade.types";

const TRADE_WRITE_PERMISSIONS = ["trade:create"];
const TRADE_UPDATE_PERMISSIONS = ["trade:update"];
const TRADE_DELETE_PERMISSIONS = ["trade:delete"];
const TRADE_RESTORE_PERMISSIONS = ["trade:restore"];

type TradesGridProps = {
  trades: TradeItem[];
  loading?: boolean;
  restoringId?: number | null;
  onEdit: (trade: TradeItem) => void;
  onDelete: (trade: TradeItem) => void;
  onRestore: (trade: TradeItem) => void;
  onAddSubcategory: (trade: TradeItem) => void;
};

function isInactive(trade: TradeItem) {
  return trade.is_active === false;
}

export function TradesGrid({
  trades,
  loading = false,
  restoringId = null,
  onEdit,
  onDelete,
  onRestore,
  onAddSubcategory,
}: TradesGridProps) {
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

  if (trades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#dbe3ef] bg-white px-6 py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#eff6ff] text-[#2563eb]">
          <Layers className="size-7" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-[#111827]">
          No categories found
        </h3>
        <p className="mt-1 max-w-sm text-sm text-[#6b7280]">
          Try a different search, or add a category so subcategories can live under it.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {trades.map((trade) => {
        const inactive = isInactive(trade);
        const restoring = restoringId === trade.id;
        const categoryLabel =
          trade.category_count === 1
            ? "1 subcategory"
            : `${trade.category_count ?? 0} subcategories`;

        return (
          <article
            key={trade.id}
            className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)] transition hover:shadow-[0_8px_24px_rgba(16,24,40,0.06)]"
          >
            <div
              className={cn(
                "flex min-h-0 flex-1 flex-col",
                inactive && "pointer-events-none opacity-40",
              )}
            >
              <Link
                href={`/categories/${trade.id}`}
                className="relative block h-40 w-full shrink-0 overflow-hidden bg-[#eef2f7]"
              >
                {trade.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={trade.image_url}
                    alt={trade.title}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#f3f6fb]">
                    <span className="flex size-14 items-center justify-center rounded-2xl bg-white text-xl font-bold text-[#2563eb] shadow-sm">
                      {trade.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </Link>

              <div className="flex flex-1 flex-col px-5 pt-4">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/categories/${trade.id}`}
                    className="line-clamp-1 text-base font-semibold text-[#111827] hover:text-[#2563eb]"
                  >
                    {trade.title}
                  </Link>
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
                  {trade.detail && trade.detail !== "string"
                    ? trade.detail
                    : "No description"}
                </p>
              </div>
            </div>

            <div className="mt-auto px-5 pt-3 pb-4">
              {inactive ? null : (
                <Can permission="category:create">
                  <button
                    type="button"
                    onClick={() => onAddSubcategory(trade)}
                    className="mb-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-[#fde68a] bg-[#fffbeb] text-xs font-semibold text-[#d97706] transition hover:bg-[#fef3c7]"
                  >
                    <Plus className="size-3.5" />
                    Add subcategory
                  </button>
                </Can>
              )}

              <div className="flex items-center justify-between">
                <Link
                  href={`/categories/${trade.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2563eb] transition hover:underline"
                >
                  <FolderTree className="size-3.5" />
                  {categoryLabel}
                </Link>

                {inactive ? (
                  <Can anyPermission={TRADE_RESTORE_PERMISSIONS}>
                    <button
                      type="button"
                      aria-label={`Restore ${trade.title}`}
                      disabled={restoring}
                      onClick={() => onRestore(trade)}
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
                    <Can anyPermission={TRADE_UPDATE_PERMISSIONS}>
                      <button
                        type="button"
                        aria-label={`Edit ${trade.title}`}
                        onClick={() => onEdit(trade)}
                        className="rounded-lg p-2 text-[#16a34a] transition hover:bg-[#ecfdf5] hover:text-[#15803d]"
                      >
                        <Pencil className="size-4" />
                      </button>
                    </Can>
                    <Can anyPermission={TRADE_DELETE_PERMISSIONS}>
                      <button
                        type="button"
                        aria-label={`Delete ${trade.title}`}
                        onClick={() => onDelete(trade)}
                        className="rounded-lg p-2 text-[#ef4444] transition hover:bg-[#fef2f2] hover:text-[#dc2626]"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </Can>
                  </div>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export { TRADE_WRITE_PERMISSIONS, TRADE_UPDATE_PERMISSIONS, TRADE_DELETE_PERMISSIONS, TRADE_RESTORE_PERMISSIONS };
