import type { PaginatedData } from "@/types/api.types";

export type UserFeedbackUser = {
  id: number;
  username: string;
  email: string;
};

export type UserFeedbackRecord = {
  id: number;
  user: UserFeedbackUser;
  target: string;
  rating: number;
  content: string | null;
  created_at: string;
};

export type SubmitUserFeedbackInput = {
  quiz_info_id: number;
  question_id?: number | null;
  target: string;
  rating: number;
  content: string;
};

export type UserFeedbackListResult = PaginatedData<UserFeedbackRecord>;

export type UserFeedbackQuery = {
  page?: number;
  per_page?: number;
};
