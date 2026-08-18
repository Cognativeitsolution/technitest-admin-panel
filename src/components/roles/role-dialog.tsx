"use client";

import { useState } from "react";

import { Dialog } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { PermissionMatrix } from "@/components/roles/permission-matrix";
import { permissionModules } from "@/data/roles";
import type { Role, PermissionModule, RolePermission } from "@/data/roles";

type RoleDialogProps = {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  role: Role | null;
};

function emptyPermissions(): Record<PermissionModule, RolePermission> {
  return Object.fromEntries(
    permissionModules.map((m) => [m, { view: false, add: false, edit: false, delete: false }])
  ) as Record<PermissionModule, RolePermission>;
}

export function RoleDialog({ open, onClose, mode, role }: RoleDialogProps) {
  const [name, setName] = useState(role?.name ?? "");
  const [active, setActive] = useState(role ? role.status === "Active" : true);
  const [permissions, setPermissions] = useState<Record<PermissionModule, RolePermission>>(
    role?.permissions ?? emptyPermissions()
  );

  const title = mode === "create" ? "Add Role" : "Edit Role";

  function handleSave() {
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title={title} maxWidth="max-w-3xl">
      <div className="space-y-5">
        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">
            Role Name<span className="ml-0.5 text-[#ff0000]">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
            placeholder="Enter role name"
          />
        </div>

        <div className="rounded-xl border border-[#e5e7eb] px-4 py-3">
          <Switch checked={active} onCheckedChange={setActive} label="Active" />
        </div>

        <PermissionMatrix permissions={permissions} onChange={setPermissions} />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white transition hover:bg-[#d99400]"
        >
          {mode === "create" ? "Add Role" : "Save Changes"}
        </button>
      </div>
    </Dialog>
  );
}
