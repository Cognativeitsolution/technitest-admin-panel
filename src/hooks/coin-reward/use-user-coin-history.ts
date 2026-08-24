"use client";

import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/lib/api-error";
import { coinRewardService } from "@/services/coin-reward.service";
import type { PaginationMeta } from "@/types/api.types";
import type { CoinHistoryItem } from "@/types/coin-reward.types";

type UseUserCoinHistoryOptions = {
  userId: number | null;
  perPage?: number;
};

export function useUserCoinHistory({ userId, perPage = 15 }: UseUserCoinHistoryOptions) {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<CoinHistoryItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, perPage, totalItems: 0, totalPages: 1 });
  const [error, setError] = useState<string | null>(null);
  const [settledKey, setSettledKey] = useState<string | null>(null);

  const queryKey = `${userId ?? "none"}|${page}|${perPage}`;

  useEffect(() => {
    if (userId === null) return;
    let cancelled = false;
    coinRewardService
      .getAdminUserHistory(userId, { page, per_page: perPage })
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
  }, [userId, page, perPage, queryKey]);

  const goToPage = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  return {
    items,
    pagination,
    loading: userId !== null && settledKey !== queryKey,
    error,
    goToPage,
  };
}
