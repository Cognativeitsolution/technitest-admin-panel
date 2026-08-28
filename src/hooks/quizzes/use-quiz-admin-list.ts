"use client";

import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/lib/api-error";
import { quizInfoService } from "@/services/quiz-info.service";
import type { PaginationMeta } from "@/types/api.types";
import type { QuizInfoListItem } from "@/types/quiz-info.types";

type UseQuizAdminListOptions = {
  perPage?: number;
};

export function useQuizAdminList({ perPage = 15 }: UseQuizAdminListOptions = {}) {
  const [page, setPage] = useState(1);
  const [nonce, setNonce] = useState(0);
  const [items, setItems] = useState<QuizInfoListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    perPage,
    totalItems: 0,
    totalPages: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [settledKey, setSettledKey] = useState<string | null>(null);

  const queryKey = `${page}|${perPage}|${nonce}`;

  useEffect(() => {
    let cancelled = false;
    quizInfoService
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

  return {
    items,
    pagination,
    loading: settledKey !== queryKey,
    error,
    goToPage,
    refresh,
  };
}
