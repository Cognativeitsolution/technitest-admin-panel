import apiClient from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/api.types";

export type Country = {
  id: number;
  name: string;
  code?: string;
};

export const locationService = {
  getCountries: async () => {
    const { data } = await apiClient.get<ApiEnvelope<Country[]>>(
      "/api/v1/locations/countries"
    );
    return data.response.data;
  },
};
