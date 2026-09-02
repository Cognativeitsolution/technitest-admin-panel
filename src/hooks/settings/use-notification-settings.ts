"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api-error";
import { notificationsService } from "@/services/notifications.service";
import {
  mapNotificationSettingsResponse,
  NOTIFICATION_SETTING_KEYS,
  type NotificationSettingKey,
  type NotificationSettingsUpdatePayload,
} from "@/types/notification-settings.types";

function createDefaultSettings(): NotificationSettingsUpdatePayload {
  return NOTIFICATION_SETTING_KEYS.reduce((acc, key) => {
    acc[key] = false;
    return acc;
  }, {} as NotificationSettingsUpdatePayload);
}

export function useNotificationSettings() {
  const [settings, setSettings] =
    useState<NotificationSettingsUpdatePayload>(createDefaultSettings);
  const [loading, setLoading] = useState(true);
  const [updatingKey, setUpdatingKey] = useState<NotificationSettingKey | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    const loadSettings = async () => {
      try {
        const data = await notificationsService.getNotifications();
        if (cancelled) return;
        setSettings(mapNotificationSettingsResponse(data));
      } catch (error) {
        if (cancelled) return;
        toast.error(
          ApiError.fromAxiosError(error).message ||
            "Failed to load notification settings.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleSetting = useCallback(
    async (key: NotificationSettingKey) => {
      const previousValue = settings[key] ?? false;
      const nextValue = !previousValue;

      setSettings((current) => ({ ...current, [key]: nextValue }));
      setUpdatingKey(key);

      try {
        await notificationsService.updateNotifications({ [key]: nextValue });
      } catch (error) {
        setSettings((current) => ({ ...current, [key]: previousValue }));
        toast.error(
          ApiError.fromAxiosError(error).message ||
            "Failed to update notification setting.",
        );
      } finally {
        setUpdatingKey(null);
      }
    },
    [settings],
  );

  return {
    settings,
    loading,
    updatingKey,
    toggleSetting,
  };
}
