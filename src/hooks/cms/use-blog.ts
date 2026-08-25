"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { isBlogDetail } from "@/lib/blog";
import { ApiError } from "@/lib/api-error";
import { blogService } from "@/services/blog.service";
import type {
  AutosaveBlogPayload,
  BlogDetail,
  BlogRevision,
  CreateBlogPayload,
  UpdateBlogPayload,
} from "@/types/blog.types";

type UseBlogOptions = {
  blogId?: number | null;
};

export function useBlog({ blogId = null }: UseBlogOptions = {}) {
  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [revisions, setRevisions] = useState<BlogRevision[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [settledKey, setSettledKey] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  const [saving, setSaving] = useState(false);
  const [autosaving, setAutosaving] = useState(false);
  const [mutating, setMutating] = useState(false);

  const queryKey = `${blogId ?? "new"}|${nonce}`;
  const shouldLoad = blogId != null;

  useEffect(() => {
    if (!shouldLoad) {
      setBlog(null);
      setRevisions([]);
      setError(null);
      setSettledKey(queryKey);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const [detail, revisionList] = await Promise.all([
          blogService.getBlog(blogId as number),
          blogService.listRevisions(blogId as number).catch(() => []),
        ]);
        if (cancelled) return;
        setBlog(detail);
        setRevisions(revisionList);
        setError(null);
        setSettledKey(queryKey);
      } catch (err) {
        if (cancelled) return;
        setBlog(null);
        setRevisions([]);
        setError(ApiError.fromAxiosError(err).message);
        setSettledKey(queryKey);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [blogId, nonce, queryKey, shouldLoad]);

  const applyResult = useCallback((result: unknown) => {
    if (isBlogDetail(result)) setBlog(result);
    else setNonce((prev) => prev + 1);
  }, []);

  const createBlog = useCallback(async (payload: CreateBlogPayload) => {
    setSaving(true);
    try {
      const created = await blogService.createBlog(payload);
      toast.success("Blog created");
      setBlog(created);
      return created;
    } catch (err) {
      toast.error(ApiError.fromAxiosError(err).message);
      return null;
    } finally {
      setSaving(false);
    }
  }, []);

  const updateBlog = useCallback(
    async (id: number, payload: UpdateBlogPayload) => {
      setSaving(true);
      try {
        const updated = await blogService.updateBlog(id, payload);
        toast.success("Blog saved");
        applyResult(updated);
        return isBlogDetail(updated) ? updated : blog;
      } catch (err) {
        toast.error(ApiError.fromAxiosError(err).message);
        return null;
      } finally {
        setSaving(false);
      }
    },
    [applyResult, blog],
  );

  const autosaveBlog = useCallback(
    async (id: number, payload: AutosaveBlogPayload) => {
      setAutosaving(true);
      try {
        const updated = await blogService.autosaveBlog(id, payload);
        applyResult(updated);
        return true;
      } catch (err) {
        toast.error(ApiError.fromAxiosError(err).message);
        return false;
      } finally {
        setAutosaving(false);
      }
    },
    [applyResult],
  );

  const restoreRevision = useCallback(
    async (revisionId: number) => {
      const id = blogId ?? blog?.id;
      if (id == null) return false;
      setMutating(true);
      try {
        const result = await blogService.restoreRevision(id, revisionId);
        toast.success("Revision restored");
        applyResult(result);
        setNonce((prev) => prev + 1);
        return true;
      } catch (err) {
        toast.error(ApiError.fromAxiosError(err).message);
        return false;
      } finally {
        setMutating(false);
      }
    },
    [applyResult, blog?.id, blogId],
  );

  const runAction = useCallback(
    async (
      action: (id: number) => Promise<unknown>,
      successMessage: string,
    ) => {
      const id = blogId ?? blog?.id;
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
    [applyResult, blog?.id, blogId],
  );

  return {
    blog,
    revisions,
    loading: shouldLoad && settledKey !== queryKey,
    error,
    saving,
    autosaving,
    mutating,
    createBlog,
    updateBlog,
    autosaveBlog,
    restoreRevision,
    publishBlog: useCallback(
      () => runAction(blogService.publishBlog, "Blog published"),
      [runAction],
    ),
    unpublishBlog: useCallback(
      () => runAction(blogService.unpublishBlog, "Blog unpublished"),
      [runAction],
    ),
    archiveBlog: useCallback(
      () => runAction(blogService.archiveBlog, "Blog archived"),
      [runAction],
    ),
    restoreBlog: useCallback(
      () => runAction(blogService.restoreBlog, "Blog restored"),
      [runAction],
    ),
    refresh: useCallback(() => setNonce((prev) => prev + 1), []),
  };
}
