"use client";

import { useState } from "react";
import { ChevronDown, Calendar } from "lucide-react";

interface DateRangeFilterProps {
  onApply: (dateFrom: string | null, dateTo: string | null) => void;
  loading?: boolean;
}

export function DateRangeFilter({ onApply, loading = false }: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [selectedLabel, setSelectedLabel] = useState<string>("All Time");

  const handleQuickSelect = (label: string, from: string, to: string) => {
    setSelectedLabel(label);
    setDateFrom(from);
    setDateTo(to);
    onApply(from, to);
    setIsOpen(false);
  };

  const handleCustomApply = () => {
    setSelectedLabel("Custom");
    onApply(dateFrom, dateTo);
    setIsOpen(false);
  };

  const handleReset = () => {
    setSelectedLabel("All Time");
    setDateFrom("");
    setDateTo("");
    onApply(null, null);
    setIsOpen(false);
  };

  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg border border-[#d1d5db] bg-white px-4 py-2 text-[14px] font-medium text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-50"
      >
        <Calendar className="size-4" />
        <span>{selectedLabel}</span>
        <ChevronDown className="size-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-[#e5e7eb] bg-white shadow-lg">
          <div className="p-4">
            <div className="mb-4 space-y-2">
              <h3 className="text-sm font-semibold text-[#111111]">Quick Select</h3>
              <button
                onClick={() =>
                  handleQuickSelect("Last 7 Days", formatDate(sevenDaysAgo), formatDate(today))
                }
                className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-[#f3f4f6]"
              >
                Last 7 Days
              </button>
              <button
                onClick={() =>
                  handleQuickSelect(
                    "Last 30 Days",
                    formatDate(thirtyDaysAgo),
                    formatDate(today),
                  )
                }
                className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-[#f3f4f6]"
              >
                Last 30 Days
              </button>
              <button
                onClick={() =>
                  handleQuickSelect(
                    "Last 90 Days",
                    formatDate(ninetyDaysAgo),
                    formatDate(today),
                  )
                }
                className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-[#f3f4f6]"
              >
                Last 90 Days
              </button>
            </div>

            <div className="mb-4 border-t border-[#e5e7eb] pt-4">
              <h3 className="mb-3 text-sm font-semibold text-[#111111]">Custom Range</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[#374151]">From</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="mt-1 w-full rounded border border-[#d1d5db] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#374151]">To</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="mt-1 w-full rounded border border-[#d1d5db] px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 border-t border-[#e5e7eb] pt-4">
              <button
                onClick={handleReset}
                className="flex-1 rounded border border-[#d1d5db] px-3 py-2 text-sm font-medium text-[#374151] hover:bg-[#f3f4f6]"
              >
                Reset
              </button>
              <button
                onClick={handleCustomApply}
                className="flex-1 rounded bg-[#2563eb] px-3 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8]"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
