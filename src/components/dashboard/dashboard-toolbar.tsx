"use client";

import { FileText, LayoutDashboard, RotateCcw } from "lucide-react";

import { DateRange, DateRangePicker } from "@/components/ui/date-range-picker";

type DashboardToolbarProps = {
  title?: string;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onOpenReportModal: () => void;
  onResetFilters: () => void;
};

export function DashboardToolbar({
  title = "Dashboard",
  dateRange,
  onDateRangeChange,
  onOpenReportModal,
  onResetFilters,
}: DashboardToolbarProps) {
  const isFiltered = Boolean(dateRange.start || dateRange.end);

  return (
    <div className="mb-6 rounded-2xl border border-[#eef1f6] bg-linear-to-r from-white to-[#fafbfc] p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#dbeafe] shadow-sm">
            <LayoutDashboard className="size-5 text-[#2563eb]" />
          </div>
          <div>
            <h1 className="text-[28px] font-extrabold tracking-tight text-[#111827]">{title}</h1>
            <p className="mt-0.5 text-sm text-[#6b7280]">
              Overview of platform metrics, user engagement, quizzes, and revenue.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <DateRangePicker
            dualMonth
            value={dateRange}
            onChange={onDateRangeChange}
            placeholder="Filter by dates"
          />

          {isFiltered ? (
            <button
              type="button"
              onClick={onResetFilters}
              title="Reset Filters"
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#e5e7eb] bg-white px-3 text-xs font-semibold text-[#6b7280] shadow-sm transition hover:bg-[#f9fafb] hover:text-[#111827]"
            >
              <RotateCcw className="size-3.5" />
              Reset
            </button>
          ) : null}

          <button
            type="button"
            onClick={onOpenReportModal}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d4ed8]"
          >
            <FileText className="size-4" />
            Generate Reports
          </button>
        </div>
      </div>
    </div>
  );
}
