"use client";

import { useCallback, useRef, useState } from "react";
import axios from "axios";

import { ApiError } from "@/lib/api-error";
import { mapAiQuestionToView, type GeneratedQuestionView } from "@/lib/map-ai-quiz-question";
import { quizGenerateService } from "@/services/quiz-generate.service";
import type {
  AiJobProgress,
  AiJobStatus,
  QuizGenerateRequest,
} from "@/types/quiz-generate.types";

export type QuizGenerateLimits = {
  min: number;
  max: number;
};

export function getQuestionCountLimits(
  format: QuizGenerateRequest["questionFormat"],
): QuizGenerateLimits {
  if (format === "image") return { min: 1, max: 3 };
  return { min: 5, max: 100 };
}

export function useQuizGenerate() {
  const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState<AiJobStatus | null>(null);
  const [progress, setProgress] = useState<AiJobProgress | null>(null);
  const [questions, setQuestions] = useState<GeneratedQuestionView[]>([]);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setGenerating(false);
    setStatus(null);
    setProgress(null);
    setQuestions([]);
    setError(null);
  }, []);

  const generate = useCallback(async (payload: QuizGenerateRequest) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setGenerating(true);
    setError(null);
    setQuestions([]);
    setStatus("queued");
    setProgress({
      stage: "queued",
      completed_slots: 0,
      total_slots: payload.totalQuestions,
    });

    try {
      const created = await quizGenerateService.start(payload);
      if (controller.signal.aborted) return { ok: false as const, cancelled: true };

      setStatus(created.status ?? "queued");
      const job = await quizGenerateService.pollUntilDone(
        created.job_id,
        (next) => {
          setStatus(next.status);
          setProgress(next.progress ?? null);
        },
        controller.signal,
      );

      const mapped = (job.result?.questions ?? [])
        .map(mapAiQuestionToView)
        .filter((question) => question.payload.option.length >= 2);
      setQuestions(mapped);
      setStatus(job.status);
      return { ok: true as const, questions: mapped, partial: job.status === "partial" };
    } catch (err) {
      if (controller.signal.aborted || (err instanceof DOMException && err.name === "AbortError")) {
        return { ok: false as const, cancelled: true };
      }
      const message = axios.isAxiosError(err)
        ? ApiError.fromAxiosError(err).message
        : err instanceof Error
          ? err.message
          : ApiError.fromAxiosError(err).message;
      setError(message);
      setStatus("failed");
      return { ok: false as const, message };
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setGenerating(false);
      }
    }
  }, []);

  return {
    generating,
    status,
    progress,
    questions,
    error,
    generate,
    reset,
    setQuestions,
    setError,
  };
}
