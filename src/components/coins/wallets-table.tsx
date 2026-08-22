"use client";

import { History } from "lucide-react";

import type { AdminWallet } from "@/types/coin-reward.types";

type WalletsTableProps = {
  wallets: AdminWallet[];
  loading?: boolean;
  onViewHistory: (wallet: AdminWallet) => void;
};

export function WalletsTable({ wallets, loading = false, onViewHistory }: WalletsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">User</th>
              <th className="px-5 py-3.5">Total Coins</th>
              <th className="px-5 py-3.5">Remaining Balance</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((wallet) => (
              <tr key={wallet.id} className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]">
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-[#111827]">{wallet.user.username}</span>
                    <span className="text-xs text-[#6b7280]">{wallet.user.email}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-[#111827]">{wallet.total_coin}</td>
                <td className="px-5 py-4 text-sm font-semibold text-[#111827]">{wallet.remaining_balance}</td>
                <td className="px-5 py-4">
                  <button
                    type="button"
                    aria-label="View history"
                    onClick={() => onViewHistory(wallet)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[#2563eb] transition hover:bg-[#eff6ff]"
                  >
                    <History className="size-4" />
                    View History
                  </button>
                </td>
              </tr>
            ))}
            {loading ? (
              <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-[#6b7280]">Loading wallets...</td></tr>
            ) : null}
            {!loading && wallets.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-[#6b7280]">No wallets found.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
