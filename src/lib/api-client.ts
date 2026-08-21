import axios from "axios";

import { env } from "@/config/env";
import { authStorage } from "@/lib/auth-storage";

declare module "axios" {
  interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

const apiClient = axios.create({
  baseURL: typeof window !== "undefined" ? "" : env.API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
  if (!config.skipAuth) {
    const token = authStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      authStorage.clear();
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
