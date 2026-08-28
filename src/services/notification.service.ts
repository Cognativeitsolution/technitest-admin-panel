import apiClient from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/api.types";
import type {
  NotificationRecord,
  NotificationsListResult,
  NotificationsQuery,
  UnreadCountResult,
} from "@/types/notification.types";

const BASE = "/api/v1/notifications";

export const notificationService = {
  getList: async (params?: NotificationsQuery) => {
    const { data } = await apiClient.get<ApiEnvelope<NotificationsListResult>>(
      BASE,
      { params },
    );
    return data.response.data;
  },

  getUnreadCount: async () => {
    const { data } = await apiClient.get<ApiEnvelope<UnreadCountResult>>(
      `${BASE}/unread-count`,
    );
    return data.response.data;
  },

  getUnread: async () => {
    const { data } = await apiClient.get<ApiEnvelope<NotificationRecord[]>>(
      `${BASE}/unread-notifications`,
    );
    return data.response.data;
  },

  markAsRead: async (notificationId: number) => {
    const { data } = await apiClient.put<ApiEnvelope<NotificationRecord>>(
      `${BASE}/${notificationId}/read`,
    );
    return data.response.data;
  },

  markAllAsRead: async () => {
    const { data } = await apiClient.put<ApiEnvelope<unknown>>(
      `${BASE}/read-all`,
    );
    return data;
  },
};