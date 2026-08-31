"use client";

import { FileText } from "lucide-react";

import { DateRangePicker } from "@/components/ui/date-range-picker";

type DashboardToolbarProps = {
  title?: string;
  onDateChange?: (dateFrom: string | null, dateTo: string | null) => void;
  onGenerateReport?: () => void;
};

export function DashboardToolbar({ 
  title = "Dashboard",
  onDateChange,
  onGenerateReport,
}: DashboardToolbarProps) {
  return (
    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
        {title}
      </h1>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <DateRangePicker 
          dualMonth 
          onDateChange={onDateChange}
        />

        <button
          type="button"
          onClick={onGenerateReport}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#111827] px-4 text-sm font-semibold text-white transition hover:bg-black"
        >
          <FileText className="size-4" />
          Generate Reports
        </button>
      </div>
    </div>
  );
}
