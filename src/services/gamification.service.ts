import apiClient from "@/lib/api-client";
import type { ApiEnvelope, PaginatedData } from "@/types/api.types";
import type {
  BadgePayload,
  BadgeRule,
  StarPayload,
  StarRuleRecord,
  StarsPaginatedData,
  TopScorerEntry,
} from "@/types/gamification.types";

export type PaginationQuery = {
  page?: number;
  per_page?: number;
};

export type CreateBadgeInput = {
  payload: BadgePayload;
  image?: File | null;
};

export type UpdateBadgeInput = {
  ruleId: number;
  payload?: BadgePayload;
  image?: File | null;
};

function buildBadgeFormData(payload?: BadgePayload, image?: File | null) {
  const formData = new FormData();
  if (payload) {
    formData.append("data", JSON.stringify(payload));
  }
  if (image) {
    formData.append("image", image);
  }
  return formData;
}

export const gamificationService = {
  getBadges: async () => {
    const { data } = await apiClient.get<ApiEnvelope<BadgeRule[]>>("/api/v1/badges");
    return data.response.data;
  },

  getBadgeById: async (ruleId: number) => {
    const { data } = await apiClient.get<ApiEnvelope<BadgeRule>>(`/api/v1/badges/${ruleId}`);
    return data.response.data;
  },

  getBadgeByLevel: async (level: string) => {
    const { data } = await apiClient.get<ApiEnvelope<BadgeRule>>(
      `/api/v1/badges/level/${encodeURIComponent(level)}`,
    );
    return data.response.data;
  },

  createBadge: async ({ payload, image }: CreateBadgeInput) => {
    await apiClient.post("/api/v1/badges", buildBadgeFormData(payload, image));
  },

  updateBadge: async ({ ruleId, payload, image }: UpdateBadgeInput) => {
    await apiClient.put(`/api/v1/badges/${ruleId}`, buildBadgeFormData(payload, image));
  },

  getStars: async (params?: PaginationQuery) => {
    const { data } = await apiClient.get<ApiEnvelope<StarsPaginatedData<StarRuleRecord>>>(
      "/api/v1/stars/",
      { params },
    );
    return data.response.data;
  },

  getStarById: async (starId: number) => {
    const { data } = await apiClient.get<ApiEnvelope<StarRuleRecord>>(`/api/v1/stars/${starId}`);
    return data.response.data;
  },

  createStar: async (payload: StarPayload) => {
    const { data } = await apiClient.post<ApiEnvelope<StarRuleRecord>>("/api/v1/stars/create", payload);
    return data.response.data;
  },

  updateStar: async (starId: number, payload: StarPayload) => {
    const { data } = await apiClient.put<ApiEnvelope<StarRuleRecord>>(
      `/api/v1/stars/${starId}/update`,
      payload,
    );
    return data.response.data;
  },

  deleteStar: async (starId: number) => {
    const { data } = await apiClient.delete<ApiEnvelope<StarRuleRecord>>(
      `/api/v1/stars/${starId}/delete`,
    );
    return data;
  },

  getPublicTopScorers: async (params?: PaginationQuery) => {
    const { data } = await apiClient.get<ApiEnvelope<PaginatedData<TopScorerEntry>>>(
      "/api/v1/top-scorer/public",
      { params },
    );
    return data.response.data;
  },

  getAdminTopScorers: async (params?: PaginationQuery) => {
    const { data } = await apiClient.get<ApiEnvelope<PaginatedData<TopScorerEntry>>>(
      "/api/v1/top-scorer/admin",
      { params },
    );
    return data.response.data;
  },

  toggleTopScorerFeatured: async (certificateId: number, isFeatured: boolean) => {
    await apiClient.patch(`/api/v1/top-scorer/admin/${certificateId}/toggle-featured`, {
      is_featured: isFeatured,
    });
  },
};
