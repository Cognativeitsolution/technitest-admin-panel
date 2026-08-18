"use client";

import { useState } from "react";

import { Dialog } from "@/components/ui/dialog";
import { PermissionMatrix } from "@/components/roles/permission-matrix";
import { permissionModules } from "@/data/roles";
import type { Role, PermissionModule, RolePermission } from "@/data/roles";

type PermissionsDialogProps = {
  open: boolean;
  onClose: () => void;
  role: Role | null;
};

export function PermissionsDialog({ open, onClose, role }: PermissionsDialogProps) {
  const [permissions, setPermissions] = useState<Record<PermissionModule, RolePermission>>(
    role?.permissions ?? Object.fromEntries(
      permissionModules.map((m) => [m, { view: false, add: false, edit: false, delete: false }])
    ) as Record<PermissionModule, RolePermission>
  );

  function handleSave() {
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title="Permissions" maxWidth="max-w-3xl">
      <div className="space-y-5">
        <PermissionMatrix permissions={permissions} onChange={setPermissions} />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white transition hover:bg-[#d99400]"
        >
          Save Permissions
        </button>
      </div>
    </Dialog>
  );
}
