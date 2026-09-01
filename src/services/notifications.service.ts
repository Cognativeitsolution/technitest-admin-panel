import apiClient from "@/lib/api-client";
import { ApiEnvelope } from "@/types/api.types";

const BASE = "/api/v1/settings/notifications";

export interface NotificationData {
  id: number;
  value: boolean;
}

export interface NotificationsApiResponse {
  certificate_issued?: NotificationData;
  certificate_expiry_reminder?: NotificationData;
  payment_failed?: NotificationData;
  payment_retry_reminder?: NotificationData;
  abandoned_checkout_reminder?: NotificationData;
  coins_earned?: NotificationData;
  coin_expiry_reminder?: NotificationData;
  referral_reward?: NotificationData;
  quiz_session_expiry_reminder?: NotificationData;
  password_reset?: NotificationData;
  change_password?: NotificationData;
  security_updated?: NotificationData;
  profile_updated?: NotificationData;
  roles_changed?: NotificationData;
  account_status_changed?: NotificationData;
}

export const notificationsService = {
  getNotifications: async () => {
    const { data } = await apiClient.get<ApiEnvelope<NotificationsApiResponse>>(BASE);
    return data.response.data;
  },

  updateNotifications: async (payload: Record<string, boolean>) => {
    console.log("Making PUT request to:", BASE, "with payload:", payload);
    try {
      const response = await apiClient.put<ApiEnvelope<NotificationsApiResponse>>(
        BASE,
        payload,
      );
      console.log("PUT response:", response);
      return response.data.response.data;
    } catch (error) {
      console.error("PUT request failed:", error);
      throw error;
    }
  },
};
