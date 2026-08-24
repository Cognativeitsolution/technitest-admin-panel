"use client";

import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/lib/api-error";
import { certificateService } from "@/services/certificate.service";
import type { PaginationMeta } from "@/types/api.types";
import type { UserCertificateItem } from "@/types/certificate.types";

type UseAdminCertificatesOptions = {
  perPage?: number;
};

export function useAdminCertificates({ perPage = 10 }: UseAdminCertificatesOptions = {}) {
  const [page, setPage] = useState(1);
  const [nonce, setNonce] = useState(0);
  const [items, setItems] = useState<UserCertificateItem[]>([]);
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
    certificateService
      .getAdminCertificates({ page, per_page: perPage })
      .then((result) => {
        if (cancelled) return;
        setItems(result.items);
        setPagination({
          page: result.page ?? page,
          perPage: result.per_page ?? perPage,
          totalItems: result.total,
          totalPages:
            result.total_pages ??
            Math.max(1, Math.ceil(result.total / perPage)),
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

  return {
    items,
    pagination,
    loading: settledKey !== queryKey,
    error,
    goToPage: useCallback((nextPage: number) => setPage(nextPage), []),
    refresh: useCallback(() => setNonce((prev) => prev + 1), []),
  };
}
