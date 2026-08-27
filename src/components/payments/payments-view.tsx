"use client";

import { useState, useCallback, useMemo } from "react";
import { Search, Loader2 } from "lucide-react";

import { CheckboxDropdown } from "@/components/feedback/checkbox-dropdown";
import { TransactionsTable } from "@/components/payments/transactions-table";
import { InvoiceDialog } from "@/components/payments/invoice-dialog";
import { Pagination } from "@/components/shared/pagination";
import {
  DateRangePicker,
  type DateRange,
} from "@/components/ui/date-range-picker";
import {
  useTransactions,
  useTransactionReceipt,
} from "@/hooks/payment/use-transactions";
import { useTransactionFilterOptions } from "@/hooks/payment/use-transaction-filter-options";
import type { TransactionRecord } from "@/types/payment.types";

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function matchesDateRange(value: string | null, range: DateRange) {
  if (!range.start && !range.end) return true;
  if (!value) return false;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return false;

  const time = new Date(
    parsed.getFullYear(),
    parsed.getMonth(),
    parsed.getDate(),
  ).getTime();

  if (range.start) {
    const startTime = new Date(
      range.start.getFullYear(),
      range.start.getMonth(),
      range.start.getDate(),
    ).getTime();
    if (time < startTime) return false;
  }

  if (range.end) {
    const endTime = new Date(
      range.end.getFullYear(),
      range.end.getMonth(),
      range.end.getDate(),
    ).getTime();
    if (time > endTime) return false;
  }

  return true;
}

export function PaymentsView() {
  const { statuses } = useTransactionFilterOptions();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [receiptTarget, setReceiptTarget] = useState<TransactionRecord | null>(
    null,
  );

  const dateFrom =
    dateRange.start && dateRange.end ? toIsoDate(dateRange.start) : undefined;
  const dateTo =
    dateRange.start && dateRange.end ? toIsoDate(dateRange.end) : undefined;

  const { items, pagination, loading, error, goToPage } = useTransactions({
    status: statusFilter,
    dateFrom,
    dateTo,
  });
  const {
    receipt,
    loading: receiptLoading,
    fetchReceipt,
    clearReceipt,
  } = useTransactionReceipt();

  const handleViewReceipt = useCallback(
    (tx: TransactionRecord) => {
      setReceiptTarget(tx);
      fetchReceipt(tx.id);
    },
    [fetchReceipt],
  );

  const handleCloseReceipt = useCallback(() => {
    setReceiptTarget(null);
    clearReceipt();
  }, [clearReceipt]);

  const filtered = useMemo(() => {
    return items.filter((tx) => {
      if (statusFilter.length > 0) {
        const selected = statusFilter.map((status) => status.toLowerCase());
        if (!selected.includes(tx.status.toLowerCase())) return false;
      }
      if (!matchesDateRange(tx.created_at, dateRange)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          String(tx.id).includes(q) ||
          tx.provider.toLowerCase().includes(q) ||
          (tx.provider_reference ?? "").toLowerCase().includes(q) ||
          String(tx.user_id).includes(q)
        );
      }
      return true;
    });
  }, [items, statusFilter, dateRange, search]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
          Payment & Transactions
        </h1>
        <div className="relative w-full max-w-[320px]">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#9ca3af]" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              goToPage(1);
            }}
            placeholder="Search by ID, provider, reference..."
            className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-white pr-4 pl-10 text-sm text-[#374151] outline-none transition placeholder:text-[#9ca3af] focus:border-[#d1d5db] focus:ring-0"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <CheckboxDropdown
          label="By status"
          options={statuses}
          selected={statusFilter}
          onChange={(values) => {
            setStatusFilter(values);
            goToPage(1);
          }}
        />
        <DateRangePicker
          placeholder="Date"
          value={dateRange}
          onChange={(range) => {
            setDateRange(range);
            if ((range.start && range.end) || (!range.start && !range.end)) {
              goToPage(1);
            }
          }}
        />
      </div>

      {error && (
        <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#ef4444]">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-[#2563eb]" />
          <span className="ml-2 text-sm text-[#6b7280]">
            Loading transactions...
          </span>
        </div>
      )}

      {!loading && (
        <TransactionsTable
          transactions={filtered}
          onViewReceipt={handleViewReceipt}
        />
      )}

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={goToPage}
        />
      )}

      <InvoiceDialog
        open={!!receiptTarget}
        onClose={handleCloseReceipt}
        transaction={receiptTarget}
        receipt={receipt}
        loading={receiptLoading}
      />
    </div>
  );
}
