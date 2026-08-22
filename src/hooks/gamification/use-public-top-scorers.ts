"use client";

import { useEffect, useState } from "react";

import { ApiError } from "@/lib/api-error";
import { gamificationService } from "@/services/gamification.service";
import type { PaginationMeta } from "@/types/api.types";
import type { TopScorerEntry } from "@/types/gamification.types";

type UsePublicTopScorersOptions = {
  page?: number;
  perPage?: number;
  enabled?: boolean;
};

export function usePublicTopScorers({ page = 1, perPage = 15, enabled = true }: UsePublicTopScorersOptions = {}) {
  const [items, setItems] = useState<TopScorerEntry[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, perPage, totalItems: 0, totalPages: 1 });
  const [error, setError] = useState<string | null>(null);
  const [settledKey, setSettledKey] = useState<string | null>(null);

  const queryKey = `${enabled ? "on" : "off"}|${page}|${perPage}`;

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    gamificationService
      .getPublicTopScorers({ page, per_page: perPage })
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
  }, [enabled, page, perPage, queryKey]);

  return {
    items,
    pagination,
    loading: enabled ? settledKey !== queryKey : false,
    error,
  };
}
