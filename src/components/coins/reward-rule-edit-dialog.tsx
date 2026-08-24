"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  REWARD_CONDITION_OPTIONS,
  REWARD_TYPE_LABELS,
  formatRewardTypeLabel,
  isCoinExpiryRule,
  type RewardCondition,
  type RewardRule,
  type RewardType,
  type UpdateRewardRulePayload,
} from "@/types/reward-rule.types";

const inputClassName =
  "h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#f8fafc] px-3.5 text-sm font-medium text-[#111827] outline-none transition focus:border-[#3b82f6] focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/20";

type RewardRuleEditDialogProps = {
  open: boolean;
  rule: RewardRule | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (payload: UpdateRewardRulePayload) => Promise<boolean>;
};

export function RewardRuleEditDialog({
  open,
  rule,
  submitting,
  onClose,
  onSubmit,
}: RewardRuleEditDialogProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [condition, setCondition] = useState<RewardCondition | "">("");

  const isExpiry = rule ? isCoinExpiryRule(rule) : false;

  useEffect(() => {
    if (!open || !rule) return;
    setDescription(rule.description ?? "");
    setAmount(String(isCoinExpiryRule(rule) ? rule.coin_expiry || rule.coins : rule.coins));
    setCondition(rule.condition ?? "");
  }, [open, rule]);

  const parsedAmount = Number(amount);
  const isValid =
    Boolean(rule) &&
    description.trim() !== "" &&
    amount !== "" &&
    Number.isFinite(parsedAmount) &&
    parsedAmount >= 0 &&
    (isExpiry || condition !== "");

  async function handleSave() {
    if (!rule || !isValid) return;

    const payload: UpdateRewardRulePayload = isExpiry
      ? {
          description: description.trim(),
          coins: parsedAmount,
          condition: rule.condition || "every_time",
          coin_expiry: parsedAmount,
          is_active: rule.is_active,
        }
      : {
          description: description.trim(),
          coins: parsedAmount,
          condition: condition as RewardCondition,
          coin_expiry: rule.coin_expiry,
          is_active: rule.is_active,
        };

    const success = await onSubmit(payload);
    if (success) onClose();
  }

  const typeOptions = Object.entries(REWARD_TYPE_LABELS) as [RewardType, string][];
  const currentType = rule?.reward_type ?? "";
  const hasCurrentType = typeOptions.some(([value]) => value === currentType);

  return (
    <Dialog open={open} onClose={onClose} title="Edit Reward Rules" maxWidth="max-w-md">
      <div className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-[#374151]">Reward Type</span>
          <div className="relative">
            <select
              value={currentType}
              disabled
              className={cn(
                inputClassName,
                "appearance-none pr-10 disabled:cursor-not-allowed disabled:opacity-100 disabled:text-[#111827]",
              )}
            >
              {!hasCurrentType ? (
                <option value={currentType}>{formatRewardTypeLabel(currentType)}</option>
              ) : null}
              {typeOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9ca3af]" />
          </div>
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-[#374151]">Description</span>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClassName}
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-[#374151]">{isExpiry ? "Days" : "Coins"}</span>
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClassName}
          />
        </label>

        {isExpiry ? null : (
          <fieldset className="space-y-2.5">
            <legend className="text-sm font-medium text-[#374151]">Conditions</legend>
            <div className="flex flex-wrap items-center gap-8">
              {REWARD_CONDITION_OPTIONS.map((option) => {
                const checked = condition === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={checked}
                    onClick={() => setCondition(option.value)}
                    className="inline-flex items-center gap-2.5 text-sm font-medium text-[#111827]"
                  >
                    <span
                      className={cn(
                        "flex size-4 items-center justify-center rounded-full border",
                        checked ? "border-[#111827]" : "border-[#d1d5db]",
                      )}
                    >
                      {checked ? <span className="size-2 rounded-full bg-[#111827]" /> : null}
                    </span>
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={submitting || !isValid}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#f0a500] px-8 text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:pointer-events-none disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </Dialog>
  );
}
