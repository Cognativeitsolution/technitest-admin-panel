import apiClient from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/api.types";
import type {
  FaqPayload,
  FaqRecord,
  FaqsListResult,
  FaqsQuery,
  FaqUpdatePayload,
} from "@/types/faq.types";

const PAGE_SIZE = 100;

export const faqService = {
  getAdminList: async (params?: FaqsQuery) => {
    const { data } = await apiClient.get<ApiEnvelope<FaqsListResult>>(
      "/api/v1/faqs/admin/list",
      { params },
    );
    return data.response.data;
  },

  getAdminListAll: async (params?: Omit<FaqsQuery, "page" | "per_page">) => {
    const first = await faqService.getAdminList({
      ...params,
      page: 1,
      per_page: PAGE_SIZE,
    });
    const items = [...(first.items ?? [])];
    const totalPages = Math.max(1, first.total_pages ?? 1);

    for (let page = 2; page <= totalPages; page += 1) {
      const next = await faqService.getAdminList({
        ...params,
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

  getById: async (faqId: number) => {
    const { data } = await apiClient.get<ApiEnvelope<FaqRecord>>(
      `/api/v1/faqs/${faqId}`,
    );
    return data.response.data;
  },

  bulkCreate: async (items: FaqPayload[]) => {
    const { data } = await apiClient.post<ApiEnvelope<FaqRecord[]>>(
      "/api/v1/faqs",
      { items },
    );
    return data.response.data;
  },

  update: async (faqId: number, payload: FaqUpdatePayload) => {
    const { data } = await apiClient.put<ApiEnvelope<FaqRecord>>(
      `/api/v1/faqs/${faqId}`,
      payload,
    );
    return data.response.data;
  },

  remove: async (faqId: number) => {
    const { data } = await apiClient.delete<ApiEnvelope<unknown>>(
      `/api/v1/faqs/${faqId}`,
    );
    return data;
  },

  restore: async (faqId: number) => {
    const { data } = await apiClient.post<ApiEnvelope<FaqRecord>>(
      `/api/v1/faqs/${faqId}/restore`,
    );
    return data.response.data;
  },
};
