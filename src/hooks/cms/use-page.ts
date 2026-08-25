"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api-error";
import { isPageDetail } from "@/lib/page-content";
import { pageService } from "@/services/page.service";
import type {
  CreatePagePayload,
  PageDetail,
  UpdatePagePayload,
} from "@/types/page.types";

type UsePageOptions = {
  pageId?: number | null;
  slug?: string | null;
};

export function usePage({ pageId = null, slug = null }: UsePageOptions = {}) {
  const [page, setPage] = useState<PageDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [settledKey, setSettledKey] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  const [saving, setSaving] = useState(false);
  const [mutating, setMutating] = useState(false);

  const queryKey = `${pageId ?? "new"}|${slug ?? ""}|${nonce}`;
  const shouldLoad = pageId != null || Boolean(slug);

  useEffect(() => {
    if (!shouldLoad) {
      setPage(null);
      setError(null);
      setSettledKey(queryKey);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        let result: PageDetail | null = null;
        if (pageId != null) {
          result = await pageService.getPage(pageId);
        } else if (slug) {
          try {
            const publicPage = await pageService.getPublicPage(slug);
            result = await pageService.getPage(publicPage.id);
          } catch (publicErr) {
            const apiError = ApiError.fromAxiosError(publicErr);
            if (apiError.statusCode !== 404) throw publicErr;
            const list = await pageService.listPages({ per_page: 100 });
            const match = list.items.find((item) => item.slug === slug);
            if (!match) throw publicErr;
            result = await pageService.getPage(match.id);
          }
        }
        if (cancelled) return;
        setPage(result);
        setError(null);
        setSettledKey(queryKey);
      } catch (err) {
        if (cancelled) return;
        setPage(null);
        setError(ApiError.fromAxiosError(err).message);
        setSettledKey(queryKey);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [pageId, slug, nonce, queryKey, shouldLoad]);

  const applyResult = useCallback((result: unknown) => {
    if (isPageDetail(result)) setPage(result);
    else setNonce((prev) => prev + 1);
  }, []);

  const createPage = useCallback(async (payload: CreatePagePayload) => {
    setSaving(true);
    try {
      const created = await pageService.createPage(payload);
      toast.success("Page created");
      setPage(created);
      return created;
    } catch (err) {
      toast.error(ApiError.fromAxiosError(err).message);
      return null;
    } finally {
      setSaving(false);
    }
  }, []);

  const updatePage = useCallback(
    async (id: number, payload: UpdatePagePayload) => {
      setSaving(true);
      try {
        const updated = await pageService.updatePage(id, payload);
        toast.success("Page saved");
        applyResult(updated);
        return isPageDetail(updated) ? updated : page;
      } catch (err) {
        toast.error(ApiError.fromAxiosError(err).message);
        return null;
      } finally {
        setSaving(false);
      }
    },
    [applyResult, page],
  );

  const runAction = useCallback(
    async (
      action: (id: number) => Promise<unknown>,
      successMessage: string,
    ) => {
      if (pageId == null && !page?.id) return false;
      const id = pageId ?? page?.id;
      if (id == null) return false;
      setMutating(true);
      try {
        const result = await action(id);
        toast.success(successMessage);
        applyResult(result);
        return true;
      } catch (err) {
        toast.error(ApiError.fromAxiosError(err).message);
        return false;
      } finally {
        setMutating(false);
      }
    },
    [applyResult, page?.id, pageId],
  );

  return {
    page,
    loading: shouldLoad && settledKey !== queryKey,
    error,
    saving,
    mutating,
    createPage,
    updatePage,
    publishPage: useCallback(
      () => runAction(pageService.publishPage, "Page published"),
      [runAction],
    ),
    unpublishPage: useCallback(
      () => runAction(pageService.unpublishPage, "Page unpublished"),
      [runAction],
    ),
    archivePage: useCallback(
      () => runAction(pageService.archivePage, "Page archived"),
      [runAction],
    ),
    restorePage: useCallback(
      () => runAction(pageService.restorePage, "Page restored"),
      [runAction],
    ),
    refresh: useCallback(() => setNonce((prev) => prev + 1), []),
  };
}
