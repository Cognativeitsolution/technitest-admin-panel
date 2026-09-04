"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api-error";
import { categoryService } from "@/services/category.service";
import type { CategoryItem, CategoryPayload } from "@/types/category.types";

function sortNewestFirst(items: CategoryItem[]) {
  return [...items].sort((a, b) => {
    const timeA = a.created_at ? Date.parse(a.created_at) : Number.NaN;
    const timeB = b.created_at ? Date.parse(b.created_at) : Number.NaN;
    if (!Number.isNaN(timeA) && !Number.isNaN(timeB) && timeA !== timeB) {
      return timeB - timeA;
    }
    return b.id - a.id;
  });
}

export function useCategories() {
  const [nonce, setNonce] = useState(0);
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [settled, setSettled] = useState(false);
  const [mutating, setMutating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setSettled(false);

    categoryService
      .getAdminListAll()
      .then((result) => {
        if (cancelled) return;
        setItems(sortNewestFirst(result.items ?? []));
        setTotal(result.total ?? result.items?.length ?? 0);
        setError(null);
        setSettled(true);
      })
      .catch((err) => {
        if (cancelled) return;
        setItems([]);
        setTotal(0);
        setError(ApiError.fromAxiosError(err).message);
        setSettled(true);
      });

    return () => {
      cancelled = true;
    };
  }, [nonce]);

  const refresh = useCallback(() => {
    setNonce((prev) => prev + 1);
  }, []);

  const createCategory = useCallback(
    async (payload: CategoryPayload, image?: File | null) => {
      setMutating(true);
      try {
        await categoryService.create(payload, image);
        toast.success("Category created");
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

  const updateCategory = useCallback(
    async (
      categoryId: number,
      payload: CategoryPayload,
      image?: File | null,
    ) => {
      setMutating(true);
      try {
        await categoryService.update(categoryId, payload, image);
        toast.success("Category updated");
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

  const deleteCategory = useCallback(
    async (categoryId: number) => {
      setMutating(true);
      try {
        await categoryService.remove(categoryId);
        toast.success("Category deleted");
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

  const restoreCategory = useCallback(
    async (categoryId: number) => {
      setMutating(true);
      try {
        await categoryService.restore(categoryId);
        toast.success("Category restored");
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
    total,
    loading: !settled,
    error,
    mutating,
    refresh,
    createCategory,
    updateCategory,
    deleteCategory,
    restoreCategory,
  };
}
