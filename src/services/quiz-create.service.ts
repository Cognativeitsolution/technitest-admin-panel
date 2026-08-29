import apiClient from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/api.types";
import type {
  QuizQuestionsBulkCreatePayload,
  QuizQuestionsListQuery,
  QuizQuestionsListResult,
  QuizQuestionAdmin,
  QuizQuestionUpdatePayload,
} from "@/types/quiz-create.types";

const BASE_PATH = "/api/v1/quiz-create";

export const quizCreateService = {
  adminList: async (quizId: number, params?: QuizQuestionsListQuery) => {
    const { data } = await apiClient.get<ApiEnvelope<QuizQuestionsListResult>>(
      `${BASE_PATH}/${quizId}/admin-list`,
      { params },
    );
    return data.response.data;
  },

  bulkCreate: async (
    quizId: number,
    payload: QuizQuestionsBulkCreatePayload,
  ) => {
    const { data } = await apiClient.post<ApiEnvelope<unknown>>(
      `${BASE_PATH}/${quizId}/questions`,
      payload,
    );
    return data.response.data;
  },

  updateQuestion: async (
    quizId: number,
    questionId: number,
    payload: QuizQuestionUpdatePayload,
  ) => {
    const { data } = await apiClient.put<ApiEnvelope<QuizQuestionAdmin>>(
      `${BASE_PATH}/${quizId}/questions/${questionId}`,
      payload,
    );
    return data.response.data;
  },

  deleteQuestion: async (quizId: number, questionId: number) => {
    const { data } = await apiClient.delete<ApiEnvelope<unknown>>(
      `${BASE_PATH}/${quizId}/questions/${questionId}`,
    );
    return data.response.data;
  },

  restoreQuestion: async (quizId: number, questionId: number) => {
    const { data } = await apiClient.post<ApiEnvelope<QuizQuestionAdmin>>(
      `${BASE_PATH}/${quizId}/questions/${questionId}/restore`,
    );
    return data.response.data;
  },

  deleteOption: async (
    quizId: number,
    questionId: number,
    optionId: number,
  ) => {
    const { data } = await apiClient.delete<ApiEnvelope<unknown>>(
      `${BASE_PATH}/${quizId}/questions/${questionId}/options/${optionId}`,
    );
    return data.response.data;
  },

  developmentUserAnswers: async (quizId: number) => {
    const { data } = await apiClient.get<ApiEnvelope<unknown>>(
      `${BASE_PATH}/${quizId}/development_user-list_answers`,
    );
    return data.response.data;
  },
};