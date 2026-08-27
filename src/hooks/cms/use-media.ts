"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api-error";
import { isMediaItem } from "@/lib/media";
import { mediaService } from "@/services/media.service";
import type { PaginationMeta } from "@/types/api.types";
import type { MediaItem, UpdateMediaPayload, UploadMediaInput } from "@/types/media.types";

type UseMediaOptions = {
  perPage?: number;
  enabled?: boolean;
};

export function useMedia({ perPage = 15, enabled = true }: UseMediaOptions = {}) {
  const [page, setPage] = useState(1);
  const [nonce, setNonce] = useState(0);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    perPage,
    totalItems: 0,
    totalPages: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [settledKey, setSettledKey] = useState<string | null>(null);
  const [mutating, setMutating] = useState(false);

  const queryKey = `${enabled ? "on" : "off"}|${page}|${perPage}|${nonce}`;

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    mediaService
      .listMedia({ page, per_page: perPage })
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
  }, [enabled, page, perPage, nonce, queryKey]);

  const uploadMedia = useCallback(async (input: UploadMediaInput) => {
    setMutating(true);
    try {
      const created = await mediaService.uploadMedia(input);
      toast.success("Media uploaded");
      setNonce((prev) => prev + 1);
      return isMediaItem(created) ? created : true;
    } catch (err) {
      toast.error(ApiError.fromAxiosError(err).message);
      return null;
    } finally {
      setMutating(false);
    }
  }, []);

  const updateMedia = useCallback(
    async (mediaId: number, payload: UpdateMediaPayload) => {
      setMutating(true);
      try {
        const updated = await mediaService.updateMedia(mediaId, payload);
        toast.success("Media updated");
        if (isMediaItem(updated)) {
          setItems((prev) =>
            prev.map((item) => (item.id === mediaId ? { ...item, ...updated } : item)),
          );
        } else {
          setNonce((prev) => prev + 1);
        }
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

  const deleteMedia = useCallback(async (mediaId: number) => {
    setMutating(true);
    try {
      await mediaService.deleteMedia(mediaId);
      toast.success("Media deleted");
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
    uploadMedia,
    updateMedia,
    deleteMedia,
  };
}
