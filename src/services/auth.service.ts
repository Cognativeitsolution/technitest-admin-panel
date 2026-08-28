import apiClient from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type {
  ChangePasswordPayload,
  LoginPayload,
  User,
} from "@/types/auth.types";

export const authService = {
  login: async (payload: LoginPayload) => {
    const { data } = await apiClient.post<ApiResponse<any>>(
      "/api/v1/auth/login",
      payload,
      { skipAuth: true },
    );
    return data;
  },

  getMe: async () => {
    const { data } = await apiClient.get<ApiResponse<User>>("/api/v1/auth/me");
    return data;
  },

  logout: async () => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      "/api/v1/auth/logout",
    );
    return data;
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      "/api/v1/auth/change-password",
      payload,
    );
    return data;
  },
};
