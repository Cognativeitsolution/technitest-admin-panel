import apiClient from "@/lib/api-client";
import type { ApiEnvelope, PaginatedData } from "@/types/api.types";
import type { ApiUser } from "@/types/user.types";

export type UserListQuery = {
  page?: number;
  per_page?: number;
  country?: string;
  date_from?: string;
  date_to?: string;
};

export const userService = {
  getUsers: async (params?: UserListQuery) => {
    const { data } = await apiClient.get<ApiEnvelope<PaginatedData<ApiUser>>>(
      "/api/v1/users",
      { params }
    );
    if (data.response && data.response.data) {
      return data.response.data;
    }
    return data as unknown as PaginatedData<ApiUser>;
  },
};
