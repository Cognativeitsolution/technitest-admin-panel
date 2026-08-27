import type { PaginatedData } from "@/types/api.types";

export type QuizInfoCategory = {
  id: number;
  title: string;
  detail?: string;
};

export type QuizInfoListItem = {
  id: number;
  name: string;
  description?: string | null;
  difficulty_level?: string;
  skill_level?: string;
  category_id?: number;
  passing_score?: number;
  min_attempt?: number;
  shuffle_questions?: boolean;
  is_negative_marking?: boolean;
  negative_marking_value?: number;
  is_active?: boolean;
  image_url?: string | null;
  category?: QuizInfoCategory | null;
  total_questions?: number;
  total_duration?: number;
  average_rating?: number;
};

export type QuizInfoListResult = PaginatedData<QuizInfoListItem>;

export type QuizInfoQuery = {
  page?: number;
  per_page?: number;
};
