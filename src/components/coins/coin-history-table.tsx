"use client";

import type { CoinHistoryItem } from "@/types/coin-reward.types";
import { formatDateTime } from "@/lib/utils";

type CoinHistoryTableProps = {
  items: CoinHistoryItem[];
  loading?: boolean;
};

function typeColor(type: string) {
  const normalized = type.toLowerCase();
  if (normalized === "earned") return "text-[#16a34a]";
  if (normalized === "spent") return "text-[#ea580c]";
  return "text-[#ef4444]";
}

function formatType(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function formatDetails(details: Record<string, unknown>) {
  const entries = Object.entries(details).filter(([, value]) => value !== null && value !== undefined);
  if (entries.length === 0) return "--";
  return entries.map(([key, value]) => `${key}: ${String(value)}`).join(", ");
}

export function CoinHistoryTable({ items, loading = false }: CoinHistoryTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[750px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Amount</th>
              <th className="px-5 py-3.5">Created At</th>
              <th className="px-5 py-3.5">Expires At</th>
              <th className="px-5 py-3.5">Details</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]">
                <td className={`px-5 py-4 text-sm font-medium ${typeColor(item.transaction_type)}`}>
                  {formatType(item.transaction_type)}
                </td>
                <td className={`px-5 py-4 text-sm font-semibold ${item.amount >= 0 ? "text-[#16a34a]" : "text-[#ef4444]"}`}>
                  {item.amount >= 0 ? `+${item.amount}` : item.amount}
                </td>
                <td className="px-5 py-4 text-sm text-[#6b7280]">{formatDateTime(item.created_at)}</td>
                <td className="px-5 py-4 text-sm text-[#6b7280]">{formatDateTime(item.expires_at)}</td>
                <td className="max-w-[280px] px-5 py-4 text-sm text-[#374151]">{formatDetails(item.details)}</td>
              </tr>
            ))}
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-[#6b7280]">Loading coin history...</td></tr>
            ) : null}
            {!loading && items.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-[#6b7280]">No coin transactions found.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
