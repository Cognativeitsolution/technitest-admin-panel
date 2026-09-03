"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api-error";
import { sortFaqs } from "@/lib/faq-utils";
import { faqService } from "@/services/faq.service";
import type { FaqPayload, FaqRecord, FaqUpdatePayload } from "@/types/faq.types";

export function useFaqs() {
  const [nonce, setNonce] = useState(0);
  const [items, setItems] = useState<FaqRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [settled, setSettled] = useState(false);
  const [mutating, setMutating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setSettled(false);

    faqService
      .getAdminListAll()
      .then((result) => {
        if (cancelled) return;
        setItems(sortFaqs(result.items ?? []));
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

  const createFaqs = useCallback(
    async (payloads: FaqPayload[]) => {
      setMutating(true);
      try {
        await faqService.bulkCreate(payloads);
        toast.success(
          payloads.length > 1 ? "FAQs created" : "FAQ created",
        );
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

  const updateFaq = useCallback(
    async (faqId: number, payload: FaqUpdatePayload) => {
      setMutating(true);
      try {
        await faqService.update(faqId, payload);
        toast.success("FAQ updated");
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

  const deleteFaq = useCallback(
    async (faqId: number) => {
      setMutating(true);
      try {
        await faqService.remove(faqId);
        toast.success("FAQ deleted");
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

  const restoreFaq = useCallback(
    async (faqId: number) => {
      setMutating(true);
      try {
        await faqService.restore(faqId);
        toast.success("FAQ restored");
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
    createFaqs,
    updateFaq,
    deleteFaq,
    restoreFaq,
  };
}
