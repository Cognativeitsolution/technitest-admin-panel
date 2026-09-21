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

function resolveImageUrl(question: AiGeneratedQuestion): string | null {
  const candidates = [question.image_url, question.image_path];
  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (!value) continue;

    if (isHttpUrl(value)) {
      try {
        const uploadPath = extractUploadPath(new URL(value).pathname);
        if (uploadPath) return toProxiedUploadUrl(uploadPath);
      } catch {
        // fall through to raw URL
      }
      return value;
    }

    const uploadPath = extractUploadPath(value);
    if (uploadPath) {
      return toProxiedUploadUrl(uploadPath);
    }

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

  return {
    key,
    question: question.question,
    type: "mcq",
    format,
    options,
    imageUrl: format === "image" ? resolveImageUrl(question) : null,
    explanation: question.explanation ?? null,
    payload: {
      question: question.question,
      type: "mcq",
      time_limit: 30,
      source_type: "ai",
      option: options.map((option) => ({
        option_text: option.text,
        is_correct: option.isCorrect,
      })),
    },
  };
}
