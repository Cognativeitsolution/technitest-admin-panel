"use client";

import { useState } from "react";

import { Dialog } from "@/components/ui/dialog";
import { TextField } from "@/components/ui/text-field";
import { PermissionMatrix } from "@/components/roles/permission-matrix";
import type { PermissionGroup } from "@/lib/role-utils";
import type { CreateRolePayload } from "@/types/role.types";

type RoleDialogProps = {
  open: boolean;
  onClose: () => void;
  groups: PermissionGroup[];
  submitting?: boolean;
  onSubmit: (payload: CreateRolePayload) => Promise<boolean>;
};

export function RoleDialog({
  open,
  onClose,
  groups,
  submitting = false,
  onSubmit,
}: RoleDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setName("");
      setDescription("");
      setSelectedIds([]);
      setFormError(null);
    }
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
    if (!name.trim()) {
      setFormError("Role name is required.");
      return;
    }

    const ok = await onSubmit({
      name: name.trim(),
      description: description.trim(),
      permission_ids: selectedIds,
    });
    if (ok) onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title="Add Role" maxWidth="max-w-3xl">
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Role Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter role name"
            inputClassName="h-[48px] text-[#4b5563]"
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter role description"
            inputClassName="h-[48px] text-[#4b5563]"
          />
        </div>

        <PermissionMatrix
          groups={groups}
          selectedIds={selectedIds}
          onToggle={togglePermission}
          onToggleAll={setPermissionIds}
          title="Assign Permissions"
          disabled={submitting}
        />

        {formError ? (
          <p className="text-sm text-[#b91c1c]">{formError}</p>
        ) : null}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={submitting}
          className="inline-flex h-11 min-w-[140px] items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d99400] disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Add Role"}
        </button>
      </div>
    </Dialog>
  );
}