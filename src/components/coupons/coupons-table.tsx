"use client";

import { Pencil, Trash2 } from "lucide-react";

import type { Coupon } from "@/data/coupons";
import { cn } from "@/lib/utils";

type CouponsTableProps = {
  coupons: Coupon[];
  onEdit: (coupon: Coupon) => void;
  onDelete: (coupon: Coupon) => void;
};

export function CouponsTable({ coupons, onEdit, onDelete }: CouponsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">Coupon Code</th>
              <th className="px-5 py-3.5">Discount Type</th>
              <th className="px-5 py-3.5">Discount Value</th>
              <th className="px-5 py-3.5">Usage Limit</th>
              <th className="px-5 py-3.5">Used</th>
              <th className="px-5 py-3.5">Validity</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr
                key={coupon.id}
                className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]"
              >
                <td className="px-5 py-4 text-sm font-semibold text-[#111827]">
                  {coupon.code}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {coupon.discountType}
                </td>
                <td className="px-5 py-4 text-sm font-medium text-[#374151]">
                  {coupon.discountValue}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {coupon.usageLimit}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">{coupon.used}</td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {coupon.validity}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                      coupon.status === "Active" &&
                        "bg-[#dcfce7] text-[#16a34a]",
                      coupon.status === "Inactive" &&
                        "bg-[#f3f4f6] text-[#6b7280]",
                      coupon.status === "Expired" &&
                        "bg-[#fee2e2] text-[#dc2626]"
                    )}
                  >
                    {coupon.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      aria-label={`Edit ${coupon.code}`}
                      onClick={() => onEdit(coupon)}
                      className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${coupon.code}`}
                      onClick={() => onDelete(coupon)}
                      className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#fef2f2] hover:text-[#ef4444]"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
