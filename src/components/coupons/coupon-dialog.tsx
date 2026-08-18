"use client";

import { useEffect, useState } from "react";

import { Dialog } from "@/components/ui/dialog";
import { TextField } from "@/components/ui/text-field";
import {
  applicableToOptions,
  discountTypeOptions,
  type Coupon,
  type DiscountType,
} from "@/data/coupons";

type CouponDialogProps = {
  open: boolean;
  onClose: () => void;
  coupon: Coupon | null;
  onSave: (coupon: Coupon) => void;
};

const emptyForm = {
  code: "",
  discountType: "Percentage" as DiscountType,
  discountValue: "",
  usageLimit: "",
  applicableTo: applicableToOptions[0],
  minPurchase: "",
  startDate: "",
  endDate: "",
};

export function CouponDialog({
  open,
  onClose,
  coupon,
  onSave,
}: CouponDialogProps) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) return;

    if (coupon) {
      setForm({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        usageLimit: coupon.usageLimit,
        applicableTo: coupon.applicableTo,
        minPurchase: coupon.minPurchase,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, coupon]);

  function updateField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    const next: Coupon = {
      id: coupon?.id ?? String(Date.now()),
      code: form.code || "NEWCODE",
      discountType: form.discountType,
      discountValue: form.discountValue || "0%",
      usageLimit: form.usageLimit || "Unlimited",
      used: coupon?.used ?? 0,
      validity:
        form.startDate && form.endDate
          ? `${form.startDate} – ${form.endDate}`
          : coupon?.validity ?? "No Expiry",
      status: coupon?.status ?? "Active",
      applicableTo: form.applicableTo,
      minPurchase: form.minPurchase,
      startDate: form.startDate,
      endDate: form.endDate,
    };

    onSave(next);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Add/Edit Coupon"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <TextField
          label="Coupon Code"
          value={form.code}
          onChange={(e) => updateField("code", e.target.value)}
          placeholder="Enter coupon code"
          inputClassName="text-[#4b5563]"
        />

        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">
            Discount Type
          </label>
          <select
            value={form.discountType}
            onChange={(e) =>
              updateField("discountType", e.target.value as DiscountType)
            }
            className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
          >
            {discountTypeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <TextField
          label="Discount Value"
          value={form.discountValue}
          onChange={(e) => updateField("discountValue", e.target.value)}
          placeholder="e.g. 10% or 50 Coins"
          inputClassName="text-[#4b5563]"
        />

        <TextField
          label="Usage Limit"
          value={form.usageLimit}
          onChange={(e) => updateField("usageLimit", e.target.value)}
          placeholder="e.g. 100"
          inputClassName="text-[#4b5563]"
        />

        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">
            Applicable To
          </label>
          <select
            value={form.applicableTo}
            onChange={(e) => updateField("applicableTo", e.target.value)}
            className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
          >
            {applicableToOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <TextField
          label="Minimum Purchase Requirement"
          value={form.minPurchase}
          onChange={(e) => updateField("minPurchase", e.target.value)}
          placeholder="e.g. 500 PKR"
          inputClassName="text-[#4b5563]"
        />

        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Start Date"
            value={form.startDate}
            onChange={(e) => updateField("startDate", e.target.value)}
            placeholder="DD-MM-YYYY"
            inputClassName="text-[#4b5563]"
          />
          <TextField
            label="End Date"
            value={form.endDate}
            onChange={(e) => updateField("endDate", e.target.value)}
            placeholder="DD-MM-YYYY"
            inputClassName="text-[#4b5563]"
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white transition hover:bg-[#d99400]"
        >
          Save Changes
        </button>
      </div>
    </Dialog>
  );
}
