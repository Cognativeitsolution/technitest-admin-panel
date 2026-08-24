import apiClient from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/api.types";

export type EnumOption = {
  value: string;
  label: string;
};

export const enumService = {
  getAll: async () => {
    const { data } = await apiClient.get<ApiEnvelope<Record<string, EnumOption[]>>>(
      "/api/v1/enums",
    );
    return data.response.data;
  },
};
