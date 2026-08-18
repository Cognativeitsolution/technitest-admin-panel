"use client";

import { useState } from "react";

import { Dialog } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import type { AdminUser } from "@/data/roles";

type UserDialogProps = {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  user: AdminUser | null;
  roleNames: string[];
};

export function UserDialog({ open, onClose, mode, user, roleNames }: UserDialogProps) {
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [roleName, setRoleName] = useState(user?.roleName ?? roleNames[0] ?? "");
  const [active, setActive] = useState(user ? user.status === "Active" : true);

  const title = mode === "create" ? "Create User" : "Edit User";

  function handleSave() {
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">
            Username<span className="ml-0.5 text-[#ff0000]">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
            placeholder="Enter username"
          />
        </div>

        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">
            Email Address<span className="ml-0.5 text-[#ff0000]">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={mode === "edit"}
            className={`h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0 ${
              mode === "edit" ? "text-[#6b7280]" : "text-[#4b5563]"
            }`}
            placeholder="Enter email"
          />
        </div>

        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">
            Role Name<span className="ml-0.5 text-[#ff0000]">*</span>
          </label>
          <select
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
          >
            {roleNames.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border border-[#e5e7eb] px-4 py-3">
          <Switch checked={active} onCheckedChange={setActive} label="Active" />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white transition hover:bg-[#d99400]"
        >
          {mode === "create" ? "Save User" : "Save Changes"}
        </button>
      </div>
    </Dialog>
  );
}
