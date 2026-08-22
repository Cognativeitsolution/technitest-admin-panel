"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api-error";
import { gamificationService } from "@/services/gamification.service";
import type { PaginationMeta } from "@/types/api.types";
import type { StarPayload, StarRuleRecord } from "@/types/gamification.types";

type UseStarsOptions = {
  perPage?: number;
};

export function useStars({ perPage = 15 }: UseStarsOptions = {}) {
  const [page, setPage] = useState(1);
  const [nonce, setNonce] = useState(0);
  const [items, setItems] = useState<StarRuleRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, perPage, totalItems: 0, totalPages: 1 });
  const [error, setError] = useState<string | null>(null);
  const [settledKey, setSettledKey] = useState<string | null>(null);
  const [mutating, setMutating] = useState(false);

  const queryKey = `${page}|${perPage}|${nonce}`;

  useEffect(() => {
    let cancelled = false;
    gamificationService
      .getStars({ page, per_page: perPage })
      .then((result) => {
        if (cancelled) return;
        setItems(result.items);
        setPagination({
          page,
          perPage,
          totalItems: result.total,
          totalPages: Math.max(1, Math.ceil(result.total / perPage)),
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

  const goToPage = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const refresh = useCallback(() => {
    setNonce((prev) => prev + 1);
  }, []);

  const createStar = useCallback(
    async (payload: StarPayload) => {
      setMutating(true);
      try {
        await gamificationService.createStar(payload);
        toast.success("Star rule created");
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

  const updateStar = useCallback(async (starId: number, payload: StarPayload) => {
    setMutating(true);
    try {
      await gamificationService.updateStar(starId, payload);
      toast.success("Star rule updated");
      setNonce((prev) => prev + 1);
      return true;
    } catch (err) {
      toast.error(ApiError.fromAxiosError(err).message);
      return false;
    } finally {
      setMutating(false);
    }
  }, []);

  const deleteStar = useCallback(async (starId: number) => {
    setMutating(true);
    try {
      await gamificationService.deleteStar(starId);
      toast.success("Star rule deleted");
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
    loading: settledKey !== queryKey,
    error,
    mutating,
    goToPage,
    refresh,
    createStar,
    updateStar,
    deleteStar,
  };
}
