import apiClient from "@/lib/api-client";
import type { ApiEnvelope, PaginatedData } from "@/types/api.types";
import type { TradeItem, TradeListQuery, TradePayload } from "@/types/trade.types";

const BASE_PATH = "/api/v1/trades";
const PAGE_SIZE = 100;

function buildTradeFormData(payload?: TradePayload | null, image?: File | null) {
  const formData = new FormData();
  if (payload) {
    formData.append(
      "data",
      JSON.stringify({
        title: payload.title,
        detail: payload.detail,
      }),
    );
  }
  if (image) {
    formData.append("image", image);
  }
  return formData;
}

export const tradeService = {
  getAdminList: async (params?: TradeListQuery) => {
    const { data } = await apiClient.get<ApiEnvelope<PaginatedData<TradeItem>>>(
      `${BASE_PATH}/admin-list`,
      { params },
    );
    return data.response.data;
  },

  getAdminListAll: async () => {
    const first = await tradeService.getAdminList({
      page: 1,
      per_page: PAGE_SIZE,
    });
    const items = [...(first.items ?? [])];
    const totalPages = Math.max(1, first.total_pages ?? 1);

    for (let page = 2; page <= totalPages; page += 1) {
      const next = await tradeService.getAdminList({
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

  getById: async (tradeId: number) => {
    const { data } = await apiClient.get<ApiEnvelope<TradeItem>>(
      `${BASE_PATH}/${tradeId}`,
    );
    return data.response.data;
  },

  create: async (payload: TradePayload, image?: File | null) => {
    const { data } = await apiClient.post<ApiEnvelope<TradeItem>>(
      BASE_PATH,
      buildTradeFormData(payload, image),
    );
    return data.response.data;
  },

  update: async (
    tradeId: number,
    payload: TradePayload,
    image?: File | null,
  ) => {
    const { data } = await apiClient.put<ApiEnvelope<TradeItem>>(
      `${BASE_PATH}/${tradeId}`,
      buildTradeFormData(payload, image),
    );
    return data.response.data;
  },

  remove: async (tradeId: number) => {
    const { data } = await apiClient.delete<ApiEnvelope<unknown>>(
      `${BASE_PATH}/${tradeId}`,
    );
    return data;
  },

  restore: async (tradeId: number) => {
    const { data } = await apiClient.post<ApiEnvelope<TradeItem>>(
      `${BASE_PATH}/${tradeId}/restore`,
    );
    return data.response.data;
  },
};
