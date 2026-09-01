"use client";

import { ArrowLeft, Bell, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Switch } from "@/components/ui/switch";
import { useNotificationSettings } from "@/hooks/settings/use-notification-settings";
import {
  NOTIFICATION_SETTING_KEYS,
  NOTIFICATION_SETTING_LABELS,
} from "@/types/notification-settings.types";

export function NotificationsSettingsView() {
  const router = useRouter();
  const { settings, loading, updatingKey, toggleSetting } =
    useNotificationSettings();

  if (loading) {
    return (
      <div className="flex min-h-[220px] items-center justify-center gap-3 text-[#6b7280]">
        <Loader2 className="size-5 animate-spin text-[#2563eb]" />
        <span>Loading notification settings...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl space-y-6 pl-3 sm:pl-5 lg:pl-8">
      <div className="flex items-start gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => router.push("/settings")}
          aria-label="Back to settings"
          className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white text-[#374151] transition hover:bg-[#f9fafb]"
        >
          <ArrowLeft className="size-5" />
        </button>

        <div className="min-w-0 space-y-1">
          <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
            Notification Settings
          </h1>
          <p className="text-sm text-[#6b7280]">
            Control which email and system notifications are sent to users.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {NOTIFICATION_SETTING_KEYS.map((key) => {
          const isUpdating = updatingKey === key;
          const isEnabled = settings[key] ?? false;

          return (
            <div
              key={key}
              className="flex items-center justify-between gap-4 rounded-2xl border border-[#e8ecf2] bg-white px-5 py-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)] transition hover:border-[#dbeafe] hover:shadow-[0_4px_12px_rgba(37,99,235,0.08)]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                    isEnabled
                      ? "bg-[#eff6ff] text-[#2563eb]"
                      : "bg-[#f3f4f6] text-[#9ca3af]"
                  }`}
                >
                  <Bell className="size-4" />
                </span>
                <p className="min-w-0 text-sm font-semibold leading-snug text-[#111827]">
                  {NOTIFICATION_SETTING_LABELS[key]}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {isUpdating ? (
                  <Loader2 className="size-4 animate-spin text-[#2563eb]" />
                ) : null}
                <Switch
                  checked={isEnabled}
                  onCheckedChange={() => void toggleSetting(key)}
                  className={isUpdating ? "pointer-events-none opacity-70" : undefined}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
