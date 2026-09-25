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
    <div className="rounded-[10px] border border-[#e5eaf2] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#dbeafe]">
            <LayoutDashboard className="size-5 text-[#2563eb]" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-[#1e293b] sm:text-[24px]">
              {title}
            </h1>
            <p className="mt-0.5 text-sm text-[#64748b]">
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
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#e5e7eb] bg-white px-3 text-xs font-semibold text-[#64748b] transition hover:bg-[#f8fafc] hover:text-[#1e293b]"
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
