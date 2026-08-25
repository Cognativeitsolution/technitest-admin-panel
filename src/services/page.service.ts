import apiClient from "@/lib/api-client";
import type { ApiEnvelope, PaginatedData } from "@/types/api.types";
import type {
  CreatePagePayload,
  NavbarItem,
  PageDetail,
  PageDropdownItem,
  PageListItem,
  PageListQuery,
  UpdatePagePayload,
} from "@/types/page.types";

const BASE_PATH = "/api/v1/pages";

export const pageService = {
  getPublicNavbar: async () => {
    const { data } = await apiClient.get<ApiEnvelope<NavbarItem[]>>(
      `${BASE_PATH}/public/navbar`,
      { skipAuth: true },
    );
    return data.response.data;
  },

  getPublicPage: async (slug: string) => {
    const { data } = await apiClient.get<ApiEnvelope<PageDetail>>(
      `${BASE_PATH}/public/${encodeURIComponent(slug)}`,
      { skipAuth: true },
    );
    return data.response.data;
  },

  listPages: async (params?: PageListQuery) => {
    const { data } = await apiClient.get<
      ApiEnvelope<PaginatedData<PageListItem>>
    >(BASE_PATH, { params });
    return data.response.data;
  },

  createPage: async (payload: CreatePagePayload) => {
    const { data } = await apiClient.post<ApiEnvelope<PageDetail>>(
      BASE_PATH,
      payload,
    );
    return data.response.data;
  },

  getDropdown: async () => {
    const { data } = await apiClient.get<ApiEnvelope<PageDropdownItem[]>>(
      `${BASE_PATH}/dropdown`,
    );
    return data.response.data;
  },

  getPage: async (pageId: number) => {
    const { data } = await apiClient.get<ApiEnvelope<PageDetail>>(
      `${BASE_PATH}/${pageId}`,
    );
    return data.response.data;
  },

  updatePage: async (pageId: number, payload: UpdatePagePayload) => {
    const { data } = await apiClient.put<ApiEnvelope<PageDetail>>(
      `${BASE_PATH}/${pageId}`,
      payload,
    );
    return data.response.data;
  },

  deletePage: async (pageId: number) => {
    await apiClient.delete(`${BASE_PATH}/${pageId}`);
  },

  publishPage: async (pageId: number) => {
    const { data } = await apiClient.post<ApiEnvelope<PageDetail>>(
      `${BASE_PATH}/${pageId}/publish`,
    );
    return data.response.data;
  },

  unpublishPage: async (pageId: number) => {
    const { data } = await apiClient.post<ApiEnvelope<PageDetail>>(
      `${BASE_PATH}/${pageId}/unpublish`,
    );
    return data.response.data;
  },

  archivePage: async (pageId: number) => {
    const { data } = await apiClient.post<ApiEnvelope<PageDetail>>(
      `${BASE_PATH}/${pageId}/archive`,
    );
    return data.response.data;
  },

  restorePage: async (pageId: number) => {
    const { data } = await apiClient.post<ApiEnvelope<PageDetail>>(
      `${BASE_PATH}/${pageId}/restore`,
    );
    return data.response.data;
  },
};
