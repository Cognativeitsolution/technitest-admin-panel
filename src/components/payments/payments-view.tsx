"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";

import { CheckboxDropdown } from "@/components/feedback/checkbox-dropdown";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { TransactionsTable } from "@/components/payments/transactions-table";
import { InvoiceDialog } from "@/components/payments/invoice-dialog";
import { Pagination } from "@/components/shared/pagination";
import {
  transactions as initialTransactions,
  transactionStatusOptions,
} from "@/data/payments";
import type { DateRange } from "@/components/ui/date-range-picker";
import type { PaymentTransaction } from "@/data/payments";

const PAGE_SIZE = 6;

export function PaymentsView() {
  const [transactions] = useState<PaymentTransaction[]>(initialTransactions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(2025, 6, 1),
    end: new Date(2025, 6, 31),
  });
  const [page, setPage] = useState(1);
  const [invoiceTarget, setInvoiceTarget] = useState<PaymentTransaction | null>(null);

  const filtered = useMemo(() => {
    let result = transactions;

    if (statusFilter.length > 0) {
      result = result.filter((tx) => statusFilter.includes(tx.status));
    }

    if (dateRange.start && dateRange.end) {
      result = result.filter((tx) => {
        const parts = tx.initiatedDate.split(" ");
        const day = parseInt(parts[0], 10);
        const monthMap: Record<string, number> = {
          Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
          Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
        };
        const month = monthMap[parts[1]] ?? 0;
        const year = parseInt(parts[2], 10);
        const txDate = new Date(year, month, day);
        return txDate >= dateRange.start! && txDate <= dateRange.end!;
      });
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.transactionId.toLowerCase().includes(q) ||
          tx.orderId.toLowerCase().includes(q) ||
          tx.provider.toLowerCase().includes(q) ||
          tx.userName.toLowerCase().includes(q)
      );
    }

    return result;
  }, [transactions, statusFilter, dateRange, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5">
      {/* Header */}
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
              setPage(1);
            }}
            placeholder="Search by transaction Number"
            className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-white pr-4 pl-10 text-sm text-[#374151] outline-none transition placeholder:text-[#9ca3af] focus:border-[#d1d5db] focus:ring-0"
          />
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        <CheckboxDropdown
          label="By status"
          options={transactionStatusOptions}
          selected={statusFilter}
          onChange={(values) => {
            setStatusFilter(values);
            setPage(1);
          }}
        />
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Table */}
      <TransactionsTable
        transactions={pageItems}
        onViewInvoice={setInvoiceTarget}
      />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Invoice Modal */}
      <InvoiceDialog
        open={!!invoiceTarget}
        onClose={() => setInvoiceTarget(null)}
        transaction={invoiceTarget}
      />
    </div>
  );
}
