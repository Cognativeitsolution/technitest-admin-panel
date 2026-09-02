"use client";

import { FileText, RotateCcw } from "lucide-react";

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
    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
          {title}
        </h1>
        <p className="mt-0.5 text-xs text-[#6b7280]">
          Overview of platform metrics, user engagement, quizzes, and revenue.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Custom Date Range Picker */}
        <DateRangePicker
          dualMonth
          value={dateRange}
          onChange={onDateRangeChange}
          placeholder="Filter by dates"
        />

        {/* Reset Filter Button */}
        {isFiltered ? (
          <button
            type="button"
            onClick={onResetFilters}
            title="Reset Filters"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#e5e7eb] bg-white px-3 text-xs font-medium text-[#6b7280] shadow-sm transition hover:bg-[#f9fafb] hover:text-[#111827]"
          >
            <RotateCcw className="size-3.5" />
            Reset
          </button>
        ) : null}

        {/* Generate Reports Button */}
        <button
          type="button"
          onClick={onOpenReportModal}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d4ed8]"
        >
          <FileText className="size-4" />
          Generate Reports
        </button>
      </div>
    </div>
  );
}
