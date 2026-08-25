import apiClient from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/api.types";
import type {
  FeedbackAnalysisListResult,
  SubmitUserFeedbackInput,
  UserFeedbackListResult,
  UserFeedbackQuery,
} from "@/types/user-feedback.types";

export const userFeedbackService = {
  getUserReviews: async (params?: UserFeedbackQuery) => {
    const { data } = await apiClient.get<ApiEnvelope<UserFeedbackListResult>>(
      "/api/v1/feedback/user-reviews",
      { params },
    );
    return data.response.data;
  },

  getUserReviewsAnalysis: async (params?: UserFeedbackQuery) => {
    const { data } = await apiClient.get<
      ApiEnvelope<FeedbackAnalysisListResult>
    >("/api/v1/feedback/user-reviews-analysis", { params });
    return data.response.data;
  },

  submitFeedback: async (payload: SubmitUserFeedbackInput) => {
    const body: SubmitUserFeedbackInput = {
      quiz_info_id: Number(payload.quiz_info_id),
      target: payload.target,
      rating: Number(payload.rating),
      content: payload.content,
    };
    const { data } = await apiClient.post<ApiEnvelope<unknown>>(
      "/api/v1/feedback/feedback",
      body,
    );
    return data;
  },
};
