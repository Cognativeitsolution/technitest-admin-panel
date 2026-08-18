"use client";

import { Pencil, Trash2 } from "lucide-react";

import type { ReferralRecord } from "@/data/coins";

type ReferralsTableProps = {
  referrals: ReferralRecord[];
  onEdit: (r: ReferralRecord) => void;
  onDelete: (r: ReferralRecord) => void;
};

function statusStyle(status: string) {
  switch (status) {
    case "Successful": return "text-[#16a34a]";
    case "Pending": return "text-[#d97706]";
    case "Accepted": return "text-[#2563eb]";
    case "Rejected": return "text-[#ef4444]";
    case "Expired": return "text-[#9ca3af]";
    default: return "text-[#6b7280]";
  }
}

export function ReferralsTable({ referrals, onEdit, onDelete }: ReferralsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[750px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">Referrer</th>
              <th className="px-5 py-3.5">Referred User</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Amount</th>
              <th className="px-5 py-3.5">Joined On</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map((r) => (
              <tr key={r.id} className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]">
                <td className="px-5 py-4 text-sm font-medium text-[#111827]">{r.referrerName}</td>
                <td className="px-5 py-4 text-sm text-[#374151]">{r.referredUsers.join(", ")}</td>
                <td className={`px-5 py-4 text-sm font-medium ${statusStyle(r.status)}`}>{r.status}</td>
                <td className="px-5 py-4 text-sm font-semibold text-[#111827]">
                  {r.amount !== null ? `+${r.amount}` : "--"}
                </td>
                <td className="px-5 py-4 text-sm text-[#6b7280]">{r.joinedOn}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <button type="button" aria-label="Edit" onClick={() => onEdit(r)} className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]">
                      <Pencil className="size-4" />
                    </button>
                    <button type="button" aria-label="Delete" onClick={() => onDelete(r)} className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#fef2f2] hover:text-[#ef4444]">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {referrals.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-[#6b7280]">No referrals found.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
