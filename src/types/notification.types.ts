import type { PaginatedData } from "@/types/api.types";

export type NotificationType = "info" | "success" | "warning" | "error" | "reminder";

export type NotificationRecord = {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: NotificationType;
  related_type: string | null;
  related_id: number | null;
  is_read: boolean;
  read_at: string | null;
  meta_data: Record<string, unknown> | null;
  created_at: string;
};

export type NotificationsListResult = PaginatedData<NotificationRecord>;

export type NotificationsQuery = {
  page?: number;
  per_page?: number;
};

export type UnreadCountResult = {
  unread_count: number;
};

export const NOTIFICATION_TYPE_OPTIONS: NotificationType[] = [
  "info",
  "success",
  "warning",
  "error",
  "reminder",
];