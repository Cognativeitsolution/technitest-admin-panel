"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api-error";
import { userFeedbackService } from "@/services/user-feedback.service";
import type { PaginationMeta } from "@/types/api.types";
import type {
  SubmitUserFeedbackInput,
  UserFeedbackRecord,
} from "@/types/user-feedback.types";

type UseUserReviewsOptions = {
  perPage?: number;
};

export function useUserReviews({ perPage = 15 }: UseUserReviewsOptions = {}) {
  const [page, setPage] = useState(1);
  const [nonce, setNonce] = useState(0);
  const [items, setItems] = useState<UserFeedbackRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    perPage,
    totalItems: 0,
    totalPages: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [settledKey, setSettledKey] = useState<string | null>(null);
  const [mutating, setMutating] = useState(false);

  const queryKey = `${page}|${perPage}|${nonce}`;

  useEffect(() => {
    let cancelled = false;
    userFeedbackService
      .getUserReviews({ page, per_page: perPage })
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

  const submitFeedback = useCallback(
    async (input: SubmitUserFeedbackInput) => {
      setMutating(true);
      try {
        await userFeedbackService.submitFeedback(input);
        toast.success("Feedback submitted");
        refresh();
        return true;
      } catch (err) {
        toast.error(ApiError.fromAxiosError(err).message);
        return false;
      } finally {
        setMutating(false);
      }
    },
    [refresh],
  );

  return {
    items,
    pagination,
    loading: settledKey !== queryKey,
    error,
    mutating,
    goToPage,
    refresh,
    submitFeedback,
  };
}
