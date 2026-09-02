"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Dialog } from "@/components/ui/dialog";
import type { SettingRecord, UpdateSettingPayload } from "@/types/setting.types";

type SettingEditDialogProps = {
  open: boolean;
  onClose: () => void;
  setting: SettingRecord | null;
  loading: boolean;
  submitting: boolean;
  onSave: (settingId: number, payload: UpdateSettingPayload) => Promise<boolean>;
  onDelete: (settingId: number) => Promise<boolean>;
};

const inputClassName =
  "h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-[#f8fafc] px-5 text-[15px] text-[#4b5563] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:ring-0";

export function SettingEditDialog({
  open,
  onClose,
  setting,
  loading,
  submitting,
  onSave,
  onDelete,
}: SettingEditDialogProps) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("active");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (!setting) return;
    setValue(setting.value ?? "");
    setStatus(setting.is_active === false ? "inactive" : (setting.status ?? "active"));
  }, [setting]);

  async function handleSave() {
    if (!setting) return;
    const isActive = status === "active";
    const success = await onSave(setting.id, {
      value,
      status,
      is_active: isActive,
      is_image: setting.is_image,
      is_encrypted: setting.is_encrypted,
    });
    if (success) onClose();
  }

  async function handleDeleteConfirm() {
    if (!setting?.deletable) return;
    const success = await onDelete(setting.id);
    if (success) {
      setDeleteConfirmOpen(false);
      onClose();
    }
  }

  useEffect(() => {
    if (!open) setDeleteConfirmOpen(false);
  }, [open]);

  return (
    <>
      <Dialog open={open} onClose={onClose} title="Edit Setting" maxWidth="max-w-lg">
        {loading || !setting ? (
          <div className="flex min-h-[180px] items-center justify-center gap-3 text-[#6b7280]">
            <Loader2 className="size-5 animate-spin text-[#2563eb]" />
            <span>Loading setting...</span>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#111111]">Key</label>
              <input
                type="text"
                value={setting.key}
                readOnly
                className={`${inputClassName} cursor-not-allowed bg-[#f3f4f6] text-[#6b7280]`}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#111111]">Value</label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={inputClassName}
                placeholder="Enter value"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#111111]">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={inputClassName}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {setting.updator ? (
              <p className="text-xs text-[#6b7280]">
                Last updated by {setting.updator.username} ({setting.updator.email})
              </p>
            ) : null}
          </div>
        )}

        {!loading && setting ? (
          <div className="mt-6 flex flex-wrap justify-between gap-3">
            <div>
              {setting.deletable ? (
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(true)}
                  disabled={submitting}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#fee2e2] bg-[#fef2f2] px-5 text-sm font-semibold text-[#ef4444] transition hover:bg-[#fee2e2] disabled:opacity-60"
                >
                  Delete Setting
                </button>
              ) : null}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={submitting}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        ) : null}
      </Dialog>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete Setting"
        maxWidth="max-w-md"
      >
        <p className="text-[15px] text-[#4b5563]">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[#111827]">
            {setting?.key ?? "this setting"}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeleteConfirmOpen(false)}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleDeleteConfirm()}
            disabled={submitting}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#ef4444] px-5 text-sm font-semibold text-white transition hover:bg-[#dc2626] disabled:opacity-60"
          >
            {submitting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Dialog>
    </>
  );
}
