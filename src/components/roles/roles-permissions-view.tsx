"use client";

import { useState } from "react";
import { Plus, RefreshCw, ShieldAlert, ShieldCheck } from "lucide-react";

import { Dialog } from "@/components/ui/dialog";
import { RolesTable } from "@/components/roles/roles-table";
import { RoleDialog } from "@/components/roles/role-dialog";
import { PermissionsDialog } from "@/components/roles/permissions-dialog";
import { RolesPageHeader } from "@/components/roles/page-header";
import { useRoles } from "@/hooks/roles/use-roles";
import type { RoleRecord } from "@/types/role.types";

export function RolesPermissionsView() {
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);

  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [permissionsDialogTarget, setPermissionsDialogTarget] = useState<RoleRecord | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<RoleRecord | null>(null);

  const {
    roles,
    groups,
    loading,
    error,
    mutating,
    refresh,
    createRole,
    updateRolePermissions,
    deleteRole,
  } = useRoles();

  function openPermissions(role: RoleRecord) {
    setPermissionsDialogTarget(role);
    setPermissionsDialogOpen(true);
  }

  function closePermissionsDialog() {
    setPermissionsDialogOpen(false);
    setPermissionsDialogTarget(null);
  }

  async function handleDeleteRole() {
    if (!deleteTarget) return;
    const ok = await deleteRole(deleteTarget.id);
    if (ok) setDeleteTarget(null);
  }

  return (
    <div className="space-y-5">
      <RolesPageHeader
        title="Roles & Permissions"
        description="Create custom roles and control exactly what each admin can access and do across the platform."
        actions={
          <button
            type="button"
            onClick={() => setRoleDialogOpen(true)}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d99400]"
          >
            <Plus className="size-4" />
            Add Role
          </button>
        }
      />

      {error ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
          <span className="flex items-center gap-2">
            <ShieldAlert className="size-4 shrink-0" />
            {error}
          </span>
          <button
            type="button"
            onClick={refresh}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#b91c1c] transition hover:bg-[#fee2e2]"
          >
            <RefreshCw className="size-3.5" />
            Retry
          </button>
        </div>
      ) : null}

      {!error && loading && roles.length === 0 ? (
        <div className="flex items-center gap-3 rounded-2xl border border-[#e8ecf2] bg-white p-6 text-sm text-[#6b7280]">
          <ShieldCheck className="size-5 animate-pulse text-[#f0a500]" />
          Loading roles...
        </div>
      ) : null}

      {!error && !loading ? (
        <RolesTable
          roles={roles}
          loading={loading}
          onEdit={openPermissions}
          onDelete={setDeleteTarget}
        />
      ) : null}

      {/* Delete Confirmation */}
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete Role"
        maxWidth="max-w-sm"
      >
        <p className="text-sm text-[#4b5563]">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[#111827]">{deleteTarget?.name}</span>?
          Admins assigned to this role will lose its access. This action cannot be
          undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            disabled={mutating}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteRole}
            disabled={mutating}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#ef4444] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#dc2626] disabled:opacity-50"
          >
            {mutating ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Dialog>

      {/* Role Dialog */}
      <RoleDialog
        open={roleDialogOpen}
        onClose={() => setRoleDialogOpen(false)}
        groups={groups}
        submitting={mutating}
        onSubmit={createRole}
      />

      {/* Permissions Dialog */}
      <PermissionsDialog
        open={permissionsDialogOpen}
        onClose={closePermissionsDialog}
        role={permissionsDialogTarget}
        groups={groups}
        submitting={mutating}
        onSubmit={updateRolePermissions}
      />
    </div>
  );
}