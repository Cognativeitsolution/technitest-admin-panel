"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";

import type { CoinTransaction } from "@/data/coins";

type CoinsTableProps = {
  transactions: CoinTransaction[];
  onEdit: (tx: CoinTransaction) => void;
  onDelete: (tx: CoinTransaction) => void;
};

function statusColor(status: string) {
  if (status === "Completed") return "text-[#16a34a]";
  if (status === "Expired") return "text-[#ef4444]";
  return "text-[#6b7280]";
}

function typeColor(type: string) {
  if (type === "Earned") return "text-[#16a34a]";
  if (type === "Spent") return "text-[#ea580c]";
  return "text-[#ef4444]";
}

export function CoinsTable({ transactions, onEdit, onDelete }: CoinsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">User</th>
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Count</th>
              <th className="px-5 py-3.5">Source</th>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Image src={tx.userAvatar} alt={tx.userName} width={36} height={36} className="size-9 rounded-full object-cover" />
                    <span className="text-sm font-medium text-[#111827]">{tx.userName}</span>
                  </div>
                </td>
                <td className={`px-5 py-4 text-sm font-medium ${typeColor(tx.type)}`}>{tx.type}</td>
                <td className="px-5 py-4 text-sm font-semibold text-[#111827]">{tx.count}</td>
                <td className="px-5 py-4 text-sm text-[#374151]">{tx.source}</td>
                <td className="px-5 py-4 text-sm text-[#6b7280]">{tx.date}</td>
                <td className={`px-5 py-4 text-sm font-medium ${statusColor(tx.status)}`}>{tx.status}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <button type="button" aria-label="Edit" onClick={() => onEdit(tx)} className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]">
                      <Pencil className="size-4" />
                    </button>
                    <button type="button" aria-label="Delete" onClick={() => onDelete(tx)} className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#fef2f2] hover:text-[#ef4444]">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {transactions.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-[#6b7280]">No coin transactions found.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
