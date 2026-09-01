"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { notificationsService, type NotificationsApiResponse } from "@/services/notifications.service";

type NotificationRow = {
  key: string;
  label: string;
  value: boolean;
};

const notificationLabels: Record<string, string> = {
  certificate_issued: "Certificate Issued",
  certificate_expiry_reminder: "Certificate Expiry Reminder",
  payment_failed: "Payment Failed",
  payment_retry_reminder: "Payment Retry Reminder",
  abandoned_checkout_reminder: "Abandoned Checkout Reminder",
  coins_earned: "Coins Earned",
  coin_expiry_reminder: "Coin Expiry Reminder",
  referral_reward: "Referral Reward",
  quiz_session_expiry_reminder: "Quiz Session Expiry Reminder",
  password_reset: "Password Reset",
  change_password: "Change Password",
  security_updated: "Security Updated",
  profile_updated: "Profile Updated",
  roles_changed: "Roles Changed",
  account_status_changed: "Account Status Changed",
};

function formatLabel(key: string) {
  return notificationLabels[key] ?? key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildRows(data: NotificationsApiResponse | null | undefined): NotificationRow[] {
  if (!data) return [];

  return Object.entries(data).map(([key, value]) => {
    // Handle both formats: { id: number, value: boolean } or just boolean
    const boolValue = typeof value === "boolean" ? value : (value?.value ?? false);
    console.log(`buildRows - key: ${key}, rawValue:`, value, "extractedBoolValue:", boolValue);
    return {
      key,
      label: formatLabel(key),
      value: boolValue,
    };
  });
}

export function NotificationsSettingsView() {
  const router = useRouter();
  const [rows, setRows] = useState<NotificationRow[]>([]);
  const [originalRows, setOriginalRows] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await notificationsService.getNotifications();
        console.log("Raw notification data from API:", data);
        const builtRows = buildRows(data);
        console.log("Built rows from data:", builtRows);
        setRows(builtRows);
        setOriginalRows(JSON.parse(JSON.stringify(builtRows)));
      } catch (error) {
        toast.error("Failed to load notification settings.");
      } finally {
        setLoading(false);
      }
    };

    void loadNotifications();
  }, []);

  function hasChanges(): boolean {
    const hasAny = rows.some(
      (row) =>
        originalRows.find((orig) => orig.key === row.key)?.value !== row.value,
    );
    console.log("hasChanges() called:", hasAny, "rows:", rows, "originalRows:", originalRows);
    return hasAny;
  }

  function handleToggle(key: string) {
    console.log("=== TOGGLE START ===", "key:", key);
    console.log("Current rows before:", rows);
    console.log("Original rows:", originalRows);
    
    const currentRow = rows.find((r) => r.key === key);
    const originalRow = originalRows.find((r) => r.key === key);
    console.log("Current value:", currentRow?.value, "Original value:", originalRow?.value);

    setRows((prev) => {
      const updated = prev.map((row) => 
        row.key === key ? { ...row, value: !row.value } : row
      );
      console.log("Updated rows after toggle:", updated);
      const willChange = updated.some(
        (row) =>
          originalRows.find((orig) => orig.key === row.key)?.value !== row.value,
      );
      console.log("Will have changes:", willChange);
      console.log("=== TOGGLE END ===");
      return updated;
    });
  }

  async function handleSubmit() {
    if (!hasChanges()) {
      toast.info("No settings changed.");
      return;
    }

    // Send ALL notification values in payload
    const payload = Object.fromEntries(
      rows.map((row) => [row.key, row.value]),
    ) as Record<string, boolean>;

    console.log("=== SUBMIT START ===");
    console.log("Sending notification payload:", payload);
    console.log("Payload keys:", Object.keys(payload));
    console.log("Payload values:", Object.values(payload));

    try {
      setSaving(true);
      const result = await notificationsService.updateNotifications(payload);
      console.log("Notification update response:", result);
      toast.success("Notification settings updated successfully.");
      setOriginalRows(JSON.parse(JSON.stringify(rows)));
    } catch (error) {
      console.error("Notification update error:", error);
      toast.error("Failed to update notification settings.");
    } finally {
      setSaving(false);
      console.log("=== SUBMIT END ===");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[220px] items-center justify-center gap-3 text-[#6b7280]">
        <Loader2 className="size-5 animate-spin text-[#2563eb]" />
        <span>Loading notification settings...</span>
      </div>
    );
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
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
          Notification Settings
        </h1>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e5e7eb] bg-[#fafbfc] px-6 py-10 text-center text-sm font-medium text-[#6b7280]">
          No notification settings found.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div
              key={row.key}
              className="flex items-center justify-between rounded-2xl border border-[#e8ecf2] bg-white px-5 py-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)]"
            >
              <label htmlFor={row.key} className="flex-1 cursor-pointer text-[15px] font-medium text-[#111827]">
                {row.label}
              </label>

              <button
                id={row.key}
                type="button"
                onClick={() => {
                  console.log("BUTTON CLICKED:", row.key);
                  handleToggle(row.key);
                }}
                className="relative inline-flex h-8 w-14 cursor-pointer items-center rounded-full transition duration-300"
                style={{
                  backgroundColor: row.value ? "#10b981" : "#d1d5db",
                }}
                role="switch"
                aria-checked={row.value}
              >
                <span
                  className="inline-block h-7 w-7 transform rounded-full bg-white shadow-lg transition-transform duration-300"
                  style={{
                    transform: row.value ? "translateX(28px)" : "translateX(2px)",
                  }}
                />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4 space-y-3">
          <p className="text-sm font-semibold text-[#111827]">Debug Info:</p>
          
          <div>
            <p className="text-xs font-medium text-[#6b7280] mb-1">Changed Items:</p>
            {rows.filter((row) => originalRows.find((orig) => orig.key === row.key)?.value !== row.value).length > 0 ? (
              <div className="space-y-1">
                {rows
                  .filter((row) => originalRows.find((orig) => orig.key === row.key)?.value !== row.value)
                  .map((row) => {
                    const original = originalRows.find((orig) => orig.key === row.key)?.value;
                    return (
                      <p key={row.key} className="text-xs text-[#374151] bg-yellow-50 px-2 py-1 rounded border border-yellow-100">
                        <span className="font-mono font-bold">{row.key}</span>: {String(original)} → <span className="font-bold text-green-700">{String(row.value)}</span>
                      </p>
                    );
                  })}
              </div>
            ) : (
              <p className="text-xs text-[#9ca3af] italic">No changes yet</p>
            )}
          </div>
          
          <p className="text-sm text-[#6b7280]">
            Changes detected: <span className="font-bold text-lg">{hasChanges() ? "✅ YES" : "❌ NO"}</span>
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            disabled={saving || !hasChanges()}
            onClick={() => {
              console.log("Submit button clicked, hasChanges:", hasChanges());
              handleSubmit();
            }}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Saving..." : "Submit"}
          </button>

          <button
            type="button"
            onClick={() => {
              console.log("=== FORCE SUBMIT (ignoring hasChanges) ===");
              const payload = Object.fromEntries(
                rows.map((row) => [row.key, row.value]),
              ) as Record<string, boolean>;
              console.log("Force sending payload:", payload);
              notificationsService.updateNotifications(payload)
                .then((result) => {
                  console.log("Force submit response:", result);
                  toast.success("Settings updated!");
                })
                .catch((error) => {
                  console.error("Force submit error:", error);
                  toast.error("Error updating settings");
                });
            }}
            className="inline-flex h-11 items-center justify-center rounded-xl border-2 border-[#f0a500] bg-white px-6 text-sm font-semibold text-[#f0a500] transition hover:bg-[#fff9f0]"
          >
            Force Submit (Test)
          </button>
        </div>
      </div>
    </div>
  );
}
