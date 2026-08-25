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

export type FeedbackAnalysisRecord = UserFeedbackRecord & {
  sentiment_status: string | null;
  sentiment_summary: string | null;
  sentiment_label: string | null;
  sentiment_confidence: number | null;
  sentiment_tone: string | null;
  recommendation_flag: string | null;
  analysis_note: string | null;
};

export type SubmitUserFeedbackInput = {
  quiz_info_id: number;
  target: string;
  rating: number;
  content: string;
};

export type UserFeedbackListResult = PaginatedData<UserFeedbackRecord>;
export type FeedbackAnalysisListResult = PaginatedData<FeedbackAnalysisRecord>;

export type UserFeedbackQuery = {
  page?: number;
  per_page?: number;
};
