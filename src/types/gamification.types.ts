export type BadgeDifficultyLevel = "beginner" | "intermediate" | "advanced";
export type BadgeType = "free" | "paid";

export const difficultyLevelOptions: BadgeDifficultyLevel[] = ["beginner", "intermediate", "advanced"];
export const badgeTypeOptions: BadgeType[] = ["free", "paid"];

export type BadgeRule = {
  id: number;
  badge_name: string;
  difficulty_level: string;
  type: string;
  price: number;
  validity_years: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type BadgePayload = {
  badge_name: string;
  difficulty_level: string;
  type: string;
  price: number;
  validity_years: number;
};

export type StarRuleRecord = {
  id: number;
  name: string;
  stars_count: number;
  min_percentage: number;
  max_percentage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  criteria: string;
};

export type StarPayload = {
  name: string;
  stars_count: number;
  min_percentage: number;
  max_percentage: number;
};

export type StarsPaginatedData<T> = {
  items: T[];
  total: number;
};

export type TopScorerEntry = {
  certificate_id: number;
  quiz_attempt_id: number;
  username: string;
  email: string;
  score: number;
  percentage: number;
  quiz_name: string;
  level: string;
  category_title: string;
  certificate_status: string;
  date_performed: string;
  is_featured: boolean;
};
