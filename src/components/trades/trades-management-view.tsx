"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  FolderTree,
  Layers,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

import { CategoryDialog } from "@/components/categories/category-dialog";
import { Can } from "@/components/shared/can";
import { Pagination } from "@/components/shared/pagination";
import { TradeDialog } from "@/components/trades/trade-dialog";
import {
  TRADE_WRITE_PERMISSIONS,
  TradesGrid,
} from "@/components/trades/trades-grid";
import { Dialog } from "@/components/ui/dialog";
import { useTrades } from "@/hooks/trades/use-trades";
import { ApiError } from "@/lib/api-error";
import { cn } from "@/lib/utils";
import { categoryService } from "@/services/category.service";
import type { CategoryFormValues } from "@/types/category.types";
import type { TradeItem, TradePayload, TradeStatusFilter } from "@/types/trade.types";

const PAGE_SIZE = 9;
const STATUS_OPTIONS: TradeStatusFilter[] = ["All", "Active", "Inactive"];

function isInactive(trade: TradeItem) {
  return trade.is_active === false;
}

export function TradesManagementView() {
  const {
    items,
    total,
    loading,
    error,
    mutating,
    refresh,
    createTrade,
    updateTrade,
    deleteTrade,
    restoreTrade,
  } = useTrades();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<TradeStatusFilter>("All");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TradeItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TradeItem | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<TradeItem | null>(null);
  const [restoringId, setRestoringId] = useState<number | null>(null);
  const [subcategoryParent, setSubcategoryParent] = useState<TradeItem | null>(
    null,
  );
  const [submittingSubcategory, setSubmittingSubcategory] = useState(false);

  const activeCount = items.filter((item) => !isInactive(item)).length;
  const inactiveCount = items.length - activeCount;
  const subcategoryTotal = items.reduce(
    (sum, item) => sum + (item.category_count ?? 0),
    0,
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (status === "Active" && isInactive(item)) return false;
      if (status === "Inactive" && !isInactive(item)) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        (item.detail ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, query, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(trade: TradeItem) {
    if (isInactive(trade)) return;
    setEditing(trade);
    setDialogOpen(true);
  }

  async function confirmDelete() {
    if (!deleteTarget || isInactive(deleteTarget)) return;
    const ok = await deleteTrade(deleteTarget.id);
    if (ok) setDeleteTarget(null);
  }

  async function confirmRestore() {
    if (!restoreTarget) return;
    setRestoringId(restoreTarget.id);
    const ok = await restoreTrade(restoreTarget.id);
    setRestoringId(null);
    if (ok) setRestoreTarget(null);
  }

  async function createSubcategory(
    payload: CategoryFormValues,
    image: File | null,
  ) {
    const tradeId = payload.trade_id ?? subcategoryParent?.id;
    if (!tradeId) {
      toast.error("Select a trade for this subcategory.");
      return false;
    }

    setSubmittingSubcategory(true);
    try {
      await categoryService.create(
        { title: payload.title, detail: payload.detail, trade_id: tradeId },
        image,
      );
      toast.success("Subcategory created");
      refresh();
      return true;
    } catch (err) {
      toast.error(ApiError.fromAxiosError(err).message);
      return false;
    } finally {
      setSubmittingSubcategory(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#e8ecf2] bg-white px-6 py-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] text-[#2563eb]">
              <Layers className="size-5" />
            </div>
            <div>
              <h1 className="text-[24px] font-bold tracking-tight text-[#111827]">
                Trades Management
              </h1>
              <p className="mt-1 text-sm text-[#6b7280]">
                Organize the catalog by trade, then add subcategories inside each one.
              </p>
            </div>
          </div>
          <Can anyPermission={TRADE_WRITE_PERMISSIONS}>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex h-11 w-fit items-center gap-2 rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d99400]"
            >
              <Plus className="size-4" />
              Add Trade
            </button>
          </Can>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={<Layers className="size-4" />}
          label="Total trades"
          value={loading ? "—" : String(total)}
          tone="blue"
        />
        <StatCard
          icon={<Eye className="size-4" />}
          label="Active"
          value={loading ? "—" : String(activeCount)}
          tone="green"
        />
        <StatCard
          icon={<EyeOff className="size-4" />}
          label="Inactive"
          value={loading ? "—" : String(inactiveCount)}
          tone="red"
        />
        <StatCard
          icon={<FolderTree className="size-4" />}
          label="Subcategories"
          value={loading ? "—" : String(subcategoryTotal)}
          tone="amber"
        />
      </div>

      {error ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
          <span>{error}</span>
          <button
            type="button"
            onClick={refresh}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#b91c1c] transition hover:bg-[#fee2e2]"
          >
            <RefreshCw className="size-3.5" />
            Retry
          </button>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full min-w-[220px] sm:max-w-[320px]">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#9ca3af]" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search trades"
            className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-white pr-4 pl-10 text-sm text-[#374151] outline-none transition placeholder:text-[#9ca3af] focus:border-[#d1d5db] focus:ring-0"
          />
        </div>
        <select
          aria-label="Status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as TradeStatusFilter);
            setPage(1);
          }}
          className="h-10 w-fit rounded-xl border border-[#e5e7eb] bg-white px-3.5 text-sm font-medium text-[#374151] shadow-sm outline-none transition hover:bg-[#f9fafb]"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option === "All" ? "Status" : option}
            </option>
          ))}
        </select>
      </div>

      <TradesGrid
        trades={paged}
        loading={loading}
        restoringId={restoringId}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        onRestore={setRestoreTarget}
        onAddSubcategory={setSubcategoryParent}
      />

      {!loading && filtered.length > 0 ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-[#9ca3af]">
            Showing {paged.length} of {filtered.length}
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      ) : null}

      <TradeDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditing(null);
        }}
        trade={editing}
        submitting={mutating}
        onCreate={async (payload: TradePayload, image) => {
          const ok = await createTrade(payload, image);
          if (ok) setPage(1);
          return ok;
        }}
        onUpdate={updateTrade}
      />

      <CategoryDialog
        open={Boolean(subcategoryParent)}
        onClose={() => setSubcategoryParent(null)}
        category={null}
        submitting={submittingSubcategory}
        trades={items}
        lockedTradeId={subcategoryParent?.id}
        onCreate={createSubcategory}
        onUpdate={async () => false}
      />

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete Trade"
        maxWidth="max-w-sm"
      >
        <p className="text-sm text-[#4b5563]">
          Delete{" "}
          <span className="font-semibold text-[#111827]">
            {deleteTarget?.title}
          </span>
          ? You can restore it later from inactive trades.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            disabled={mutating}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e5e7eb] px-4 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            disabled={mutating}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#ef4444] px-4 text-sm font-semibold text-white transition hover:bg-[#dc2626] disabled:opacity-50"
          >
            {mutating ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Dialog>

      <Dialog
        open={Boolean(restoreTarget)}
        onClose={() => setRestoreTarget(null)}
        title="Restore Trade"
        maxWidth="max-w-sm"
      >
        <p className="text-sm text-[#4b5563]">
          Restore{" "}
          <span className="font-semibold text-[#111827]">
            {restoreTarget?.title}
          </span>
          ? Its subcategories will be available again.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setRestoreTarget(null)}
            disabled={Boolean(restoringId)}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e5e7eb] px-4 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmRestore}
            disabled={Boolean(restoringId)}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#2563eb] px-4 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:opacity-50"
          >
            {restoringId ? "Restoring..." : "Restore"}
          </button>
        </div>
      </Dialog>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "amber" | "green" | "red" | "blue";
}) {
  const tones = {
    amber: "bg-[#fff7ed] text-[#d97706]",
    green: "bg-[#ecfdf5] text-[#047857]",
    red: "bg-[#fef2f2] text-[#b91c1c]",
    blue: "bg-[#eff6ff] text-[#2563eb]",
  };

  return (
    <div className="rounded-2xl border border-[#e8ecf2] bg-white px-4 py-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-xl",
            tones[tone],
          )}
        >
          {icon}
        </span>
        <div>
          <p className="text-xs font-medium text-[#6b7280]">{label}</p>
          <p className="text-lg font-bold text-[#111827]">{value}</p>
        </div>
      </div>
    </div>
  );
}
