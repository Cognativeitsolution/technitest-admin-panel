"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Switch } from "@/components/ui/switch";
import { defaultNotificationSettings } from "@/data/settings";
import type { NotificationSettingsValues } from "@/data/settings";

const notificationRows: { key: keyof NotificationSettingsValues; label: string; description: string }[] = [
  { key: "emailNotifications", label: "Email Notifications", description: "Send email notifications to users for important updates." },
  { key: "pushNotifications", label: "Push Notifications", description: "Enable browser push notifications for real-time alerts." },
  { key: "adminAlerts", label: "Admin Alerts", description: "Notify administrators of critical system events." },
  { key: "quizCompletion", label: "Quiz Completion Notifications", description: "Notify users when they complete a quiz." },
  { key: "certificateNotifications", label: "Certificate Notifications", description: "Notify users when a certificate is issued." },
  { key: "referralNotifications", label: "Referral Notifications", description: "Notify users about referral activity and rewards." },
  { key: "paymentNotifications", label: "Payment Notifications", description: "Notify users and admins of payment events." },
  { key: "userRegistration", label: "User Registration Notifications", description: "Notify admins when a new user registers." },
];

export function NotificationSettingsView() {
  const router = useRouter();
  const [form, setForm] = useState<NotificationSettingsValues>(defaultNotificationSettings);

  function toggle(key: keyof NotificationSettingsValues) {
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSave() {
    // save via API
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/settings")}
          aria-label="Back to settings"
          className="flex size-10 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white text-[#374151] transition hover:bg-[#f9fafb]"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">Notification Settings</h1>
      </div>

      <div className="space-y-1 rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
        {notificationRows.map((row, idx) => (
          <div key={row.key}>
            {idx > 0 ? <div className="mx-5 h-px bg-[#eef1f6]" /> : null}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="min-w-0 pr-4">
                <p className="text-sm font-semibold text-[#111827]">{row.label}</p>
                <p className="mt-0.5 text-[13px] text-[#6b7280]">{row.description}</p>
              </div>
              <Switch
                checked={form[row.key]}
                onCheckedChange={() => toggle(row.key)}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white transition hover:bg-[#d99400]"
      >
        Submit
      </button>
    </div>
  );
}
