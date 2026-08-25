"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api-error";
import { bannerService } from "@/services/banner.service";
import type { PaginationMeta } from "@/types/api.types";
import type { Banner, BannerPayload } from "@/types/banner.types";

type UseBannersOptions = {
  perPage?: number;
  status?: string;
  pageId?: number;
  enabled?: boolean;
};

export function useBanners({
  perPage = 15,
  status,
  pageId,
  enabled = true,
}: UseBannersOptions = {}) {
  const [page, setPage] = useState(1);
  const [nonce, setNonce] = useState(0);
  const [items, setItems] = useState<Banner[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    perPage,
    totalItems: 0,
    totalPages: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [settledKey, setSettledKey] = useState<string | null>(null);
  const [mutating, setMutating] = useState(false);

  const queryKey = `${enabled ? "on" : "off"}|${page}|${perPage}|${status ?? ""}|${pageId ?? ""}|${nonce}`;

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    bannerService
      .listBanners({
        page,
        per_page: perPage,
        status,
        page_id: pageId,
      })
      .then((result) => {
        if (cancelled) return;
        setItems(result.items ?? []);
        setPagination({
          page: result.page ?? page,
          perPage: result.per_page ?? perPage,
          totalItems: result.total,
          totalPages:
            result.total_pages ??
            Math.max(1, Math.ceil((result.total || 0) / perPage)),
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
  }, [enabled, page, perPage, status, pageId, nonce, queryKey]);

  const createBanner = useCallback(
    async (payload: BannerPayload, image: File | null) => {
      setMutating(true);
      try {
        await bannerService.createBanner(payload, image);
        toast.success("Banner created");
        setNonce((prev) => prev + 1);
        return true;
      } catch (err) {
        toast.error(ApiError.fromAxiosError(err).message);
        return false;
      } finally {
        setMutating(false);
      }
    },
    [],
  );

  const updateBanner = useCallback(
    async (bannerId: number, payload: BannerPayload, image?: File | null) => {
      setMutating(true);
      try {
        await bannerService.updateBanner(bannerId, payload, image);
        toast.success("Banner updated");
        setNonce((prev) => prev + 1);
        return true;
      } catch (err) {
        toast.error(ApiError.fromAxiosError(err).message);
        return false;
      } finally {
        setMutating(false);
      }
    },
    [],
  );

  const deleteBanner = useCallback(async (bannerId: number) => {
    setMutating(true);
    try {
      await bannerService.deleteBanner(bannerId);
      toast.success("Banner deleted");
      setNonce((prev) => prev + 1);
      return true;
    } catch (err) {
      toast.error(ApiError.fromAxiosError(err).message);
      return false;
    } finally {
      setMutating(false);
    }
  }, []);

  const restoreBanner = useCallback(async (bannerId: number) => {
    setMutating(true);
    try {
      await bannerService.restoreBanner(bannerId);
      toast.success("Banner restored");
      setNonce((prev) => prev + 1);
      return true;
    } catch (err) {
      toast.error(ApiError.fromAxiosError(err).message);
      return false;
    } finally {
      setMutating(false);
    }
  }, []);

  return {
    items,
    pagination,
    loading: enabled ? settledKey !== queryKey : false,
    error,
    mutating,
    goToPage: useCallback((nextPage: number) => setPage(nextPage), []),
    refresh: useCallback(() => setNonce((prev) => prev + 1), []),
    createBanner,
    updateBanner,
    deleteBanner,
    restoreBanner,
  };
}
