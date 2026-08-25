"use client";

import { useEffect, useState } from "react";

import { ApiError } from "@/lib/api-error";
import { pageService } from "@/services/page.service";
import type { PageDropdownItem } from "@/types/page.types";

type UsePagesDropdownOptions = {
  enabled?: boolean;
};

export function usePagesDropdown({
  enabled = true,
}: UsePagesDropdownOptions = {}) {
  const [items, setItems] = useState<PageDropdownItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setSettled(false);
    pageService
      .getDropdown()
      .then((result) => {
        if (cancelled) return;
        setItems(result ?? []);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setItems([]);
        setError(ApiError.fromAxiosError(err).message);
      })
      .finally(() => {
        if (!cancelled) setSettled(true);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { items, loading: enabled && !settled, error };
}
