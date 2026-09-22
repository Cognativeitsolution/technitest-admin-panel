import { env } from "@/config/env";
import type {
  QuizQuestionCreatePayload,
  QuizQuestionType,
} from "@/types/quiz-create.types";
import type {
  AiGeneratedQuestion,
  AiQuestionFormat,
} from "@/types/quiz-generate.types";

export type GeneratedQuestionView = {
  key: string;
  question: string;
  type: QuizQuestionType;
  format: AiQuestionFormat;
  options: { text: string; isCorrect: boolean }[];
  imageUrl: string | null;
  explanation: string | null;
  payload: QuizQuestionCreatePayload;
};

const LETTERS = ["A", "B", "C", "D"] as const;

function isHttpUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

const UPLOADS_SEGMENT = "/uploads/";

/** Turn server paths or URLs into `/uploads/...` when possible. */
function extractUploadPath(value: string): string | null {
  const trimmed = value.trim();
  const segmentIndex = trimmed.indexOf(UPLOADS_SEGMENT);
  if (segmentIndex >= 0) {
    return trimmed.slice(segmentIndex);
  }
  if (trimmed.startsWith("uploads/")) {
    return `/${trimmed}`;
  }
  return null;
}

/** Same-origin proxy (see next.config rewrites) for AI-hosted quiz images. */
function toProxiedUploadUrl(uploadPath: string): string {
  const relative = uploadPath.startsWith(UPLOADS_SEGMENT)
    ? uploadPath.slice(UPLOADS_SEGMENT.length)
    : uploadPath.replace(/^\//, "");
  return `/ai-uploads/${relative}`;
}

function resolveRawImageUrl(question: AiGeneratedQuestion): string | null {
  const candidates = [question.image_url, question.image_path];
  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (!value) continue;
    if (isHttpUrl(value)) return value;
    const uploadPath = extractUploadPath(value);
    if (uploadPath) return `${env.AI_API_BASE_URL}${uploadPath}`;
    if (
      value.startsWith("/") &&
      !value.startsWith("/tmp") &&
      !value.startsWith("/home")
    ) {
      return `${env.AI_API_BASE_URL}${value}`;
    }
  }
  return null;
}

export function toQuestionImageSrc(value?: string | null): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/ai-uploads/") || trimmed.startsWith("/media/")) {
    return trimmed;
  }
  if (trimmed.startsWith("media/")) {
    return `/${trimmed}`;
  }
  if (isHttpUrl(trimmed)) {
    try {
      const url = new URL(trimmed);
      const uploadPath = extractUploadPath(url.pathname);
      if (uploadPath) return toProxiedUploadUrl(uploadPath);
      if (url.pathname.startsWith("/media/")) {
        return `${url.pathname}${url.search}`;
      }
    } catch {
      // keep the original URL
    }
    return trimmed;
  }
  const uploadPath = extractUploadPath(trimmed);
  if (uploadPath) return toProxiedUploadUrl(uploadPath);
  return trimmed;
}

function resolveImageUrl(question: AiGeneratedQuestion): string | null {
  return toQuestionImageSrc(resolveRawImageUrl(question));
}

export function getQuestionImageUrl(question?: {
  image_url?: string | null;
  option?: { image_url?: string | null }[] | null;
} | null): string | null {
  const direct = toQuestionImageSrc(question?.image_url);
  if (direct) return direct;
  for (const option of question?.option ?? []) {
    const src = toQuestionImageSrc(option.image_url);
    if (src) return src;
  }
  return null;
}

function letterOptions(question: AiGeneratedQuestion) {
  return LETTERS.map((letter) => ({
    letter,
    text: String(
      question[`option_${letter.toLowerCase() as "a" | "b" | "c" | "d"}`] ?? "",
    ).trim(),
  })).filter((option) => option.text.length > 0);
}

function isTrueAnswer(value: AiGeneratedQuestion["correct_answer"]) {
  if (typeof value === "boolean") return value;
  const normalized = String(value ?? "").trim().toLowerCase();
  return normalized === "true" || normalized === "t" || normalized === "a";
}

export function mapAiQuestionToView(
  question: AiGeneratedQuestion,
  index: number,
): GeneratedQuestionView {
  const format = question.question_format ?? "mcq";
  const key = String(question.slot_id || question.id || index);

  if (format === "true_false") {
    const isTrue = isTrueAnswer(question.correct_answer);
    const options = [
      { text: "True", isCorrect: isTrue },
      { text: "False", isCorrect: !isTrue },
    ];
    return {
      key,
      question: question.question,
      type: "tf",
      format,
      options,
      imageUrl: null,
      explanation: question.explanation ?? null,
      payload: {
        question: question.question,
        type: "tf",
        time_limit: 30,
        source_type: "ai",
        option: options.map((option) => ({
          option_text: option.text,
          is_correct: option.isCorrect,
        })),
      },
    };
  }

  const options = letterOptions(question).map((option) => ({
    text: option.text,
    isCorrect: String(question.correct_answer ?? "").trim().toUpperCase() === option.letter,
  }));
  const type: QuizQuestionType = format === "image" ? "image_mcq" : "mcq";

  return {
    key,
    question: question.question,
    type,
    format,
    options,
    imageUrl: format === "image" ? resolveImageUrl(question) : null,
    explanation: question.explanation ?? null,
    payload: {
      question: question.question,
      type,
      time_limit: 30,
      source_type: "ai",
      image_url: format === "image" ? resolveRawImageUrl(question) : null,
      option: options.map((option) => ({
        option_text: option.text,
        is_correct: option.isCorrect,
      })),
    },
  };
}
