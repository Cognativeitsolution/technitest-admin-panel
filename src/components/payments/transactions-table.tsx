"use client";

import { Eye } from "lucide-react";

import { TransactionStatusBadge } from "@/components/payments/transaction-status-badge";
import type { PaymentTransaction } from "@/data/payments";

type TransactionsTableProps = {
  transactions: PaymentTransaction[];
  onViewInvoice: (tx: PaymentTransaction) => void;
};

export function TransactionsTable({
  transactions,
  onViewInvoice,
}: TransactionsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">Transaction</th>
              <th className="px-5 py-3.5">User</th>
              <th className="px-5 py-3.5">Purpose</th>
              <th className="px-5 py-3.5">Amount</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Initiated</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]"
              >
                <td className="px-5 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#2563eb]">
                      {tx.provider}
                    </span>
                    <span className="text-xs text-[#6b7280]">
                      {tx.transactionId}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm font-medium text-[#111827]">
                  {tx.userName}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {tx.purpose}
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-[#111827]">
                  {tx.currency} {tx.amount.toLocaleString()}
                </td>
                <td className="px-5 py-4">
                  <TransactionStatusBadge status={tx.status} />
                </td>
                <td className="px-5 py-4 text-sm text-[#6b7280]">
                  {tx.initiatedDate}
                </td>
                <td className="px-5 py-4">
                  <button
                    type="button"
                    aria-label="View invoice"
                    onClick={() => onViewInvoice(tx)}
                    className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#2563eb]"
                  >
                    <Eye className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-sm text-[#6b7280]"
                >
                  No transactions found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
