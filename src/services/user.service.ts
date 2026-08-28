import apiClient from "@/lib/api-client";
import type { ApiEnvelope, PaginatedData } from "@/types/api.types";
import type { ApiUser } from "@/types/user.types";

export type UserListQuery = {
  page?: number;
  per_page?: number;
  country_id?: string;
  start_date?: string;
  end_date?: string;
};

export const userService = {
  getUsers: async (params?: UserListQuery) => {
    const { data } = await apiClient.get<ApiEnvelope<PaginatedData<ApiUser>>>(
      "/api/v1/users",
      { params }
    );
    console.log("getUsers response data:", data);
    if (data.response && data.response.data) {
      return data.response.data;
    }
    return data as unknown as PaginatedData<ApiUser>;
  },
  getUserById: async (id: string | number) => {
    const { data } = await apiClient.get<ApiEnvelope<ApiUser>>(
      `/api/v1/users/${id}`
    );
    console.log("getUserById response data:", data);
    return data.response?.data || (data as unknown as ApiUser);
  },
  getUserCertificates: async (id: string | number) => {
    const { data } = await apiClient.get<unknown>(
      `/api/v1/users/${id}/certificates`
    );
    console.log("getUserCertificates response data:", data);
    return (data as any)?.response?.data || data;
  },
}; 
