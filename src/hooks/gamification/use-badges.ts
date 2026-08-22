"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api-error";
import { gamificationService } from "@/services/gamification.service";
import type { BadgePayload, BadgeRule } from "@/types/gamification.types";

export function useBadges() {
  const [nonce, setNonce] = useState(0);
  const [items, setItems] = useState<BadgeRule[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [settled, setSettled] = useState(false);
  const [mutating, setMutating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    gamificationService
      .getBadges()
      .then((result) => {
        if (cancelled) return;
        setItems(result);
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
  }, [nonce]);

  const refresh = useCallback(() => {
    setNonce((prev) => prev + 1);
  }, []);

  const createBadge = useCallback(
    async ({ payload, image }: { payload: BadgePayload; image: File | null }) => {
      setMutating(true);
      try {
        await gamificationService.createBadge({ payload, image });
        toast.success("Badge rule created");
        setNonce((prev) => prev + 1);
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

  const updateBadge = useCallback(
    async ({
      ruleId,
      payload,
      image,
    }: {
      ruleId: number;
      payload?: BadgePayload;
      image?: File | null;
    }) => {
      setMutating(true);
      try {
        await gamificationService.updateBadge({ ruleId, payload, image });
        toast.success("Badge rule updated");
        setNonce((prev) => prev + 1);
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

  return { items, loading: !settled, error, mutating, createBadge, updateBadge, refresh };
}
