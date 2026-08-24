import apiClient from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/api.types";
import type {
  RewardRule,
  RewardRuleListData,
  UpdateRewardRulePayload,
} from "@/types/reward-rule.types";

const BASE_PATH = "/api/v1/reward-rules";

export const rewardRuleService = {
  getAdminRules: async (params?: { page?: number; per_page?: number }) => {
    const { data } = await apiClient.get<ApiEnvelope<RewardRuleListData>>(
      `${BASE_PATH}/admin-list`,
      { params },
    );
    return data.response.data;
  },

  getRule: async (ruleId: number) => {
    const { data } = await apiClient.get<ApiEnvelope<RewardRule>>(
      `${BASE_PATH}/${ruleId}`,
    );
    return data.response.data;
  },

  updateRule: async (ruleId: number, payload: UpdateRewardRulePayload) => {
    const { data } = await apiClient.put<ApiEnvelope<RewardRule>>(
      `${BASE_PATH}/${ruleId}`,
      payload,
    );
    return data.response.data;
  },

  deleteRule: async (ruleId: number) => {
    const { data } = await apiClient.delete<
      ApiEnvelope<{ detail: string }>
    >(`${BASE_PATH}/${ruleId}`);
    return data.response.data;
  },

  restoreRule: async (ruleId: number) => {
    const { data } = await apiClient.post<ApiEnvelope<RewardRule>>(
      `${BASE_PATH}/${ruleId}/restore`,
    );
    return data.response.data;
  },
};
