"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api-error";
import { paymentService } from "@/services/payment.service";
import type { PaginationMeta } from "@/types/api.types";
import type {
  TransactionReceipt,
  TransactionRecord,
} from "@/types/payment.types";

type UseTransactionsOptions = {
  perPage?: number;
  status?: string[];
  dateFrom?: string;
  dateTo?: string;
};

export function useTransactions({
  perPage = 15,
  status,
  dateFrom,
  dateTo,
}: UseTransactionsOptions = {}) {
  const [page, setPage] = useState(1);
  const [nonce, setNonce] = useState(0);
  const [items, setItems] = useState<TransactionRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    perPage,
    totalItems: 0,
    totalPages: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [settledKey, setSettledKey] = useState<string | null>(null);

  const statusParam = status?.length ? status.join(",") : undefined;
  const queryKey = `${page}|${perPage}|${statusParam ?? ""}|${dateFrom ?? ""}|${dateTo ?? ""}|${nonce}`;

  useEffect(() => {
    let cancelled = false;
    paymentService
      .getTransactions({
        page,
        per_page: perPage,
        status: statusParam,
        date_from: dateFrom,
        date_to: dateTo,
      })
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
  }, [page, perPage, nonce, queryKey, statusParam, dateFrom, dateTo]);

  useEffect(() => {
    setPage(1);
  }, [statusParam, dateFrom, dateTo]);

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

export function useTransactionReceipt() {
  const [receipt, setReceipt] = useState<TransactionReceipt | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReceipt = useCallback(async (transactionId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.getTransactionReceipt(transactionId);
      setReceipt(data);
    } catch (err) {
      setError(ApiError.fromAxiosError(err).message);
      toast.error("Failed to load receipt");
    } finally {
      setLoading(false);
    }
  }, []);

  const clearReceipt = useCallback(() => {
    setReceipt(null);
    setError(null);
  }, []);

  return { receipt, loading, error, fetchReceipt, clearReceipt };
}
