"use client";

import { useCallback, useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import type { ApiUser } from "@/types/user.types";
import { ApiError } from "@/lib/api-error";
import type { PaginationMeta } from "@/types/api.types";

export type UseUsersOptions = {
  perPage?: number;
  country?: string;
  dateFrom?: string;
  dateTo?: string;
};

export function useUsers({
  perPage = 10,
  country,
  dateFrom,
  dateTo,
}: UseUsersOptions = {}) {
  const [page, setPage] = useState(1);
  const [nonce, setNonce] = useState(0);
  const [items, setItems] = useState<ApiUser[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    perPage,
    totalItems: 0,
    totalPages: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [settledKey, setSettledKey] = useState<string | null>(null);

  const queryKey = `${page}|${perPage}|${country ?? ""}|${dateFrom ?? ""}|${dateTo ?? ""}|${nonce}`;

  useEffect(() => {
    let cancelled = false;
    
    userService
      .getUsers({
        page,
        per_page: perPage,
        country,
        date_from: dateFrom,
        date_to: dateTo,
      })
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data)) {
          setItems(data);
          setPagination({
            page: 1,
            perPage,
            totalItems: data.length,
            totalPages: 1,
          });
        } else {
          setItems(data.items ?? []);
          setPagination({
            page: data.page ?? page,
            perPage: data.per_page ?? perPage,
            totalItems: data.total ?? 0,
            totalPages:
              data.total_pages ??
              Math.max(1, Math.ceil((data.total ?? 0) / perPage)),
          });
        }
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
  }, [page, perPage, nonce, queryKey, country, dateFrom, dateTo]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [country, dateFrom, dateTo]);

  return {
    items,
    pagination,
    loading: settledKey !== queryKey,
    error,
    goToPage: useCallback((nextPage: number) => setPage(nextPage), []),
    refresh: useCallback(() => setNonce((prev) => prev + 1), []),
  };
}