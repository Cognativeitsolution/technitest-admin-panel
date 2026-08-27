"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api-error";
import { notificationService } from "@/services/notification.service";
import type { PaginationMeta } from "@/types/api.types";
import type { NotificationRecord } from "@/types/notification.types";

type UseNotificationsOptions = {
  perPage?: number;
};

export function useNotifications({ perPage = 15 }: UseNotificationsOptions = {}) {
  const [page, setPage] = useState(1);
  const [nonce, setNonce] = useState(0);
  const [items, setItems] = useState<NotificationRecord[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
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
    notificationService
      .getList({ page, per_page: perPage })
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

  useEffect(() => {
    let cancelled = false;
    notificationService
      .getUnreadCount()
      .then((result) => {
        if (!cancelled) setUnreadCount(result.unread_count ?? 0);
      })
      .catch(() => {
        if (!cancelled) setUnreadCount(0);
      });
    return () => {
      cancelled = true;
    };
  }, [nonce]);

  const refresh = useCallback(() => {
    setNonce((prev) => prev + 1);
  }, []);

  const goToPage = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const markAsRead = useCallback(
    async (notificationId: number) => {
      setMutating(true);
      try {
        await notificationService.markAsRead(notificationId);
        setItems((prev) =>
          prev.map((item) =>
            item.id === notificationId ? { ...item, is_read: true } : item,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        return true;
      } catch (err) {
        toast.error(ApiError.fromAxiosError(err).message);
        return false;
      } finally {
        setMutating(false);
      }
    },
    [],
  );

  const markAllAsRead = useCallback(async () => {
    setMutating(true);
    try {
      await notificationService.markAllAsRead();
      setItems((prev) => prev.map((item) => ({ ...item, is_read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
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
    unreadCount,
    loading: settledKey !== queryKey,
    error,
    mutating,
    goToPage,
    refresh,
    markAsRead,
    markAllAsRead,
  };
}