import apiClient from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/api.types";
import type {
  NotificationSettingsApiResponse,
  NotificationSettingsUpdatePayload,
} from "@/types/notification-settings.types";

const BASE = "/api/v1/settings/notifications";

export const notificationsService = {
  getNotifications: async () => {
    const { data } = await apiClient.get<
      ApiEnvelope<NotificationSettingsApiResponse>
    >(BASE);
    return data.response.data;
  },

  updateNotifications: async (payload: NotificationSettingsUpdatePayload) => {
    const { data } = await apiClient.put<
      ApiEnvelope<NotificationSettingsApiResponse>
    >(BASE, payload);
    return data.response.data;
  },
};
