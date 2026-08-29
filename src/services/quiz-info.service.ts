import apiClient from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/api.types";
import type {
  QuizInfoCreatePayload,
  QuizInfoFilterPayload,
  QuizInfoListItem,
  QuizInfoListResult,
  QuizInfoQuery,
  QuizInfoUpdatePayload,
} from "@/types/quiz-info.types";

const BASE_PATH = "/api/v1/quiz-info";

function toFormData(
  payload: QuizInfoCreatePayload | QuizInfoUpdatePayload,
  image?: File | null,
): FormData {
  const form = new FormData();
  form.append("data", JSON.stringify(payload));
  if (image) form.append("image", image);
  return form;
}

export const quizInfoService = {
  getAdminList: async (params?: QuizInfoQuery) => {
    const { data } = await apiClient.get<ApiEnvelope<QuizInfoListResult>>(
      `${BASE_PATH}/admin-list`,
      { params },
    );
    return data.response.data;
  },

  getById: async (quizId: number) => {
    const { data } = await apiClient.get<ApiEnvelope<QuizInfoListItem>>(
      `${BASE_PATH}/${quizId}`,
    );
    return data.response.data;
  },

  getNew: async (params?: QuizInfoQuery) => {
    const { data } = await apiClient.get<ApiEnvelope<QuizInfoListResult>>(
      `${BASE_PATH}/new`,
      { params },
    );
    return data.response.data;
  },

  filter: async (
    params: QuizInfoQuery,
    payload: QuizInfoFilterPayload,
  ) => {
    const { data } = await apiClient.post<ApiEnvelope<QuizInfoListResult>>(
      `${BASE_PATH}/filter`,
      payload,
      { params },
    );
    return data.response.data;
  },

  create: async (
    payload: QuizInfoCreatePayload,
    image?: File | null,
  ) => {
    const { data } = await apiClient.post<ApiEnvelope<QuizInfoListItem>>(
      `${BASE_PATH}/create`,
      toFormData(payload, image),
    );
    return data.response.data;
  },

  update: async (
    quizId: number,
    payload: QuizInfoUpdatePayload,
    image?: File | null,
  ) => {
    const { data } = await apiClient.put<ApiEnvelope<QuizInfoListItem>>(
      `${BASE_PATH}/${quizId}/update`,
      toFormData(payload, image),
    );
    return data.response.data;
  },

  delete: async (quizId: number) => {
    const { data } = await apiClient.delete<ApiEnvelope<unknown>>(
      `${BASE_PATH}/${quizId}/delete`,
    );
    return data.response.data;
  },

  restore: async (quizId: number) => {
    const { data } = await apiClient.post<ApiEnvelope<QuizInfoListItem>>(
      `${BASE_PATH}/${quizId}/restore`,
    );
    return data.response.data;
  },

  getAllAdminQuizzes: async () => {
    const perPage = 100;
    let page = 1;
    const items: QuizInfoListItem[] = [];

    while (true) {
      const result = await quizInfoService.getAdminList({
        page,
        per_page: perPage,
      });
      items.push(...(result.items ?? []));
      if (!result.has_next) break;
      page += 1;
      if (page > 50) break;
    }

    return items;
  },
};