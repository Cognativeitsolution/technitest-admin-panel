import type { PaginatedData } from "@/types/api.types";

export type QuizQuestionType = "mcq" | "tf" | "blanks";
export type QuizSourceType = "manual" | "ai";

export type QuizOptionCreate = {
  option_text: string;
  is_correct: boolean;
};

export type QuizQuestionCreatePayload = {
  question: string;
  type: QuizQuestionType;
  time_limit: number;
  source_type: QuizSourceType;
  option: QuizOptionCreate[];
};

export type QuizQuestionsBulkCreatePayload = {
  source_type?: QuizSourceType;
  question: QuizQuestionCreatePayload[];
};

export type QuizQuestionUpdatePayload = {
  question?: string | null;
  type?: QuizQuestionType | null;
  time_limit?: number | null;
  source_type?: QuizSourceType | null;
  option?: QuizOptionCreate[] | null;
  is_active?: boolean | null;
};

export type QuizAdminOption = QuizOptionCreate & {
  id: number;
};

export type QuizQuestionAdmin = {
  id: number;
  question: string;
  type: QuizQuestionType;
  time_limit: number;
  source_type?: QuizSourceType;
  is_active?: boolean;
  option?: QuizAdminOption[];
};

export type QuizQuestionsListResult = PaginatedData<QuizQuestionAdmin>;

export type QuizQuestionsListQuery = {
  page?: number;
  per_page?: number;
};