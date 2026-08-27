import type { PaginatedData } from "@/types/api.types";

export type QuizInfoListItem = {
  id: number;
  name: string;
  description?: string | null;
  difficulty_level?: string;
  skill_level?: string;
  category_id?: number;
  is_active?: boolean;
  category?: {
    id: number;
    title: string;
    detail?: string;
  } | null;
};

export type QuizInfoListResult = PaginatedData<QuizInfoListItem>;

export type QuizInfoQuery = {
  page?: number;
  per_page?: number;
};
