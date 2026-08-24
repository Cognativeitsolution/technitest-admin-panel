import apiClient from "@/lib/api-client";
import type { ApiEnvelope, PaginatedData } from "@/types/api.types";
import type {
  AdminWallet,
  CoinHistoryItem,
  MyWallet,
  ReferralUser,
} from "@/types/coin-reward.types";

export type PaginationQuery = {
  page?: number;
  per_page?: number;
};

const BASE_PATH = "/api/v1/coin-reward";

export const coinRewardService = {
  getReferralUsers: async (params?: PaginationQuery) => {
    const { data } = await apiClient.get<ApiEnvelope<PaginatedData<ReferralUser>>>(
      `${BASE_PATH}/admin/referral-users`,
      { params },
    );
    return data.response.data;
  },

  getAdminWallets: async (params?: PaginationQuery) => {
    const { data } = await apiClient.get<ApiEnvelope<PaginatedData<AdminWallet>>>(
      `${BASE_PATH}/admin/wallets`,
      { params },
    );
    return data.response.data;
  },

  getAdminUserHistory: async (userId: number, params?: PaginationQuery) => {
    const { data } = await apiClient.get<ApiEnvelope<PaginatedData<CoinHistoryItem>>>(
      `${BASE_PATH}/admin/history/${userId}`,
      { params },
    );
    return data.response.data;
  },

  getMyWallet: async () => {
    const { data } = await apiClient.get<ApiEnvelope<MyWallet>>(`${BASE_PATH}/wallet/me`);
    return data.response.data;
  },

  getMyHistory: async (params?: PaginationQuery) => {
    const { data } = await apiClient.get<ApiEnvelope<PaginatedData<CoinHistoryItem>>>(
      `${BASE_PATH}/history/me`,
      { params },
    );
    return data.response.data;
  },
};
