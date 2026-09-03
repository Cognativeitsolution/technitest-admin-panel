"use client";

import { useMemo, useState } from "react";
import {
  CircleHelp,
  Eye,
  EyeOff,
  LayoutGrid,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

import { FaqDialog } from "@/components/faqs/faq-dialog";
import { FaqsList } from "@/components/faqs/faqs-list";
import { Can } from "@/components/shared/can";
import { Pagination } from "@/components/shared/pagination";
import { Dialog } from "@/components/ui/dialog";
import { useFaqs } from "@/hooks/faqs/use-faqs";
import {
  FAQ_CATEGORY_LABELS,
  FAQ_STATUS_OPTIONS,
  formatFaqCategory,
  isFaqCategory,
  isFaqInactive,
} from "@/lib/faq-utils";
import { cn } from "@/lib/utils";
import { FAQ_CATEGORIES, type FaqPayload, type FaqRecord } from "@/types/faq.types";

const PAGE_SIZE = 10;

export function FaqsManagementView() {
  const {
    items,
    total,
    loading,
    error,
    mutating,
    refresh,
    createFaqs,
    updateFaq,
    deleteFaq,
    restoreFaq,
  } = useFaqs();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<(typeof FAQ_STATUS_OPTIONS)[number]>("All");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FaqRecord | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<FaqRecord | null>(null);
  const [restoringId, setRestoringId] = useState<number | null>(null);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: items.length };
    for (const value of FAQ_CATEGORIES) counts[value] = 0;
    for (const faq of items) {
      const key = isFaqCategory(faq.faq_category) ? faq.faq_category : "others";
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
  }, [items]);

  const activeCount = items.filter((faq) => !isFaqInactive(faq)).length;
  const inactiveCount = items.length - activeCount;
  const usedCategories = FAQ_CATEGORIES.filter(
    (value) => (categoryCounts[value] ?? 0) > 0,
  ).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((faq) => {
      if (category !== "all" && faq.faq_category !== category) return false;
      if (status === "Active" && isFaqInactive(faq)) return false;
      if (status === "Inactive" && !isFaqInactive(faq)) return false;
      if (!q) return true;
      return (
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q)
      );
    });
  }, [items, category, status, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedFaqs = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function resetToFirstPage() {
    setPage(1);
  }

  function openCreate() {
    setEditingFaq(null);
    setDialogOpen(true);
  }

  function openEdit(faq: FaqRecord) {
    if (isFaqInactive(faq)) return;
    setEditingFaq(faq);
    setDialogOpen(true);
  }

  async function handleCreate(payloads: FaqPayload[]) {
    return createFaqs(payloads);
  }

  async function handleUpdate(faqId: number, payload: FaqPayload) {
    return updateFaq(faqId, payload);
  }

  async function confirmDelete() {
    if (!deleteTarget || isFaqInactive(deleteTarget)) return;
    const ok = await deleteFaq(deleteTarget.id);
    if (ok) setDeleteTarget(null);
  }

  async function confirmRestore() {
    if (!restoreTarget) return;
    setRestoringId(restoreTarget.id);
    const ok = await restoreFaq(restoreTarget.id);
    setRestoringId(null);
    if (ok) setRestoreTarget(null);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#e8ecf2] bg-white px-6 py-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#fff7ed] text-[#f0a500]">
              <CircleHelp className="size-5" />
            </div>
            <div>
              <h1 className="text-[24px] font-bold tracking-tight text-[#111827]">
                FAQ Management
              </h1>
              <p className="mt-1 text-sm text-[#6b7280]">
                Write and organize the answers visitors see on the public help
                center.
              </p>
            </div>
          </div>
          <Can permission="faq:create">
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex h-11 w-fit items-center gap-2 rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d99400]"
            >
              <Plus className="size-4" />
              Add FAQ
            </button>
          </Can>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={<CircleHelp className="size-4" />}
          label="Total questions"
          value={loading ? "—" : String(total)}
          tone="amber"
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
          icon={<LayoutGrid className="size-4" />}
          label="Categories in use"
          value={loading ? "—" : String(usedCategories)}
          tone="blue"
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

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <CategoryChip
            label="All"
            count={categoryCounts.all}
            active={category === "all"}
            onClick={() => {
              setCategory("all");
              resetToFirstPage();
            }}
          />
          {FAQ_CATEGORIES.map((value) => (
            <CategoryChip
              key={value}
              label={FAQ_CATEGORY_LABELS[value]}
              count={categoryCounts[value] ?? 0}
              active={category === value}
              onClick={() => {
                setCategory(value);
                resetToFirstPage();
              }}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full min-w-[220px] sm:w-[260px]">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#9ca3af]" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                resetToFirstPage();
              }}
              placeholder="Search questions or answers"
              className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-white pr-4 pl-10 text-sm text-[#374151] outline-none transition placeholder:text-[#9ca3af] focus:border-[#d1d5db] focus:ring-0"
            />
          </div>
          <select
            aria-label="Status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as (typeof FAQ_STATUS_OPTIONS)[number]);
              resetToFirstPage();
            }}
            className="h-10 rounded-xl border border-[#e5e7eb] bg-white px-3.5 text-sm font-medium text-[#374151] shadow-sm outline-none transition hover:bg-[#f9fafb]"
          >
            {FAQ_STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option === "All" ? "Status" : option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <FaqsList
        faqs={pagedFaqs}
        loading={loading}
        restoringId={restoringId}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        onRestore={setRestoreTarget}
      />

      {!loading && filtered.length > 0 ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-[#9ca3af]">
            Showing {pagedFaqs.length} of {filtered.length}
            {category !== "all" ? ` in ${formatFaqCategory(category)}` : ""}
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      ) : null}

      <FaqDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingFaq(null);
        }}
        faq={editingFaq}
        existingFaqs={items}
        submitting={mutating}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete FAQ"
        maxWidth="max-w-sm"
      >
        <p className="text-sm text-[#4b5563]">
          Delete{" "}
          <span className="font-semibold text-[#111827]">
            {deleteTarget?.question}
          </span>
          ? You can restore it later from inactive FAQs.
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
        title="Restore FAQ"
        maxWidth="max-w-sm"
      >
        <p className="text-sm text-[#4b5563]">
          Restore{" "}
          <span className="font-semibold text-[#111827]">
            {restoreTarget?.question}
          </span>
          ? It will show on the public FAQ page again.
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

function CategoryChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-full border px-3 text-sm font-medium transition",
        active
          ? "border-[#f0a500] bg-[#fff7ed] text-[#b45309]"
          : "border-[#e5e7eb] bg-white text-[#4b5563] hover:bg-[#f9fafb]",
      )}
    >
      {label}
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
          active ? "bg-[#fde68a] text-[#92400e]" : "bg-[#f3f4f6] text-[#6b7280]",
        )}
      >
        {count}
      </span>
    </button>
  );
}
