"use client";

import { useState } from "react";

import { Dialog } from "@/components/ui/dialog";
import { Can } from "@/components/shared/can";
import { PermissionMatrix } from "@/components/roles/permission-matrix";
import type { PermissionGroup } from "@/lib/role-utils";
import type { RoleRecord } from "@/types/role.types";

type PermissionsDialogProps = {
  open: boolean;
  onClose: () => void;
  role: RoleRecord | null;
  groups: PermissionGroup[];
  submitting?: boolean;
  onSubmit: (roleId: number, permissionIds: number[]) => Promise<boolean>;
};

export function PermissionsDialog({
  open,
  onClose,
  role,
  groups,
  submitting = false,
  onSubmit,
}: PermissionsDialogProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [prevRole, setPrevRole] = useState<RoleRecord | null>(role);

  if (open && role !== prevRole) {
    setPrevRole(role);
    setSelectedIds(role ? role.permissions.map((p) => p.id) : []);
  }

  function togglePermission(permissionId: number) {
    setSelectedIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  }

  function setPermissionIds(ids: number[]) {
    setSelectedIds(ids);
  }

  async function handleSave() {
    if (!role) return;
    const ok = await onSubmit(role.id, selectedIds);
    if (ok) onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Edit Permissions"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-[#eef1f6] bg-[#f9fafb] px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-[#111827]">{role?.name}</p>
            <p className="text-xs text-[#6b7280]">
              {role?.description || "No description"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPermissionIds([])}
            disabled={submitting}
            className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#2563eb] transition hover:bg-[#eef5ff] disabled:opacity-50"
          >
            Clear all
          </button>
        </div>

        <PermissionMatrix
          groups={groups}
          selectedIds={selectedIds}
          onToggle={togglePermission}
          onToggleAll={setPermissionIds}
          title="Role Permissions"
          disabled={submitting}
        />
      </div>

      <div className="mt-6 flex justify-end gap-3 border-t border-[#eef1f6] pt-5">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-50"
        >
          Cancel
        </button>
        <Can permission="role:update">
          <button
            type="button"
            onClick={handleSave}
            disabled={submitting}
            className="inline-flex h-11 min-w-40 items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d99400] disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Permissions"}
          </button>
        </Can>
      </div>
    </Dialog>
  );
}