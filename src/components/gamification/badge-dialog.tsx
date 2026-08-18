"use client";

import { useState } from "react";

import { Dialog } from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import { Switch } from "@/components/ui/switch";
import type { GamificationBadge, PercentageRange } from "@/data/gamification";
import { percentageRangeOptions } from "@/data/gamification";

type BadgeDialogProps = {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  badge: GamificationBadge | null;
};

export function BadgeDialog({ open, onClose, mode, badge }: BadgeDialogProps) {
  const [name, setName] = useState(badge?.name ?? "");
  const [range, setRange] = useState<PercentageRange>(badge?.range ?? "95 to 100");
  const [autoAssign, setAutoAssign] = useState(badge?.autoAssign ?? false);

  const title = mode === "create" ? "Add Badge" : "Edit Badges";

  function handleSave() {
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-5">
        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">
            Badge Name<span className="ml-0.5 text-[#ff0000]">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
            placeholder="Enter badge name"
          />
        </div>

        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">
            % Range<span className="ml-0.5 text-[#ff0000]">*</span>
          </label>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as PercentageRange)}
            className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
          >
            {percentageRangeOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <FileUpload
          label="Badge Icon"
          required
          helperText="Supported Formats: PNG, JPG, JPEG. Max File Size: 2 MB."
        />

        <div className="rounded-xl border border-[#e5e7eb] px-4 py-3">
          <Switch
            checked={autoAssign}
            onCheckedChange={setAutoAssign}
            label="Assign to users automatically?"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white transition hover:bg-[#d99400]"
        >
          Save Changes
        </button>
      </div>
    </Dialog>
  );
}
