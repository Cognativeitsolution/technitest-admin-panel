"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api-error";
import { websiteReviewService } from "@/services/website-review.service";
import type { PaginationMeta } from "@/types/api.types";
import type {
  CreateWebsiteReviewInput,
  UpdateWebsiteReviewInput,
  WebsiteReviewRecord,
} from "@/types/website-review.types";

type UseWebsiteReviewsOptions = {
  perPage?: number;
};

export function useWebsiteReviews({ perPage = 15 }: UseWebsiteReviewsOptions = {}) {
  const [page, setPage] = useState(1);
  const [nonce, setNonce] = useState(0);
  const [items, setItems] = useState<WebsiteReviewRecord[]>([]);
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
    websiteReviewService
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

  const createReview = useCallback(
    async (input: CreateWebsiteReviewInput & { isFeatured?: boolean }) => {
      setMutating(true);
      try {
        await websiteReviewService.create(input);

        if (input.isFeatured) {
          const latest = await websiteReviewService.getAdminList({
            page: 1,
            per_page: 15,
          });
          const created = (latest.items ?? []).find(
            (item) =>
              item.name === input.payload.name &&
              item.message === input.payload.message &&
              item.rating === input.payload.rating,
          );
          if (created && !created.is_featured) {
            await websiteReviewService.toggleFeatured(created.id, true);
          }
        }

        toast.success("Review created");
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

  const updateReview = useCallback(
    async (input: UpdateWebsiteReviewInput) => {
      setMutating(true);
      try {
        await websiteReviewService.update(input);
        toast.success("Review updated");
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

  const toggleFeatured = useCallback(async (reviewId: number, isFeatured: boolean) => {
    setMutating(true);
    const previous = items;
    setItems((prev) =>
      prev.map((item) =>
        item.id === reviewId ? { ...item, is_featured: isFeatured } : item,
      ),
    );
    try {
      await websiteReviewService.toggleFeatured(reviewId, isFeatured);
      toast.success(isFeatured ? "Marked as featured" : "Removed from featured");
      return true;
    } catch (err) {
      setItems(previous);
      toast.error(ApiError.fromAxiosError(err).message);
      return false;
    } finally {
      setMutating(false);
    }
  }, [items]);

  return {
    items,
    pagination,
    loading: settledKey !== queryKey,
    error,
    mutating,
    goToPage,
    refresh,
    createReview,
    updateReview,
    toggleFeatured,
  };
}
