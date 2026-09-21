export type AiQuestionFormat = "mcq" | "true_false" | "image";
export type AiJobStatus =
  | "queued"
  | "running"
  | "completed"
  | "partial"
  | "failed"
  | "expired";
export type AiJobStage =
  | "queued"
  | "parsing"
  | "syllabus"
  | "blueprint"
  | "generation"
  | "validation"
  | "images"
  | "completed"
  | "failed";

export type QuizGenerateRequest = {
  categoryId: number;
  category: string;
  description: string;
  quizTitle?: string | null;
  totalQuestions: number;
  questionFormat: AiQuestionFormat;
  language?: string;
  document?: File | null;
};

export type QuizGenerateJobCreated = {
  job_id: string;
  status?: AiJobStatus;
};

export type AiJobProgress = {
  stage?: AiJobStage;
  completed_slots?: number;
  total_slots?: number;
};

export type AiJobError = {
  stage?: string;
  code?: string;
  message?: string;
};

export type AiGeneratedQuestion = {
  id: number;
  slot_id?: string;
  question: string;
  question_format?: AiQuestionFormat;
  option_a?: string | null;
  option_b?: string | null;
  option_c?: string | null;
  option_d?: string | null;
  correct_answer?: string | boolean | null;
  explanation?: string | null;
  topic?: string | null;
  difficulty?: string | null;
  image_prompt?: string | null;
  image_path?: string | null;
  image_url?: string | null;
  flagged?: boolean;
};

export type AiQuizResult = {
  metadata?: {
    quiz_title?: string;
    question_format?: AiQuestionFormat;
    total_questions?: number;
  };
  questions?: AiGeneratedQuestion[];
};

export type QuizGenerateJob = {
  job_id: string;
  category_id?: number;
  status: AiJobStatus;
  progress?: AiJobProgress;
  result?: AiQuizResult | null;
  errors?: AiJobError[];
};
