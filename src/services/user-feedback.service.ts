import apiClient from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/api.types";
import type {
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

  submitFeedback: async (payload: SubmitUserFeedbackInput) => {
    const { data } = await apiClient.post<ApiEnvelope<unknown>>(
      "/api/v1/feedback/feedback",
      payload,
    );
    return data;
  },
};
