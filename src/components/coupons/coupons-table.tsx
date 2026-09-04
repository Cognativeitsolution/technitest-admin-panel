"use client";

import { Pencil, RotateCcw, Trash2 } from "lucide-react";

import { Can } from "@/components/shared/can";
import {
  formatDiscountType,
  formatDiscountValue,
  formatDiscountedPrice,
  formatUsageLimit,
  formatValidity,
  getCouponStatus,
  isCouponDeleted,
} from "@/lib/coupon-utils";
import { cn } from "@/lib/utils";
import type { CouponRecord } from "@/types/coupon.types";

type CouponsTableProps = {
  coupons: CouponRecord[];
  loading?: boolean;
  restoringId?: number | null;
  onEdit: (coupon: CouponRecord) => void;
  onDelete: (coupon: CouponRecord) => void;
  onRestore: (coupon: CouponRecord) => void;
};

export function CouponsTable({
  coupons,
  loading = false,
  restoringId = null,
  onEdit,
  onDelete,
  onRestore,
}: CouponsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">Coupon Code</th>
              <th className="px-5 py-3.5">Discount Type</th>
              <th className="px-5 py-3.5">Discount Value</th>
              <th className="px-5 py-3.5">Discounted Price</th>
              <th className="px-5 py-3.5">Usage Limit</th>
              <th className="px-5 py-3.5">Used</th>
              <th className="px-5 py-3.5">Validity</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-5 py-10 text-center text-sm text-[#6b7280]"
                >
                  Loading coupons...
                </td>
              </tr>
            ) : null}

            {!loading
              ? coupons.map((coupon) => {
                  const status = getCouponStatus(coupon);
                  const deleted = isCouponDeleted(coupon);
                  const restoring = restoringId === coupon.id;

                  return (
                    <tr
                      key={coupon.id}
                      className={cn(
                        "border-t border-[#eef1f6] transition hover:bg-[#fafbfc]",
                        deleted && "bg-[#fafafa]",
                      )}
                    >
                      <td
                        className={cn(
                          "px-5 py-4 text-sm font-semibold",
                          deleted ? "text-[#9ca3af]" : "text-[#111827]",
                        )}
                      >
                        {coupon.code}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#374151]">
                        {formatDiscountType(coupon.discount_type)}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-[#374151]">
                        {formatDiscountValue(
                          coupon.discount_type,
                          coupon.discount_value,
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-[#111827]">
                        <div>{formatDiscountedPrice(
                          coupon.discount_type,
                          coupon.discount_value,
                          coupon.min_purchase_amount,
                        )}</div>
                        {coupon.min_purchase_amount != null ? (
                          <p className="mt-0.5 text-xs font-normal text-[#9ca3af]">
                            Min {coupon.min_purchase_amount} Coins
                          </p>
                        ) : null}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#374151]">
                        {formatUsageLimit(coupon.usage_limit)}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#374151]">
                        {coupon.used_count}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#374151]">
                        {formatValidity(coupon.start_date, coupon.end_date)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                            status === "Active" &&
                              "bg-[#dcfce7] text-[#16a34a]",
                            status === "Deleted" &&
                              "bg-[#fee2e2] text-[#dc2626]",
                            status === "Expired" &&
                              "bg-[#ffedd5] text-[#c2410c]",
                          )}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {deleted ? (
                          <Can permission="coupon:restore">
                            <button
                              type="button"
                              aria-label={`Restore ${coupon.code}`}
                              disabled={restoring}
                              onClick={() => onRestore(coupon)}
                              className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-[#2563eb] underline decoration-[#2563eb]/40 underline-offset-2 transition hover:text-[#1d4ed8] hover:decoration-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline"
                            >
                              <RotateCcw
                                className={cn(
                                  "size-3.5",
                                  restoring && "animate-spin",
                                )}
                              />
                              {restoring ? "Restoring..." : "Restore"}
                            </button>
                          </Can>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <Can permission="coupon:update">
                              <button
                                type="button"
                                aria-label={`Edit ${coupon.code}`}
                                onClick={() => onEdit(coupon)}
                                className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]"
                              >
                                <Pencil className="size-4" />
                              </button>
                            </Can>
                            <Can permission="coupon:delete">
                              <button
                                type="button"
                                aria-label={`Delete ${coupon.code}`}
                                onClick={() => onDelete(coupon)}
                                className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#fef2f2] hover:text-[#ef4444]"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </Can>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              : null}

            {!loading && coupons.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-5 py-10 text-center text-sm text-[#6b7280]"
                >
                  No coupons found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
