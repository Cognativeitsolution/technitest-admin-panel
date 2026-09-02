import apiClient from "@/lib/api-client";
import { ApiEnvelope } from "@/types/api.types";

const BASE = "/api/v1/settings/logos";

export interface LogoData {
  id: number;
  value: string;
}

export interface LogosApiResponse {
  logo?: LogoData;
  dark_logo?: LogoData;
  favicon?: LogoData;
}

export const logosService = {
  getLogos: async () => {
    const { data } = await apiClient.get<ApiEnvelope<LogosApiResponse>>(BASE);
    return data.response.data;
  },

  updateLogos: async (formData: FormData) => {
    const { data } = await apiClient.post<ApiEnvelope<LogosApiResponse>>(
      BASE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data.response.data;
  },
};
