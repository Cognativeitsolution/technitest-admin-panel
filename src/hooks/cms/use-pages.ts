"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api-error";
import { pageService } from "@/services/page.service";
import type { PaginationMeta } from "@/types/api.types";
import type { PageListItem } from "@/types/page.types";

type UsePagesOptions = {
  perPage?: number;
  publishStatus?: string;
  status?: string;
  enabled?: boolean;
};

export function usePages({
  perPage = 15,
  publishStatus,
  status,
  enabled = true,
}: UsePagesOptions = {}) {
  const [page, setPage] = useState(1);
  const [nonce, setNonce] = useState(0);
  const [items, setItems] = useState<PageListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    perPage,
    totalItems: 0,
    totalPages: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [settledKey, setSettledKey] = useState<string | null>(null);
  const [mutating, setMutating] = useState(false);

  const queryKey = `${enabled ? "on" : "off"}|${page}|${perPage}|${publishStatus ?? ""}|${status ?? ""}|${nonce}`;

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    pageService
      .listPages({
        page,
        per_page: perPage,
        publish_status: publishStatus,
        status,
      })
      .then((result) => {
        if (cancelled) return;
        setItems(result.items ?? []);
        setPagination({
          page: result.page ?? page,
          perPage: result.per_page ?? perPage,
          totalItems: result.total,
          totalPages:
            result.total_pages ??
            Math.max(1, Math.ceil((result.total || 0) / perPage)),
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
  }, [enabled, page, perPage, publishStatus, status, nonce, queryKey]);

  const deletePage = useCallback(async (pageId: number) => {
    setMutating(true);
    try {
      await pageService.deletePage(pageId);
      toast.success("Page deleted");
      setNonce((prev) => prev + 1);
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
    loading: enabled ? settledKey !== queryKey : false,
    error,
    mutating,
    goToPage: useCallback((nextPage: number) => setPage(nextPage), []),
    refresh: useCallback(() => setNonce((prev) => prev + 1), []),
    deletePage,
  };
}
