"use client";

import { Lock, Pencil, ShieldCheck, Trash2 } from "lucide-react";

import { Can } from "@/components/shared/can";
import { EmptyState } from "@/components/roles/empty-state";
import { RoleBadge } from "@/components/roles/role-badge";
import type { RoleRecord } from "@/types/role.types";

type RolesTableProps = {
  roles: RoleRecord[];
  loading?: boolean;
  onEdit: (role: RoleRecord) => void;
  onDelete: (role: RoleRecord) => void;
};

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <tr key={index} className="border-t border-[#eef1f6]">
          <td colSpan={4} className="px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="size-9 animate-pulse rounded-xl bg-[#eef1f6]" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-36 animate-pulse rounded-md bg-[#eef1f6]" />
                <div className="h-3 w-52 animate-pulse rounded-md bg-[#f3f5f8]" />
              </div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

export function RolesTable({
  roles,
  loading = false,
  onEdit,
  onDelete,
}: RolesTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#eef1f6] px-5 py-4">
        <div>
          <h2 className="text-[15px] font-bold text-[#111827]">All Roles</h2>
          <p className="text-xs text-[#9ca3af]">
            Roles control what each admin can access and do
          </p>
        </div>
        {!loading ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold text-[#2563eb]">
            <ShieldCheck className="size-3.5" />
            {roles.length} role{roles.length === 1 ? "" : "s"}
          </span>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-190 border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">Role</th>
              <th className="px-5 py-3.5">Description</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Permissions</th>
              <th className="px-5 py-3.5 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <LoadingRows /> : null}

            {!loading
              ? roles.map((role) => (
                  <tr
                    key={role.id}
                    className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <RoleBadge name={role.name} />
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-[#111827]">
                            {role.name}
                          </span>
                          {role.is_superuser ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#fef3c7] px-2 py-0.5 text-[11px] font-semibold text-[#d97706]">
                              <Lock className="size-3" />
                              Super Admin
                            </span>
                          ) : null}
                          {role.is_system && !role.is_superuser ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#eef5ff] px-2 py-0.5 text-[11px] font-semibold text-[#2563eb]">
                              <ShieldCheck className="size-3" />
                              System
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="line-clamp-2 max-w-xs text-sm text-[#6b7280]">
                        {role.description || "No description provided"}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="inline-flex h-7 shrink-0 whitespace-nowrap items-center rounded-full bg-[#f3f4f6] px-3 text-xs font-semibold text-[#374151]">
                        {role.permissions.length} permission
                        {role.permissions.length === 1 ? "" : "s"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Can permission="role:update">
                          <button
                            type="button"
                            aria-label={`Edit permissions for ${role.name}`}
                            onClick={() => onEdit(role)}
                            className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]"
                          >
                            <Pencil className="size-4" />
                          </button>
                        </Can>
                        <Can permission="role:delete">
                          <button
                            type="button"
                            aria-label={`Delete ${role.name}`}
                            onClick={() => onDelete(role)}
                            className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#fef2f2] hover:text-[#ef4444]"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </Can>
                      </div>
                    </td>
                  </tr>
                ))
              : null}

            {!loading && roles.length === 0 ? (
              <EmptyState
                icon={ShieldCheck}
                title="No roles found"
                description="Create a new role to start managing access."
              />
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}