"use client";

import type { ReferralUser } from "@/types/coin-reward.types";
import { formatDateTime } from "@/lib/utils";

type ReferralUsersTableProps = {
  users: ReferralUser[];
  loading?: boolean;
};

function statusStyle(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "complete" || normalized === "completed") return "bg-[#dcfce7] text-[#16a34a]";
  if (normalized === "pending") return "bg-[#fef3c7] text-[#d97706]";
  return "bg-[#f3f4f6] text-[#6b7280]";
}

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function ReferralUsersTable({ users, loading = false }: ReferralUsersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-200 border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">User</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Referred By</th>
              <th className="px-5 py-3.5">Joined On</th>
              <th className="px-5 py-3.5">Email Verified</th>
              <th className="px-5 py-3.5">Active</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-[#6b7280]">Loading referral users...</td></tr>
            ) : (
              <>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]">
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-[#111827]">{user.username}</span>
                        <span className="text-xs text-[#6b7280]">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle(user.referral_status)}`}>
                        {formatStatus(user.referral_status)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {user.referrer ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium text-[#111827]">{user.referrer.username}</span>
                          <span className="text-xs text-[#6b7280]">{user.referrer.email}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-[#6b7280]">--</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#6b7280]">{formatDateTime(user.join_date)}</td>
                    <td className="px-5 py-4">
                      <span className={`text-sm font-medium ${user.is_email_verified ? "text-[#16a34a]" : "text-[#ef4444]"}`}>
                        {user.is_email_verified ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-sm font-medium ${user.is_active ? "text-[#16a34a]" : "text-[#ef4444]"}`}>
                        {user.is_active ? "Yes" : "No"}
                      </span>
                    </td>
                  </tr>
                ))}
                {users.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-[#6b7280]">No referral users found.</td></tr>
                ) : null}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
