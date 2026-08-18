"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { CouponDialog } from "@/components/coupons/coupon-dialog";
import { CouponsTable } from "@/components/coupons/coupons-table";
import { DropdownMenu } from "@/components/shared/dropdown-menu";
import { Pagination } from "@/components/shared/pagination";
import { Dialog } from "@/components/ui/dialog";
import {
  couponDateOptions,
  coupons as initialCoupons,
  couponStatusOptions,
  type Coupon,
} from "@/data/coupons";

const PAGE_SIZE = 8;

export function CouponsManagementView() {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [statusFilter, setStatusFilter] = useState(couponStatusOptions[0]);
  const [dateFilter, setDateFilter] = useState(couponDateOptions[0]);
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);

  const filteredCoupons = useMemo(() => {
    if (statusFilter === "Status") return coupons;
    return coupons.filter((coupon) => coupon.status === statusFilter);
  }, [coupons, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCoupons.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageCoupons = filteredCoupons.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function openCreate() {
    setEditingCoupon(null);
    setDialogOpen(true);
  }

  function openEdit(coupon: Coupon) {
    setEditingCoupon(coupon);
    setDialogOpen(true);
  }

  function handleSave(coupon: Coupon) {
    setCoupons((prev) => {
      const exists = prev.some((item) => item.id === coupon.id);
      if (exists) {
        return prev.map((item) => (item.id === coupon.id ? coupon : item));
      }
      return [coupon, ...prev];
    });
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setCoupons((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    setDeleteTarget(null);
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
            setPage(1);
          }}
        />
        <DropdownMenu
          label="Date"
          value={dateFilter}
          options={couponDateOptions}
          onChange={setDateFilter}
        />
      </div>

      <CouponsTable
        coupons={pageCoupons}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <CouponDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        coupon={editingCoupon}
        onSave={handleSave}
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
          ? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e5e7eb] px-4 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#ef4444] px-4 text-sm font-semibold text-white transition hover:bg-[#dc2626]"
          >
            Delete
          </button>
        </div>
      </Dialog>
    </div>
  );
}
