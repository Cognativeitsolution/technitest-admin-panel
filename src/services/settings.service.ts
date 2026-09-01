import apiClient from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/api.types";

export type GeneralSettingItem = {
  id: number;
  value: string;
};

export type GeneralSettingsApiResponse = {
  coin_value_usd: GeneralSettingItem;
  footer_text: GeneralSettingItem;
  footer_content: GeneralSettingItem;
  contact_email: GeneralSettingItem;
  contact_number: GeneralSettingItem;
  website_email: GeneralSettingItem;
  location_address: GeneralSettingItem;
  social_instagram: GeneralSettingItem;
  social_linkedin: GeneralSettingItem;
  social_twitter: GeneralSettingItem;
  social_pinterest: GeneralSettingItem;
  social_youtube: GeneralSettingItem;
  cancellation_fee: GeneralSettingItem;
  force_delete_scheduled_users_days: GeneralSettingItem;
  soft_delete_scheduled_users_days: GeneralSettingItem;
  registration_coins: GeneralSettingItem;
  site_name: GeneralSettingItem;
  social_facebook: GeneralSettingItem;
};

const BASE = "/api/v1/settings";

export const settingsService = {
  getGeneralSettings: async () => {
    const { data } = await apiClient.get<ApiEnvelope<GeneralSettingsApiResponse>>(
      `${BASE}/general`,
    );

    return data.response.data;
  },

  updateGeneralSettings: async (payload: Record<string, string>) => {
    const { data } = await apiClient.put<ApiEnvelope<{ data: GeneralSettingsApiResponse }>>(
      `${BASE}/general`,
      payload,
    );

    return data.response.data;
  },
};
