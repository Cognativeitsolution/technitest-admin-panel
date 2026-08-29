"use client";

import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/lib/api-error";
import { quizCreateService } from "@/services/quiz-create.service";
import type {
  QuizQuestionsBulkCreatePayload,
  QuizQuestionAdmin,
  QuizQuestionUpdatePayload,
} from "@/types/quiz-create.types";

export function useQuizQuestions(quizId: number | null) {
  const [items, setItems] = useState<QuizQuestionAdmin[]>([]);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settledKey, setSettledKey] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const queryKey = quizId === null ? "none" : `${quizId}|${nonce}`;

  useEffect(() => {
    if (quizId === null) return;

    let cancelled = false;

    quizCreateService
      .adminList(quizId, { page: 1, per_page: 100 })
      .then((result) => {
        if (cancelled) return;
        setItems((result.items ?? []).filter((q) => q.is_active !== false));
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
  }, [quizId, queryKey, nonce]);

  const addMany = useCallback(
    async (payload: QuizQuestionsBulkCreatePayload) => {
      if (quizId === null) return false;
      setMutating(true);
      try {
        await quizCreateService.bulkCreate(quizId, payload);
        setError(null);
        setNonce((prev) => prev + 1);
        return true;
      } catch (err) {
        setError(ApiError.fromAxiosError(err).message);
        return false;
      } finally {
        setMutating(false);
      }
    },
    [quizId],
  );

  const updateOne = useCallback(
    async (questionId: number, payload: QuizQuestionUpdatePayload) => {
      if (quizId === null) return false;
      setMutating(true);
      try {
        await quizCreateService.updateQuestion(quizId, questionId, payload);
        setError(null);
        setNonce((prev) => prev + 1);
        return true;
      } catch (err) {
        setError(ApiError.fromAxiosError(err).message);
        return false;
      } finally {
        setMutating(false);
      }
    },
    [quizId],
  );

  const removeOne = useCallback(
    async (questionId: number) => {
      if (quizId === null) return false;
      setMutating(true);
      try {
        await quizCreateService.deleteQuestion(quizId, questionId);
        setError(null);
        setNonce((prev) => prev + 1);
        return true;
      } catch (err) {
        setError(ApiError.fromAxiosError(err).message);
        return false;
      } finally {
        setMutating(false);
      }
    },
    [quizId],
  );

  const reload = useCallback(() => setNonce((prev) => prev + 1), []);

  return {
    items,
    loading: quizId !== null && settledKey !== queryKey,
    mutating,
    error,
    addMany,
    updateOne,
    removeOne,
    reload,
  };
}