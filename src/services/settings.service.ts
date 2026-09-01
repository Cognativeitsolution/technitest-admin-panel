import apiClient from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/api.types";
import type {
  CreateSettingPayload,
  GeneralSettingsApiResponse,
  SettingRecord,
  UpdateSettingPayload,
} from "@/types/setting.types";

const BASE = "/api/v1/settings";

export const settingsService = {
  getGeneralSettings: async () => {
    const { data } = await apiClient.get<
      ApiEnvelope<GeneralSettingsApiResponse>
    >(`${BASE}/general`);
    return data.response.data;
  },

  getSettingById: async (settingId: number) => {
    const { data } = await apiClient.get<ApiEnvelope<SettingRecord>>(
      `${BASE}/${settingId}`,
    );
    return data.response.data;
  },

  getSettingByKey: async (key: string) => {
    const { data } = await apiClient.get<ApiEnvelope<SettingRecord>>(
      `${BASE}/key/${key}`,
    );
    return data.response.data;
  },

  createSetting: async (payload: CreateSettingPayload) => {
    const { data } = await apiClient.post<ApiEnvelope<SettingRecord | string>>(
      BASE,
      payload,
    );

    const created = data.response.data;
    if (created && typeof created === "object" && "id" in created) {
      return created;
    }

    const { data: byKeyData } = await apiClient.get<ApiEnvelope<SettingRecord>>(
      `${BASE}/key/${payload.key}`,
    );
    return byKeyData.response.data;
  },

  updateSetting: async (settingId: number, payload: UpdateSettingPayload) => {
    const { data } = await apiClient.put<ApiEnvelope<SettingRecord>>(
      `${BASE}/${settingId}`,
      payload,
    );
    return data.response.data;
  },

  deleteSetting: async (settingId: number) => {
    const { data } = await apiClient.delete<ApiEnvelope<unknown>>(
      `${BASE}/${settingId}`,
    );
    return data;
  },
};

export type {
  CreateSettingPayload,
  GeneralSettingsApiResponse,
  SettingRecord,
  UpdateSettingPayload,
};
