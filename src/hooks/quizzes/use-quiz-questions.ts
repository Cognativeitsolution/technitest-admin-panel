"use client";

import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/lib/api-error";
import { quizCreateService } from "@/services/quiz-create.service";
import type {
  QuizQuestionsBulkCreatePayload,
  QuizQuestionAdmin,
  QuizQuestionUpdatePayload,
} from "@/types/quiz-create.types";

function firstString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function normalizeQuestion(question: QuizQuestionAdmin): QuizQuestionAdmin {
  const extra = question as QuizQuestionAdmin & {
    image?: unknown;
    imageUrl?: unknown;
    image_path?: unknown;
    question_image?: unknown;
    question_image_url?: unknown;
  };
  return {
    ...question,
    image_url:
      firstString(
        question.image_url,
        extra.image,
        extra.imageUrl,
        extra.image_path,
        extra.question_image,
        extra.question_image_url,
      ) ?? question.image_url,
    option: (question.option ?? []).map((opt) => {
      const optExtra = opt as typeof opt & {
        image?: unknown;
        imageUrl?: unknown;
        image_path?: unknown;
      };
      return {
        ...opt,
        // Keep option image_url for display fallback only; UI does not upload option images.
        image_url:
          firstString(opt.image_url, optExtra.image, optExtra.imageUrl, optExtra.image_path) ??
          opt.image_url,
      };
    }),
  };
}

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
        setItems(
          (result.items ?? [])
            .filter((q) => q.is_active !== false)
            .map(normalizeQuestion),
        );
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
    async (payload: QuizQuestionsBulkCreatePayload, files?: File[] | null) => {
      if (quizId === null) {
        return { ok: false as const, message: "Quiz not found." };
      }
      setMutating(true);
      try {
        await quizCreateService.bulkCreate(quizId, payload, files);
        setError(null);
        setNonce((prev) => prev + 1);
        return { ok: true as const };
      } catch (err) {
        const message = ApiError.fromAxiosError(err).message;
        setError(message);
        return { ok: false as const, message };
      } finally {
        setMutating(false);
      }
    },
    [quizId],
  );

  const updateOne = useCallback(
    async (
      questionId: number,
      payload: QuizQuestionUpdatePayload,
      files?: File[] | null,
    ) => {
      if (quizId === null) {
        return { ok: false as const, message: "Quiz not found." };
      }
      setMutating(true);
      try {
        await quizCreateService.updateQuestion(quizId, questionId, payload, files);
        setError(null);
        setNonce((prev) => prev + 1);
        return { ok: true as const };
      } catch (err) {
        const message = ApiError.fromAxiosError(err).message;
        setError(message);
        return { ok: false as const, message };
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