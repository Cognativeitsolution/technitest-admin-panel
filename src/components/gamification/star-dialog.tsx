"use client";

import { useState } from "react";

import { Dialog } from "@/components/ui/dialog";
import type { StarPayload, StarRuleRecord } from "@/types/gamification.types";

type StarDialogProps = {
  open: boolean;
  onClose: () => void;
  rule: StarRuleRecord | null;
  submitting: boolean;
  onSubmit: (payload: StarPayload) => Promise<boolean>;
};

const inputClassName =
  "h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0";

export function StarDialog({ open, onClose, rule, submitting, onSubmit }: StarDialogProps) {
  const [name, setName] = useState(rule?.name ?? "");
  const [starsCount, setStarsCount] = useState(rule ? String(rule.stars_count) : "");
  const [minPercentage, setMinPercentage] = useState(rule ? String(rule.min_percentage) : "");
  const [maxPercentage, setMaxPercentage] = useState(rule ? String(rule.max_percentage) : "");

  const title = rule ? "Edit Star Rule" : "Add Star Rule";
  const isValid =
    name.trim() !== "" &&
    starsCount !== "" &&
    minPercentage !== "" &&
    maxPercentage !== "";

  async function handleSave() {
    if (!isValid) return;
    const payload: StarPayload = {
      name: name.trim(),
      stars_count: Number(starsCount),
      min_percentage: Number(minPercentage),
      max_percentage: Number(maxPercentage),
    };
    const success = await onSubmit(payload);
    if (success) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-5">
        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">
            Name<span className="ml-0.5 text-[#ff0000]">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClassName}
            placeholder="Enter star name"
          />
        </div>

        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">
            Star Count<span className="ml-0.5 text-[#ff0000]">*</span>
          </label>
          <input
            type="number"
            min={0}
            value={starsCount}
            onChange={(e) => setStarsCount(e.target.value)}
            className={inputClassName}
            placeholder="Enter star count"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-[10px]">
            <label className="text-[14px] font-medium text-[#111111]">
              Min %<span className="ml-0.5 text-[#ff0000]">*</span>
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={minPercentage}
              onChange={(e) => setMinPercentage(e.target.value)}
              className={inputClassName}
              placeholder="e.g. 80"
            />
          </div>
          <div className="flex flex-col gap-[10px]">
            <label className="text-[14px] font-medium text-[#111111]">
              Max %<span className="ml-0.5 text-[#ff0000]">*</span>
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={maxPercentage}
              onChange={(e) => setMaxPercentage(e.target.value)}
              className={inputClassName}
              placeholder="e.g. 95"
            />
          </div>
        </div>

        {rule ? (
          <p className="text-[13px] text-[#6b7280]">
            Current criteria: <span className="font-semibold text-[#374151]">{rule.criteria}</span>
          </p>
        ) : null}
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
          disabled={submitting || !isValid}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:pointer-events-none disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </Dialog>
  );
}
