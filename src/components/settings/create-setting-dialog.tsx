"use client";

import { useState } from "react";

import { Dialog } from "@/components/ui/dialog";
import type { CreateSettingPayload } from "@/types/setting.types";

type CreateSettingDialogProps = {
  open: boolean;
  onClose: () => void;
  submitting: boolean;
  onSubmit: (payload: CreateSettingPayload) => Promise<boolean>;
};

const inputClassName =
  "h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-[#f8fafc] px-5 text-[15px] text-[#4b5563] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:ring-0";

export function CreateSettingDialog({
  open,
  onClose,
  submitting,
  onSubmit,
}: CreateSettingDialogProps) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("active");
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [deletable, setDeletable] = useState(true);

  const isValid = key.trim() !== "" && value.trim() !== "";

  function resetForm() {
    setKey("");
    setValue("");
    setStatus("active");
    setIsEncrypted(false);
    setDeletable(true);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleSubmit() {
    if (!isValid) return;
    const success = await onSubmit({
      key: key.trim(),
      value: value.trim(),
      status,
      is_image: false,
      is_encrypted: isEncrypted,
      deletable,
    });
    if (success) {
      resetForm();
      onClose();
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} title="Create Setting" maxWidth="max-w-lg">
      <div className="space-y-5">
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-[#111111]">
            Key<span className="ml-0.5 text-[#ff0000]">*</span>
          </label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className={inputClassName}
            placeholder="e.g. footer_text"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-[#111111]">
            Value<span className="ml-0.5 text-[#ff0000]">*</span>
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={inputClassName}
            placeholder="Enter setting value"
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-[#374151]">
            <input
              type="checkbox"
              checked={isEncrypted}
              onChange={(e) => setIsEncrypted(e.target.checked)}
              className="size-4 rounded border-[#d1d5db]"
            />
            Encrypted
          </label>
          <label className="flex items-center gap-2 text-sm text-[#374151]">
            <input
              type="checkbox"
              checked={deletable}
              onChange={(e) => setDeletable(e.target.checked)}
              className="size-4 rounded border-[#d1d5db]"
            />
            Deletable
          </label>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={handleClose}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={submitting || !isValid}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:opacity-60"
        >
          {submitting ? "Creating..." : "Create Setting"}
        </button>
      </div>
    </Dialog>
  );
}
