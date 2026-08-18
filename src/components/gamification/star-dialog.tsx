"use client";

import { useState } from "react";

import { Dialog } from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import type { StarRule } from "@/data/gamification";
import { starRangeOptions } from "@/data/gamification";

type StarDialogProps = {
  open: boolean;
  onClose: () => void;
  rule: StarRule | null;
};

export function StarDialog({ open, onClose, rule }: StarDialogProps) {
  const [range, setRange] = useState(rule?.range ?? "90+");

  return (
    <Dialog open={open} onClose={onClose} title="Edit Stars" maxWidth="max-w-md">
      <div className="space-y-5">
        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">Star Count</label>
          <input
            type="text"
            value={rule ? `${rule.starCount} Stars` : ""}
            readOnly
            className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-[#f9fafb] px-5 text-[15px] text-[#6b7280] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none"
          />
        </div>

        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">
            % Range<span className="ml-0.5 text-[#ff0000]">*</span>
          </label>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
          >
            {starRangeOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <FileUpload
          label="Star Icon"
          helperText="Supported Formats: PNG, JPG, JPEG. Max File Size: 2 MB."
        />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white transition hover:bg-[#d99400]"
        >
          Save Changes
        </button>
      </div>
    </Dialog>
  );
}
