"use client";

import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/lib/api-error";
import { coinRewardService } from "@/services/coin-reward.service";
import type { PaginationMeta } from "@/types/api.types";
import type { AdminWallet } from "@/types/coin-reward.types";

type UseAdminWalletsOptions = {
  page?: number;
  perPage?: number;
  enabled?: boolean;
};

export function useAdminWallets({ page = 1, perPage = 15, enabled = true }: UseAdminWalletsOptions = {}) {
  const [items, setItems] = useState<AdminWallet[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, perPage, totalItems: 0, totalPages: 1 });
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchWallets = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const result = await coinRewardService.getAdminWallets({ page, per_page: perPage });
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
  }, [enabled, page, perPage]);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  return { items, pagination, loading, error, refresh: fetchWallets };
}
