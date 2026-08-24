"use client";

import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/lib/api-error";
import { coinRewardService } from "@/services/coin-reward.service";
import type { PaginationMeta } from "@/types/api.types";
import type { CoinHistoryItem } from "@/types/coin-reward.types";

type UseMyCoinHistoryOptions = {
  perPage?: number;
  enabled?: boolean;
};

export function useMyCoinHistory({ perPage = 15, enabled = true }: UseMyCoinHistoryOptions = {}) {
  const [page, setPage] = useState(1);
  const [nonce, setNonce] = useState(0);
  const [items, setItems] = useState<CoinHistoryItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, perPage, totalItems: 0, totalPages: 1 });
  const [error, setError] = useState<string | null>(null);
  const [settledKey, setSettledKey] = useState<string | null>(null);

  const queryKey = `${enabled ? "on" : "off"}|${page}|${perPage}|${nonce}`;

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    coinRewardService
      .getMyHistory({ page, per_page: perPage })
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
  }, [enabled, page, perPage, nonce, queryKey]);

  const goToPage = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const refresh = useCallback(() => {
    setNonce((prev) => prev + 1);
  }, []);

  return {
    items,
    pagination,
    loading: enabled ? settledKey !== queryKey : false,
    error,
    goToPage,
    refresh,
  };
}
