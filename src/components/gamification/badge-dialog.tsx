"use client";

import { useState } from "react";

import { Dialog } from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import type { BadgePayload, BadgeRule } from "@/types/gamification.types";
import { badgeTypeOptions, difficultyLevelOptions } from "@/types/gamification.types";
import { DropdownMenu } from "@/components/shared/dropdown-menu";

type BadgeDialogProps = {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  badge: BadgeRule | null;
  submitting: boolean;
  onSubmit: (payload: BadgePayload, image: File | null) => Promise<boolean>;
};

const inputClassName =
  "h-[54px] w-full rounded-2.5 border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0 capitalize";

const dropdownClassName =
  "w-full [&>button]:h-[54px] [&>button]:w-full [&>button]:justify-between [&>button]:rounded-2.5 [&>button]:border-[#ebebeb] [&>button]:px-5 [&>button]:text-[15px] [&>button]:font-normal [&>button]:capitalize [&>button]:shadow-[0_2px_10px_rgba(16,24,40,0.06)]";

export function BadgeDialog({ open, onClose, mode, badge, submitting, onSubmit }: BadgeDialogProps) {
  const [name, setName] = useState(badge?.badge_name ?? "");
  const [difficultyLevel, setDifficultyLevel] = useState(badge?.difficulty_level ?? difficultyLevelOptions[0]);
  const [type, setType] = useState(badge?.type ?? badgeTypeOptions[0]);
  const [price, setPrice] = useState(badge ? String(badge.price) : "0");
  const [validityYears, setValidityYears] = useState(badge ? String(badge.validity_years) : "1");
  const [image, setImage] = useState<File | null>(null);

  const title = mode === "create" ? "Add Badge" : "Edit Badge";

  async function handleSave() {
    if (!name.trim()) {
      return;
    }
    const payload: BadgePayload = {
      badge_name: name.trim(),
      difficulty_level: difficultyLevel,
      type,
      price: type === "free" ? 0 : Number(price) || 0,
      validity_years: Number(validityYears) || 1,
    };
    const success = await onSubmit(payload, image);
    if (success) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-5">
        <div className="flex flex-col gap-2.5">
          <label className="text-[14px] font-medium text-[#111111]">
            Badge Name<span className="ml-0.5 text-[#ff0000]">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClassName}
            placeholder="Enter badge name"
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-[14px] font-medium text-[#111111]">
            Difficulty Level<span className="ml-0.5 text-[#ff0000]">*</span>
          </label>
          <DropdownMenu
            label="Difficulty Level"
            options={difficultyLevelOptions}
            value={difficultyLevel}
            onChange={setDifficultyLevel}
            className={dropdownClassName}
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-[14px] font-medium text-[#111111]">
            Type<span className="ml-0.5 text-[#ff0000]">*</span>
          </label>
          <DropdownMenu
            label="Type"
            options={badgeTypeOptions}
            value={type}
            onChange={setType}
            className={dropdownClassName}
          />
        </div>

        {type !== "free" && <div className="flex flex-col gap-2.5">
          <label className="text-[14px] font-medium text-[#111111]">Price ($)</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={type === "free"}
            className={`${inputClassName} disabled:bg-[#f9fafb] disabled:text-[#6b7280]`}
            placeholder="Enter price"
          />
        </div>}

        <div className="flex flex-col gap-2.5">
          <label className="text-[14px] font-medium text-[#111111]">
            Validity (Years)<span className="ml-0.5 text-[#ff0000]">*</span>
          </label>
          <input
            type="number"
            min={1}
            value={validityYears}
            onChange={(e) => setValidityYears(e.target.value)}
            className={inputClassName}
            placeholder="Enter validity in years"
          />
        </div>

        <FileUpload
          label="Badge Image"
          helperText="Supported Formats: PNG, JPG, JPEG. Max File Size: 2 MB."
          onChange={setImage}
        />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={submitting || !name.trim()}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:pointer-events-none disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </Dialog>
  );
}
