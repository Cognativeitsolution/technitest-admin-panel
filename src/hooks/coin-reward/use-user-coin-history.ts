"use client";

import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/lib/api-error";
import { coinRewardService } from "@/services/coin-reward.service";
import type { PaginationMeta } from "@/types/api.types";
import type { CoinHistoryItem } from "@/types/coin-reward.types";

type UseUserCoinHistoryOptions = {
  userId: number | null;
  page?: number;
  perPage?: number;
  enabled?: boolean;
};

export function useUserCoinHistory({ userId, page = 1, perPage = 15, enabled = true }: UseUserCoinHistoryOptions) {
  const [items, setItems] = useState<CoinHistoryItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, perPage, totalItems: 0, totalPages: 1 });
  const [loading, setLoading] = useState(enabled && userId !== null);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!enabled || userId === null) return;
    setLoading(true);
    setError(null);
    try {
      const result = await coinRewardService.getAdminUserHistory(userId, { page, per_page: perPage });
      setItems(result.items);
      setPagination({
        page: result.page,
        perPage: result.per_page,
        totalItems: result.total,
        totalPages: Math.max(1, result.total_pages),
      });
    } catch (err) {
      setError(ApiError.fromAxiosError(err).message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [enabled, userId, page, perPage]);

  useEffect(() => {
    if (!enabled || userId === null) {
      setItems([]);
      setLoading(false);
      return;
    }
    fetchHistory();
  }, [enabled, userId, fetchHistory]);

  return { items, pagination, loading, error, refresh: fetchHistory };
}
