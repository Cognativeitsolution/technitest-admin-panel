import aiApiClient from "@/lib/ai-api-client";
import type {
  QuizGenerateJob,
  QuizGenerateJobCreated,
  QuizGenerateRequest,
} from "@/types/quiz-generate.types";

const POLL_INTERVAL_MS = 2500;
const POLL_TIMEOUT_MS = 8 * 60 * 1000;

function buildGenerateFormData(payload: QuizGenerateRequest) {
  const formData = new FormData();
  formData.append("category_id", String(payload.categoryId));
  formData.append("category", payload.category);
  formData.append("description", payload.description);
  formData.append("total_questions", String(payload.totalQuestions));
  formData.append("question_format", payload.questionFormat);
  formData.append("language", payload.language || "en");
  if (payload.quizTitle?.trim()) {
    formData.append("quiz_title", payload.quizTitle.trim());
  }
  if (payload.document) {
    formData.append("document", payload.document);
  }
  return formData;
}

function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

export const quizGenerateService = {
  start: async (payload: QuizGenerateRequest) => {
    const { data } = await aiApiClient.post<QuizGenerateJobCreated>(
      "/v1/quiz/generate",
      buildGenerateFormData(payload),
    );
    return data;
  },

  getJob: async (jobId: string) => {
    const { data } = await aiApiClient.get<QuizGenerateJob>(
      `/v1/quiz/jobs/${jobId}`,
    );
    return data;
  },

  pollUntilDone: async (
    jobId: string,
    onProgress?: (job: QuizGenerateJob) => void,
    signal?: AbortSignal,
  ) => {
    const startedAt = Date.now();

    while (!signal?.aborted) {
      const job = await quizGenerateService.getJob(jobId);
      onProgress?.(job);

      if (job.status === "completed" || job.status === "partial") {
        return job;
      }

      if (job.status === "failed" || job.status === "expired") {
        const detail = job.errors?.[0]?.message;
        throw new Error(detail || `Quiz generation ${job.status}.`);
      }

      if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
        throw new Error(
          "Generation is taking too long. Try fewer questions and generate again.",
        );
      }

      await sleep(POLL_INTERVAL_MS, signal);
    }

    throw new DOMException("Aborted", "AbortError");
  },
};
