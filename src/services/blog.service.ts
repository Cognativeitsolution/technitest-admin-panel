import apiClient from "@/lib/api-client";
import type { ApiEnvelope, PaginatedData } from "@/types/api.types";
import type {
  AutosaveBlogPayload,
  BlogDetail,
  BlogListItem,
  BlogListQuery,
  BlogRevision,
  CreateBlogPayload,
  UpdateBlogPayload,
} from "@/types/blog.types";

const BASE_PATH = "/api/v1/blogs";

export const blogService = {
  getPublicBlog: async (slug: string) => {
    const { data } = await apiClient.get<ApiEnvelope<BlogDetail>>(
      `${BASE_PATH}/public/${encodeURIComponent(slug)}`,
      { skipAuth: true },
    );
    return data.response.data;
  },

  listBlogs: async (params?: BlogListQuery) => {
    const { data } = await apiClient.get<
      ApiEnvelope<PaginatedData<BlogListItem>>
    >(BASE_PATH, { params });
    return data.response.data;
  },

  createBlog: async (payload: CreateBlogPayload) => {
    const { data } = await apiClient.post<ApiEnvelope<BlogDetail>>(
      BASE_PATH,
      payload,
    );
    return data.response.data;
  },

  getBlog: async (blogId: number) => {
    const { data } = await apiClient.get<ApiEnvelope<BlogDetail>>(
      `${BASE_PATH}/${blogId}`,
    );
    return data.response.data;
  },

  updateBlog: async (blogId: number, payload: UpdateBlogPayload) => {
    const { data } = await apiClient.put<ApiEnvelope<BlogDetail>>(
      `${BASE_PATH}/${blogId}`,
      payload,
    );
    return data.response.data;
  },

  deleteBlog: async (blogId: number) => {
    await apiClient.delete(`${BASE_PATH}/${blogId}`);
  },

  autosaveBlog: async (blogId: number, payload: AutosaveBlogPayload) => {
    const { data } = await apiClient.put<ApiEnvelope<BlogDetail>>(
      `${BASE_PATH}/${blogId}/autosave`,
      payload,
    );
    return data.response.data;
  },

  listRevisions: async (blogId: number) => {
    const { data } = await apiClient.get<ApiEnvelope<BlogRevision[]>>(
      `${BASE_PATH}/${blogId}/revisions`,
    );
    return data.response.data ?? [];
  },

  restoreRevision: async (blogId: number, revisionId: number) => {
    const { data } = await apiClient.post<ApiEnvelope<BlogDetail>>(
      `${BASE_PATH}/${blogId}/revisions/${revisionId}/restore`,
    );
    return data.response.data;
  },

  publishBlog: async (blogId: number) => {
    const { data } = await apiClient.post<ApiEnvelope<BlogDetail>>(
      `${BASE_PATH}/${blogId}/publish`,
    );
    return data.response.data;
  },

  unpublishBlog: async (blogId: number) => {
    const { data } = await apiClient.post<ApiEnvelope<BlogDetail>>(
      `${BASE_PATH}/${blogId}/unpublish`,
    );
    return data.response.data;
  },

  archiveBlog: async (blogId: number) => {
    const { data } = await apiClient.post<ApiEnvelope<BlogDetail>>(
      `${BASE_PATH}/${blogId}/archive`,
    );
    return data.response.data;
  },

  restoreBlog: async (blogId: number) => {
    const { data } = await apiClient.post<ApiEnvelope<BlogDetail>>(
      `${BASE_PATH}/${blogId}/restore`,
    );
    return data.response.data;
  },
};
