"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { AdminUser } from "@/data/roles";

type UsersTableProps = {
  users: AdminUser[];
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
};

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">Role Name</th>
              <th className="px-5 py-3.5">Name</th>
              <th className="px-5 py-3.5">Email Address</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]">
                <td className="px-5 py-4 text-sm font-medium text-[#374151]">{user.roleName}</td>
                <td className="px-5 py-4 text-sm font-semibold text-[#111827]">{user.name}</td>
                <td className="px-5 py-4 text-sm text-[#6b7280]">{user.email}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold ${
                    user.status === "Active" ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#f3f4f6] text-[#6b7280]"
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <button type="button" aria-label={`Edit ${user.name}`} onClick={() => onEdit(user)} className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]">
                      <Pencil className="size-4" />
                    </button>
                    <button type="button" aria-label={`Delete ${user.name}`} onClick={() => onDelete(user)} className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#fef2f2] hover:text-[#ef4444]">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-[#6b7280]">No users with assigned roles found.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
