"use client";

import { useState } from "react";

import { Dialog } from "@/components/ui/dialog";
import type { RoleRecord } from "@/types/role.types";
import type { ApiUser } from "@/types/user.types";

const selectClassName =
  "h-[48px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0 appearance-none";

type UpdateUserRoleDialogProps = {
  open: boolean;
  onClose: () => void;
  user: ApiUser | null;
  roles: RoleRecord[];
  submitting?: boolean;
  onSubmit: (user: ApiUser, roleId: number) => Promise<boolean>;
};

export function UpdateUserRoleDialog({
  open,
  onClose,
  user,
  roles,
  submitting = false,
  onSubmit,
}: UpdateUserRoleDialogProps) {
  const [roleId, setRoleId] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open && user) {
      const currentRole = roles.find((role) => role.slug === user.roles?.[0]);
      setRoleId(currentRole ? String(currentRole.id) : "");
      setFormError(null);
    }
  }

  async function handleSave() {
    if (!user) return;

    const selectedRoleId = Number(roleId);
    if (!selectedRoleId) {
      setFormError("Please select a role.");
      return;
    }

    setFormError(null);
    const ok = await onSubmit(user, selectedRoleId);
    if (ok) onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title="Update User Role" maxWidth="max-w-md">
      <div className="space-y-5">
        <div className="space-y-1.5">
          <span className="text-sm font-medium text-[#374151]">User</span>
          <p className="rounded-xl border border-[#e5e7eb] bg-[#f8fafc] px-4 py-3 text-sm font-semibold text-[#111827]">
            {user?.username || "-"}
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="update-user-role" className="text-sm font-medium text-[#374151]">
            Role<span className="ml-0.5 text-[#ef4444]">*</span>
          </label>
          <select
            id="update-user-role"
            value={roleId}
            onChange={(event) => setRoleId(event.target.value)}
            disabled={submitting}
            className={selectClassName}
          >
            <option value="">Select role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {formError ? <p className="text-sm text-[#ef4444]">{formError}</p> : null}

        <div className="flex justify-end gap-3 pt-1">
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => void handleSave()}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
