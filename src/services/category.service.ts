import apiClient from "@/lib/api-client";
import type { ApiEnvelope, PaginatedData } from "@/types/api.types";
import type { CategoryItem } from "@/types/category.types";

export type CategoryListQuery = {
  page?: number;
  per_page?: number;
};

const BASE_PATH = "/api/v1/category";

export const categoryService = {
  getAdminList: async (params?: CategoryListQuery) => {
    const { data } = await apiClient.get<ApiEnvelope<PaginatedData<CategoryItem>>>(
      `${BASE_PATH}/admin-list`,
      { params },
    );
    return data.response.data;
  },

  getUserList: async (params?: CategoryListQuery) => {
    const { data } = await apiClient.get<ApiEnvelope<PaginatedData<CategoryItem>>>(
      `${BASE_PATH}/user-list`,
      { params },
    );
    return data.response.data;
  },
};
