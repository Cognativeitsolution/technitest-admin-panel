"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { settingsService, type GeneralSettingsApiResponse } from "@/services/settings.service";

type GeneralSettingRow = {
  key: string;
  label: string;
  value: string;
};

const fieldLabels: Record<string, string> = {
  coin_value_usd: "Coin Value (USD)",
  footer_text: "Footer Text",
  footer_content: "Footer Content",
  contact_email: "Contact Email",
  contact_number: "Contact Number",
  website_email: "Website Email",
  location_address: "Location Address",
  social_instagram: "Instagram",
  social_linkedin: "LinkedIn",
  social_twitter: "Twitter/X",
  social_pinterest: "Pinterest",
  social_youtube: "YouTube",
  cancellation_fee: "Cancellation Fee",
  force_delete_scheduled_users_days: "Force Delete Days",
  soft_delete_scheduled_users_days: "Soft Delete Days",
  registration_coins: "Registration Coins",
  site_name: "Site Name",
  social_facebook: "Facebook",
};

function formatLabel(key: string) {
  return fieldLabels[key] ?? key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildRows(data: GeneralSettingsApiResponse | null | undefined): GeneralSettingRow[] {
  if (!data) return [];

  return Object.entries(data).map(([key, value]) => ({
    key,
    label: formatLabel(key),
    value: value?.value ?? "",
  }));
}

export function GeneralSettingsView() {
  const router = useRouter();
  const [rows, setRows] = useState<GeneralSettingRow[]>([]);
  const [originalRows, setOriginalRows] = useState<GeneralSettingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await settingsService.getGeneralSettings();
        const builtRows = buildRows(data);
        setRows(builtRows);
        setOriginalRows(JSON.parse(JSON.stringify(builtRows)));
      } catch (error) {
        toast.error("Failed to load general settings.");
      } finally {
        setLoading(false);
      }
    };

    void loadSettings();
  }, []);

  function hasChanges(): boolean {
    return rows.some(
      (row) =>
        originalRows.find((orig) => orig.key === row.key)?.value !== row.value,
    );
  }

  function handleFieldChange(key: string, value: string) {
    setRows((prev) =>
      prev.map((row) => (row.key === key ? { ...row, value } : row)),
    );
  }

  function handleDelete(key: string) {
    setRows((prev) =>
      prev.map((row) => (row.key === key ? { ...row, value: "" } : row)),
    );
  }

  async function handleSubmit() {
    const payload = Object.fromEntries(
      rows
        .filter((row) => {
          const originalValue = originalRows.find((orig) => orig.key === row.key)?.value ?? "";
          return row.value !== originalValue;
        })
        .map((row) => [row.key, row.value]),
    ) as Record<string, string>;

    if (Object.keys(payload).length === 0) {
      toast.info("No settings changed.");
      return;
    }

    try {
      setSaving(true);
      await settingsService.updateGeneralSettings(payload);
      toast.success("General settings updated successfully.");
      setOriginalRows(JSON.parse(JSON.stringify(rows)));
    } catch (error) {
      toast.error("Failed to update general settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[220px] items-center justify-center gap-3 text-[#6b7280]">
        <Loader2 className="size-5 animate-spin text-[#2563eb]" />
        <span>Loading general settings...</span>
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
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">General Settings</h1>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e5e7eb] bg-[#fafbfc] px-6 py-10 text-center text-sm font-medium text-[#6b7280]">
          No general settings found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((row) => (
            <div
              key={row.key}
              className="rounded-xl bg-transparent p-0"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <label className="text-[14px] font-medium text-[#111111]">
                  {row.label}
                </label>

                <button
                  type="button"
                  aria-label={`Delete ${row.label}`}
                  onClick={() => handleDelete(row.key)}
                  className="inline-flex size-8 items-center justify-center rounded-lg border border-[#fee2e2] bg-[#fef2f2] text-[#ef4444] transition hover:bg-[#fee2e2]"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <input
                type="text"
                value={row.value}
                onChange={(e) => handleFieldChange(row.key, e.target.value)}
                className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-[#f8fafc] px-5 text-[15px] text-[#4b5563] shadow-[0_1px_0_rgba(16,24,40,0.02)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:ring-0"
                placeholder={row.label}
              />
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        disabled={saving || !hasChanges()}
        onClick={handleSubmit}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {saving ? "Saving..." : "Submit"}
      </button>
    </div>
  );
}
