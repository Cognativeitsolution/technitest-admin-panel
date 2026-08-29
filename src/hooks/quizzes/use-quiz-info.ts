"use client";

import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/lib/api-error";
import { quizInfoService } from "@/services/quiz-info.service";
import type { QuizInfoListItem } from "@/types/quiz-info.types";

export function useQuizInfo(quizId: number | null) {
  const [quiz, setQuiz] = useState<QuizInfoListItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [settledKey, setSettledKey] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const queryKey = quizId === null ? "none" : `${quizId}|${nonce}`;

  useEffect(() => {
    if (quizId === null) return;

    let cancelled = false;
    quizInfoService
      .getById(quizId)
      .then((data) => {
        if (cancelled) return;
        setQuiz(data);
        setError(null);
        setSettledKey(queryKey);
      })
      .catch((err) => {
        if (cancelled) return;
        setQuiz(null);
        setError(ApiError.fromAxiosError(err).message);
        setSettledKey(queryKey);
      });

    return () => {
      cancelled = true;
    };
  }, [quizId, queryKey, nonce]);

  const reload = useCallback(() => setNonce((prev) => prev + 1), []);

  return {
    quiz,
    loading: quizId !== null && settledKey !== queryKey,
    error,
    reload,
  };
}