"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Role } from "@/data/roles";

type RolesTableProps = {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
};

export function RolesTable({ roles, onEdit, onDelete }: RolesTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">Role Name</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id} className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]">
                <td className="px-5 py-4 text-sm font-semibold text-[#111827]">{role.name}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold ${
                    role.status === "Active" ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#f3f4f6] text-[#6b7280]"
                  }`}>
                    {role.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <button type="button" aria-label={`Edit ${role.name}`} onClick={() => onEdit(role)} className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]">
                      <Pencil className="size-4" />
                    </button>
                    <button type="button" aria-label={`Delete ${role.name}`} onClick={() => onDelete(role)} className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#fef2f2] hover:text-[#ef4444]">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {roles.length === 0 ? (
              <tr><td colSpan={3} className="px-5 py-10 text-center text-sm text-[#6b7280]">No roles found.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
