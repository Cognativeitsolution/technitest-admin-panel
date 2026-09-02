"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2, Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { CreateSettingDialog } from "@/components/settings/create-setting-dialog";
import { SettingEditDialog } from "@/components/settings/setting-edit-dialog";
import { ApiError } from "@/lib/api-error";
import {
  settingsService,
  type CreateSettingPayload,
  type GeneralSettingsApiResponse,
  type SettingRecord,
  type UpdateSettingPayload,
} from "@/services/settings.service";
import { formatSettingLabel } from "@/types/setting.types";

type GeneralSettingRow = {
  id: number;
  key: string;
  label: string;
  value: string;
};

function buildRows(
  data: GeneralSettingsApiResponse | null | undefined,
): GeneralSettingRow[] {
  if (!data) return [];

  return Object.entries(data).map(([key, item]) => ({
    id: item.id,
    key,
    label: formatSettingLabel(key),
    value: item.value ?? "",
  }));
}

function settingToRow(setting: SettingRecord): GeneralSettingRow {
  return {
    id: setting.id,
    key: setting.key,
    label: formatSettingLabel(setting.key),
    value: setting.value ?? "",
  };
}

function mergeSettingRows(
  apiRows: GeneralSettingRow[],
  supplementalRows: GeneralSettingRow[],
): GeneralSettingRow[] {
  const apiKeys = new Set(apiRows.map((row) => row.key));
  const extras = supplementalRows.filter((row) => !apiKeys.has(row.key));
  return [...apiRows, ...extras];
}

import { toast } from "sonner";

export function GeneralSettingsView() {
  const router = useRouter();
  const [rows, setRows] = useState<GeneralSettingRow[]>([]);
  const [originalRows, setOriginalRows] = useState<GeneralSettingRow[]>([]);
  const [supplementalRows, setSupplementalRows] = useState<GeneralSettingRow[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<SettingRecord | null>(
    null,
  );
  const [editLoading, setEditLoading] = useState(false);
  const [dialogSubmitting, setDialogSubmitting] = useState(false);

  const applyRows = useCallback(
    (apiRows: GeneralSettingRow[], extras: GeneralSettingRow[]) => {
      const merged = mergeSettingRows(apiRows, extras);
      setRows(merged);
      setOriginalRows(JSON.parse(JSON.stringify(merged)) as GeneralSettingRow[]);
      return merged;
    },
    [],
  );

  const loadSettings = useCallback(
    async (options?: { extras?: GeneralSettingRow[] }) => {
      const extras = options?.extras ?? supplementalRows;
      const data = await settingsService.getGeneralSettings();
      const apiRows = buildRows(data);
      return applyRows(apiRows, extras);
    },
    [applyRows, supplementalRows],
  );

  const refreshSettings = useCallback(
    async (options?: { extras?: GeneralSettingRow[] }) => {
      setRefreshing(true);
      try {
        await loadSettings(options);
      } catch (error) {
        toast.error(
          ApiError.fromAxiosError(error).message ||
            "Failed to refresh general settings.",
        );
        throw error;
      } finally {
        setRefreshing(false);
      }
    },
    [loadSettings],
  );

  useEffect(() => {
    const init = async () => {
      try {
        await loadSettings();
      } catch (error) {
        toast.error(
          ApiError.fromAxiosError(error).message ||
            "Failed to load general settings.",
        );
      } finally {
        setLoading(false);
      }
    };

    void init();
  }, [loadSettings]);

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

  async function handleEditClick(id: number) {
    setEditDialogOpen(true);
    setEditLoading(true);
    setEditingSetting(null);

    try {
      const setting = await settingsService.getSettingById(id);
      setEditingSetting(setting);
    } catch (error) {
      setEditDialogOpen(false);
      toast.error(
        ApiError.fromAxiosError(error).message || "Failed to load setting.",
      );
    } finally {
      setEditLoading(false);
    }
  }

  async function handleInlineSubmit() {
    const changedRows = rows.filter((row) => {
      const originalValue =
        originalRows.find((orig) => orig.key === row.key)?.value ?? "";
      return row.value !== originalValue;
    });

    if (changedRows.length === 0) {
      toast.info("No settings changed.");
      return;
    }

    try {
      setSaving(true);
      await Promise.all(
        changedRows.map((row) =>
          settingsService.updateSetting(row.id, { value: row.value }),
        ),
      );
      toast.success("General settings updated successfully.");
      setOriginalRows(JSON.parse(JSON.stringify(rows)) as GeneralSettingRow[]);
    } catch (error) {
      toast.error(
        ApiError.fromAxiosError(error).message ||
          "Failed to update general settings.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDialogSave(
    settingId: number,
    payload: UpdateSettingPayload,
  ): Promise<boolean> {
    try {
      setDialogSubmitting(true);
      await settingsService.updateSetting(settingId, payload);
      toast.success("Setting updated successfully.");
      await refreshSettings();
      return true;
    } catch (error) {
      toast.error(
        ApiError.fromAxiosError(error).message || "Failed to update setting.",
      );
      return false;
    } finally {
      setDialogSubmitting(false);
    }
  }

  async function handleDialogDelete(settingId: number): Promise<boolean> {
    try {
      setDialogSubmitting(true);
      await settingsService.deleteSetting(settingId);
      toast.success("Setting deleted successfully.");
      setSupplementalRows((prev) => prev.filter((row) => row.id !== settingId));
      await refreshSettings({
        extras: supplementalRows.filter((row) => row.id !== settingId),
      });
      return true;
    } catch (error) {
      toast.error(
        ApiError.fromAxiosError(error).message || "Failed to delete setting.",
      );
      return false;
    } finally {
      setDialogSubmitting(false);
    }
  }

  async function handleCreateSetting(
    payload: CreateSettingPayload,
  ): Promise<boolean> {
    try {
      setDialogSubmitting(true);
      setRefreshing(true);

      const created = await settingsService.createSetting(payload);
      const createdRow = settingToRow(created);

      const nextSupplemental = supplementalRows.some(
        (row) => row.key === createdRow.key,
      )
        ? supplementalRows.map((row) =>
            row.key === createdRow.key ? createdRow : row,
          )
        : [...supplementalRows, createdRow];

      setSupplementalRows(nextSupplemental);
      toast.success("Setting created successfully.");
      await loadSettings({ extras: nextSupplemental });
      return true;
    } catch (error) {
      toast.error(
        ApiError.fromAxiosError(error).message || "Failed to create setting.",
      );
      return false;
    } finally {
      setDialogSubmitting(false);
      setRefreshing(false);
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
    <div className="w-full max-w-6xl space-y-6 pl-3 sm:pl-5 lg:pl-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
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
              General Settings
            </h1>
            <p className="text-sm text-[#6b7280]">
              Edit values inline or use the edit icon for full setting details.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCreateDialogOpen(true)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
        >
          <Plus className="size-4" />
          Add Setting
        </button>
      </div>

      {rows.length === 0 && !refreshing ? (
        <div className="rounded-2xl border border-dashed border-[#e5e7eb] bg-[#fafbfc] px-6 py-10 text-center text-sm font-medium text-[#6b7280]">
          No general settings found.
        </div>
      ) : (
        <div className="relative">
          {refreshing ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur-[1px]">
              <div className="flex items-center gap-3 rounded-xl border border-[#e5e7eb] bg-white px-5 py-3 shadow-sm">
                <Loader2 className="size-5 animate-spin text-[#2563eb]" />
                <span className="text-sm font-medium text-[#374151]">
                  Refreshing settings...
                </span>
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {rows.map((row) => (
              <div key={row.key} className="rounded-xl bg-transparent p-0">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <label className="text-[14px] font-medium text-[#111111]">
                    {row.label}
                  </label>

                  <button
                    type="button"
                    aria-label={`Edit ${row.label}`}
                    onClick={() => void handleEditClick(row.id)}
                    className="inline-flex size-8 items-center justify-center rounded-lg border border-[#dbeafe] bg-[#eff6ff] text-[#2563eb] transition hover:bg-[#dbeafe]"
                  >
                    <Pencil className="size-4" />
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
        </div>
      )}

      {rows.length > 0 ? (
        <button
          type="button"
          disabled={saving || !hasChanges()}
          onClick={() => void handleInlineSubmit()}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "Saving..." : "Submit"}
        </button>
      ) : null}

      <SettingEditDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingSetting(null);
        }}
        setting={editingSetting}
        loading={editLoading}
        submitting={dialogSubmitting}
        onSave={handleDialogSave}
        onDelete={handleDialogDelete}
      />

      <CreateSettingDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        submitting={dialogSubmitting}
        onSubmit={handleCreateSetting}
      />
    </div>
  );
}
