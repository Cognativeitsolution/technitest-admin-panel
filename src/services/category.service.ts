import apiClient from "@/lib/api-client";
import type { ApiEnvelope, PaginatedData } from "@/types/api.types";
import type {
  CategoryItem,
  CategoryListQuery,
  CategoryPayload,
} from "@/types/category.types";

const BASE_PATH = "/api/v1/category";
const PAGE_SIZE = 100;

function buildCategoryFormData(
  payload?: CategoryPayload | null,
  image?: File | null,
) {
  const formData = new FormData();
  if (payload) {
    formData.append("data", JSON.stringify(payload));
  }
  if (image) {
    formData.append("image", image);
  }
  return formData;
}

export const categoryService = {
  getAdminList: async (params?: CategoryListQuery) => {
    const { data } = await apiClient.get<ApiEnvelope<PaginatedData<CategoryItem>>>(
      `${BASE_PATH}/admin-list`,
      { params },
    );
    return data.response.data;
  },

  getAdminListAll: async () => {
    const first = await categoryService.getAdminList({
      page: 1,
      per_page: PAGE_SIZE,
    });
    const items = [...(first.items ?? [])];
    const totalPages = Math.max(1, first.total_pages ?? 1);

    for (let page = 2; page <= totalPages; page += 1) {
      const next = await categoryService.getAdminList({
        page,
        per_page: PAGE_SIZE,
      });
      items.push(...(next.items ?? []));
    }

    return {
      items,
      total: first.total ?? items.length,
    };
  },

  getUserList: async (params?: CategoryListQuery) => {
    const { data } = await apiClient.get<ApiEnvelope<PaginatedData<CategoryItem>>>(
      `${BASE_PATH}/user-list`,
      { params },
    );
    return data.response.data;
  },

  getById: async (categoryId: number) => {
    const { data } = await apiClient.get<ApiEnvelope<CategoryItem>>(
      `${BASE_PATH}/${categoryId}`,
    );
    return data.response.data;
  },

  create: async (payload: CategoryPayload, image?: File | null) => {
    const { data } = await apiClient.post<ApiEnvelope<CategoryItem>>(
      BASE_PATH,
      buildCategoryFormData(payload, image),
    );
    return data.response.data;
  },

  update: async (
    categoryId: number,
    payload: CategoryPayload,
    image?: File | null,
  ) => {
    const { data } = await apiClient.put<ApiEnvelope<CategoryItem>>(
      `${BASE_PATH}/${categoryId}`,
      buildCategoryFormData(payload, image),
    );
    return data.response.data;
  },

  remove: async (categoryId: number) => {
    const { data } = await apiClient.delete<ApiEnvelope<unknown>>(
      `${BASE_PATH}/${categoryId}`,
    );
    return data;
  },

  restore: async (categoryId: number) => {
    const { data } = await apiClient.post<ApiEnvelope<CategoryItem>>(
      `${BASE_PATH}/${categoryId}/restore`,
    );
    return data.response.data;
  },
};
