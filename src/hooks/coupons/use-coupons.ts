"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api-error";
import { couponService } from "@/services/coupon.service";
import type { PaginationMeta } from "@/types/api.types";
import type {
  CouponPayload,
  CouponRecord,
  UpdateCouponPayload,
} from "@/types/coupon.types";

type UseCouponsOptions = {
  perPage?: number;
};

export function useCoupons({ perPage = 15 }: UseCouponsOptions = {}) {
  const [page, setPage] = useState(1);
  const [nonce, setNonce] = useState(0);
  const [items, setItems] = useState<CouponRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    perPage,
    totalItems: 0,
    totalPages: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [settledKey, setSettledKey] = useState<string | null>(null);
  const [mutating, setMutating] = useState(false);

  const queryKey = `${page}|${perPage}|${nonce}`;

  useEffect(() => {
    let cancelled = false;
    couponService
      .getAdminList({ page, per_page: perPage })
      .then((result) => {
        if (cancelled) return;
        setItems(result.items ?? []);
        setPagination({
          page: result.page ?? page,
          perPage: result.per_page ?? perPage,
          totalItems: result.total ?? 0,
          totalPages: Math.max(1, result.total_pages ?? 1),
        });
        setError(null);
        setSettledKey(queryKey);
      })
      .catch((err) => {
        if (cancelled) return;
        setItems([]);
        setError(ApiError.fromAxiosError(err).message);
        setSettledKey(queryKey);
      });
    return () => {
      cancelled = true;
    };
  }, [page, perPage, nonce, queryKey]);

  const refresh = useCallback(() => {
    setNonce((prev) => prev + 1);
  }, []);

  const goToPage = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const createCoupon = useCallback(
    async (payload: CouponPayload) => {
      setMutating(true);
      try {
        await couponService.create(payload);
        toast.success("Coupon created");
        setPage(1);
        refresh();
        return true;
      } catch (err) {
        toast.error(ApiError.fromAxiosError(err).message);
        return false;
      } finally {
        setMutating(false);
      }
    },
    [refresh],
  );

  const updateCoupon = useCallback(
    async (couponId: number, payload: UpdateCouponPayload) => {
      setMutating(true);
      try {
        await couponService.update(couponId, payload);
        toast.success("Coupon updated");
        refresh();
        return true;
      } catch (err) {
        toast.error(ApiError.fromAxiosError(err).message);
        return false;
      } finally {
        setMutating(false);
      }
    },
    [refresh],
  );

  const deleteCoupon = useCallback(
    async (couponId: number) => {
      setMutating(true);
      try {
        await couponService.remove(couponId);
        toast.success("Coupon deleted");
        refresh();
        return true;
      } catch (err) {
        toast.error(ApiError.fromAxiosError(err).message);
        return false;
      } finally {
        setMutating(false);
      }
    },
    [refresh],
  );

  const restoreCoupon = useCallback(
    async (couponId: number) => {
      setMutating(true);
      try {
        await couponService.restore(couponId);
        toast.success("Coupon restored");
        refresh();
        return true;
      } catch (err) {
        toast.error(ApiError.fromAxiosError(err).message);
        return false;
      } finally {
        setMutating(false);
      }
    },
    [refresh],
  );

  return {
    items,
    pagination,
    loading: settledKey !== queryKey,
    error,
    mutating,
    goToPage,
    refresh,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    restoreCoupon,
  };
}
