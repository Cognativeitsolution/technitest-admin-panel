"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { CouponDialog } from "@/components/coupons/coupon-dialog";
import { CouponsTable } from "@/components/coupons/coupons-table";
import { DropdownMenu } from "@/components/shared/dropdown-menu";
import { Pagination } from "@/components/shared/pagination";
import { Dialog } from "@/components/ui/dialog";
import { useCoupons } from "@/hooks/coupons/use-coupons";
import {
  couponDateOptions,
  couponStatusOptions,
  getCouponStatus,
  isCouponDeleted,
  matchesDateFilter,
} from "@/lib/coupon-utils";
import type {
  CouponPayload,
  CouponRecord,
  UpdateCouponPayload,
} from "@/types/coupon.types";

export function CouponsManagementView() {
  const {
    items,
    pagination,
    loading,
    error,
    mutating,
    goToPage,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    restoreCoupon,
  } = useCoupons({ perPage: 15 });

  const [statusFilter, setStatusFilter] = useState(couponStatusOptions[0]);
  const [dateFilter, setDateFilter] = useState(couponDateOptions[0]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CouponRecord | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<CouponRecord | null>(null);
  const [restoringId, setRestoringId] = useState<number | null>(null);

  const filteredCoupons = useMemo(() => {
    return items.filter((coupon) => {
      if (
        statusFilter !== "Status" &&
        getCouponStatus(coupon) !== statusFilter
      ) {
        return false;
      }
      return matchesDateFilter(coupon, dateFilter);
    });
  }, [items, statusFilter, dateFilter]);

  function openCreate() {
    setEditingCoupon(null);
    setDialogOpen(true);
  }

  function openEdit(coupon: CouponRecord) {
    if (isCouponDeleted(coupon)) return;
    setEditingCoupon(coupon);
    setDialogOpen(true);
  }

  async function handleSubmit(
    payload: CouponPayload | UpdateCouponPayload,
  ) {
    if (editingCoupon) {
      return updateCoupon(editingCoupon.id, payload as UpdateCouponPayload);
    }
    return createCoupon(payload);
  }

  async function confirmDelete() {
    if (!deleteTarget || isCouponDeleted(deleteTarget)) return;
    const ok = await deleteCoupon(deleteTarget.id);
    if (ok) setDeleteTarget(null);
  }

  async function confirmRestore() {
    if (!restoreTarget) return;
    setRestoringId(restoreTarget.id);
    const ok = await restoreCoupon(restoreTarget.id);
    setRestoringId(null);
    if (ok) setRestoreTarget(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
          Coupons Management
        </h1>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex h-11 w-fit items-center gap-2 rounded-xl bg-[#f0a500] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d99400]"
        >
          <Plus className="size-4" />
          Add Coupon
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <DropdownMenu
          label="Status"
          value={statusFilter}
          options={couponStatusOptions}
          onChange={(value) => {
            setStatusFilter(value);
            goToPage(1);
          }}
        />
        <DropdownMenu
          label="Date"
          value={dateFilter}
          options={couponDateOptions}
          onChange={(value) => {
            setDateFilter(value);
            goToPage(1);
          }}
        />
      </div>

      {error ? (
        <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
          {error}
        </div>
      ) : null}

      <CouponsTable
        coupons={filteredCoupons}
        loading={loading}
        restoringId={restoringId}
        onEdit={openEdit}
        onDelete={(coupon) => {
          if (isCouponDeleted(coupon)) return;
          setDeleteTarget(coupon);
        }}
        onRestore={setRestoreTarget}
      />

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={goToPage}
      />

      <CouponDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingCoupon(null);
        }}
        coupon={editingCoupon}
        submitting={mutating}
        onSubmit={handleSubmit}
      />

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete Coupon"
        maxWidth="max-w-sm"
      >
        <p className="text-sm text-[#4b5563]">
          Are you sure you want to delete coupon{" "}
          <span className="font-semibold text-[#111827]">
            {deleteTarget?.code}
          </span>
          ? You can restore it later.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            disabled={mutating}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e5e7eb] px-4 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            disabled={mutating}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#ef4444] px-4 text-sm font-semibold text-white transition hover:bg-[#dc2626] disabled:opacity-50"
          >
            {mutating ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Dialog>

      <Dialog
        open={Boolean(restoreTarget)}
        onClose={() => setRestoreTarget(null)}
        title="Restore Coupon"
        maxWidth="max-w-sm"
      >
        <p className="text-sm text-[#4b5563]">
          Restore coupon{" "}
          <span className="font-semibold text-[#111827]">
            {restoreTarget?.code}
          </span>
          ? It will become active again.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setRestoreTarget(null)}
            disabled={Boolean(restoringId)}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e5e7eb] px-4 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmRestore}
            disabled={Boolean(restoringId)}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#2563eb] px-4 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:opacity-50"
          >
            {restoringId ? "Restoring..." : "Restore"}
          </button>
        </div>
      </Dialog>
    </div>
  );
}
