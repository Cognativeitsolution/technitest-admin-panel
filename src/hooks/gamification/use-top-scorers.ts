"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api-error";
import { gamificationService } from "@/services/gamification.service";
import type { PaginationMeta } from "@/types/api.types";
import type { TopScorerEntry } from "@/types/gamification.types";

type UseTopScorersOptions = {
  perPage?: number;
};

export function useTopScorers({ perPage = 15 }: UseTopScorersOptions = {}) {
  const [page, setPage] = useState(1);
  const [nonce, setNonce] = useState(0);
  const [items, setItems] = useState<TopScorerEntry[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, perPage, totalItems: 0, totalPages: 1 });
  const [error, setError] = useState<string | null>(null);
  const [settledKey, setSettledKey] = useState<string | null>(null);
  const [mutating, setMutating] = useState(false);

  const queryKey = `${page}|${perPage}|${nonce}`;

  useEffect(() => {
    let cancelled = false;
    gamificationService
      .getAdminTopScorers({ page, per_page: perPage })
      .then((result) => {
        if (cancelled) return;
        setItems(result.items);
        setPagination({
          page: result.page,
          perPage: result.per_page,
          totalItems: result.total,
          totalPages: Math.max(1, result.total_pages),
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

  const toggleFeatured = useCallback(async (certificateId: number, isFeatured: boolean) => {
    setMutating(true);
    try {
      await gamificationService.toggleTopScorerFeatured(certificateId, isFeatured);
      setItems((prev) =>
        prev.map((entry) =>
          entry.certificate_id === certificateId ? { ...entry, is_featured: isFeatured } : entry,
        ),
      );
      toast.success(isFeatured ? "Marked as featured" : "Removed from featured");
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
    toggleFeatured,
  };
}
