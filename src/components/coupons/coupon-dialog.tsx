"use client";

import { useEffect, useState } from "react";

import { QuizMultiSelect } from "@/components/coupons/quiz-multi-select";
import { Dialog } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { TextField } from "@/components/ui/text-field";
import {
  applicableToOptions,
  dateInputToIso,
  discountTypeOptions,
  extractQuizIds,
  toDateInputValue,
} from "@/lib/coupon-utils";
import { cn } from "@/lib/utils";
import { quizInfoService } from "@/services/quiz-info.service";
import type {
  CouponPayload,
  CouponRecord,
  UpdateCouponPayload,
} from "@/types/coupon.types";
import type { QuizInfoListItem } from "@/types/quiz-info.types";

type CouponDialogProps = {
  open: boolean;
  onClose: () => void;
  coupon: CouponRecord | null;
  submitting?: boolean;
  onSubmit: (
    payload: CouponPayload | UpdateCouponPayload,
  ) => Promise<boolean>;
};

const emptyForm = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  usageLimit: "",
  applicableTo: "all",
  quizIds: [] as number[],
  minPurchase: "",
  startDate: "",
  endDate: "",
  isActive: true,
};

const selectClassName =
  "h-[48px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-4 text-[14px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[14px] font-medium text-[#111111]">{children}</label>
  );
}

export function CouponDialog({
  open,
  onClose,
  coupon,
  submitting = false,
  onSubmit,
}: CouponDialogProps) {
  const isEdit = Boolean(coupon);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<QuizInfoListItem[]>([]);
  const [quizzesLoading, setQuizzesLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (coupon) {
      setForm({
        code: coupon.code,
        discountType:
          coupon.discount_type === "flat"
            ? "fixed"
            : coupon.discount_type || "percentage",
        discountValue: String(coupon.discount_value ?? ""),
        usageLimit:
          coupon.usage_limit == null ? "" : String(coupon.usage_limit),
        applicableTo: coupon.applicable_to || "all",
        quizIds: extractQuizIds(coupon.quizzes),
        minPurchase:
          coupon.min_purchase_amount == null
            ? ""
            : String(coupon.min_purchase_amount),
        startDate: toDateInputValue(coupon.start_date),
        endDate: toDateInputValue(coupon.end_date),
        isActive: coupon.is_active,
      });
    } else {
      setForm(emptyForm);
    }
    setFormError(null);
  }, [open, coupon]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setQuizzesLoading(true);
    quizInfoService
      .getAllAdminQuizzes()
      .then((items) => {
        if (!cancelled) setQuizzes(items);
      })
      .catch(() => {
        if (!cancelled) setQuizzes([]);
      })
      .finally(() => {
        if (!cancelled) setQuizzesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  function updateField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    const code = form.code.trim();
    const discountValue = Number(form.discountValue);
    const usageLimit = Number(form.usageLimit);
    const minPurchase = Number(form.minPurchase || 0);

    if (!code) {
      setFormError("Coupon code is required.");
      return;
    }
    if (!Number.isFinite(discountValue) || discountValue <= 0) {
      setFormError("Enter a valid discount value.");
      return;
    }
    if (!Number.isInteger(usageLimit) || usageLimit < 1) {
      setFormError("Usage limit must be at least 1.");
      return;
    }
    if (!form.startDate || !form.endDate) {
      setFormError("Start and end dates are required.");
      return;
    }
    if (form.endDate < form.startDate) {
      setFormError("End date must be on or after the start date.");
      return;
    }
    if (form.applicableTo === "specific" && form.quizIds.length === 0) {
      setFormError("Select at least one quiz.");
      return;
    }

    const basePayload: CouponPayload = {
      code,
      discount_type: form.discountType,
      discount_value: discountValue,
      usage_limit: usageLimit,
      applicable_to: form.applicableTo,
      quiz_ids: form.applicableTo === "specific" ? form.quizIds : [],
      min_purchase_amount: Number.isFinite(minPurchase) ? minPurchase : 0,
      start_date: dateInputToIso(form.startDate),
      end_date: dateInputToIso(form.endDate, true),
    };

    const payload: CouponPayload | UpdateCouponPayload = isEdit
      ? { ...basePayload, is_active: form.isActive }
      : basePayload;

    const ok = await onSubmit(payload);
    if (ok) onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Coupon" : "Add Coupon"}
      maxWidth="max-w-2xl"
    >
      <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
        <TextField
          label="Coupon Code"
          value={form.code}
          onChange={(e) => updateField("code", e.target.value)}
          placeholder="Enter coupon code"
          inputClassName="h-[48px] text-[#4b5563]"
        />

        <div className="flex flex-col gap-[10px]">
          <FieldLabel>Discount Type</FieldLabel>
          <select
            value={form.discountType}
            onChange={(e) => updateField("discountType", e.target.value)}
            className={selectClassName}
          >
            {discountTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <TextField
          label="Discount Value"
          type="number"
          value={form.discountValue}
          onChange={(e) => updateField("discountValue", e.target.value)}
          placeholder={
            form.discountType === "percentage" ? "e.g. 10" : "e.g. 50"
          }
          inputClassName="h-[48px] text-[#4b5563]"
        />

        <TextField
          label="Usage Limit"
          type="number"
          value={form.usageLimit}
          onChange={(e) => updateField("usageLimit", e.target.value)}
          placeholder="e.g. 100"
          inputClassName="h-[48px] text-[#4b5563]"
        />

        <div className="flex flex-col gap-[10px]">
          <FieldLabel>Applicable To</FieldLabel>
          <select
            value={form.applicableTo}
            onChange={(e) => {
              const value = e.target.value;
              updateField("applicableTo", value);
              if (value !== "specific") {
                updateField("quizIds", []);
              }
            }}
            className={selectClassName}
          >
            {applicableToOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <TextField
          label="Minimum Purchase"
          type="number"
          value={form.minPurchase}
          onChange={(e) => updateField("minPurchase", e.target.value)}
          placeholder="e.g. 500"
          inputClassName="h-[48px] text-[#4b5563]"
        />

        {form.applicableTo === "specific" ? (
          <div className="flex flex-col gap-[10px] sm:col-span-2">
            <FieldLabel>Quizzes</FieldLabel>
            <QuizMultiSelect
              quizzes={quizzes}
              selectedIds={form.quizIds}
              onChange={(ids) => updateField("quizIds", ids)}
              loading={quizzesLoading}
            />
          </div>
        ) : null}

        <TextField
          label="Start Date"
          type="date"
          value={form.startDate}
          onChange={(e) => updateField("startDate", e.target.value)}
          inputClassName="h-[48px] text-[#4b5563]"
        />

        <TextField
          label="End Date"
          type="date"
          value={form.endDate}
          onChange={(e) => updateField("endDate", e.target.value)}
          inputClassName="h-[48px] text-[#4b5563]"
        />

        {isEdit ? (
          <div
            className={cn(
              "flex items-center justify-between rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 sm:col-span-2",
            )}
          >
            <div>
              <p className="text-sm font-medium text-[#111827]">Active</p>
              <p className="text-xs text-[#6b7280]">
                Inactive coupons cannot be redeemed
              </p>
            </div>
            <Switch
              checked={form.isActive}
              onCheckedChange={(checked) => updateField("isActive", checked)}
            />
          </div>
        ) : null}

        {formError ? (
          <p className="text-sm text-[#b91c1c] sm:col-span-2">{formError}</p>
        ) : null}
      </div>

      <div className="mt-6 flex justify-end gap-3 border-t border-[#eef1f6] pt-5">
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
          className="inline-flex h-11 min-w-[140px] items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:opacity-50"
        >
          {submitting ? "Saving..." : isEdit ? "Update Coupon" : "Add Coupon"}
        </button>
      </div>
    </Dialog>
  );
}
