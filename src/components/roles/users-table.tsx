"use client";

import { Pencil, Trash2, UserRound } from "lucide-react";

import { EmptyState } from "@/components/roles/empty-state";
import { initials } from "@/components/roles/role-badge";
import type { AdminUser } from "@/data/roles";

type UsersTableProps = {
  users: AdminUser[];
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
};

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#eef1f6] px-5 py-4">
        <div>
          <h2 className="text-[15px] font-bold text-[#111827]">Assigned Users</h2>
          <p className="text-xs text-[#9ca3af]">
            Admins with at least one assigned role
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold text-[#2563eb]">
          <UserRound className="size-3.5" />
          {users.length} user{users.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">User</th>
              <th className="px-5 py-3.5">Role</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#eef5ff] text-xs font-bold text-[#2563eb]">
                      {initials(user.name)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#111827]">
                        {user.name}
                      </p>
                      <p className="text-sm text-[#6b7280]">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center rounded-full bg-[#f3f4f6] px-3 py-1 text-xs font-semibold text-[#374151]">
                    {user.roleName}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold ${
                      user.status === "Active"
                        ? "bg-[#dcfce7] text-[#16a34a]"
                        : "bg-[#f3f4f6] text-[#6b7280]"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      aria-label={`Edit ${user.name}`}
                      onClick={() => onEdit(user)}
                      className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${user.name}`}
                      onClick={() => onDelete(user)}
                      className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#fef2f2] hover:text-[#ef4444]"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 ? (
              <EmptyState
                icon={UserRound}
                title="No users found"
                description={`No users match the current filter.`}
              />
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}