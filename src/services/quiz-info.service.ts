import apiClient from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/api.types";
import type {
  QuizInfoListItem,
  QuizInfoListResult,
  QuizInfoQuery,
} from "@/types/quiz-info.types";

export const quizInfoService = {
  getAdminList: async (params?: QuizInfoQuery) => {
    const { data } = await apiClient.get<ApiEnvelope<QuizInfoListResult>>(
      "/api/v1/quiz-info/admin-list",
      { params },
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
