"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { ColorPicker } from "@/components/ui/color-picker";
import {
  defaultGeneralSettings,
  recordsPerPageOptions,
  quizAttemptsOptions,
  defaultUserRoleOptions,
  coinsExpiryOptions,
  certificateExpiryOptions,
} from "@/data/settings";
import type { GeneralSettingsValues } from "@/data/settings";

export function GeneralSettingsView() {
  const router = useRouter();
  const [form, setForm] = useState<GeneralSettingsValues>(defaultGeneralSettings);

  function update<K extends keyof GeneralSettingsValues>(key: K, value: GeneralSettingsValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSelect(key: keyof GeneralSettingsValues, options: string[]) {
    return (
      <select
        value={form[key]}
        onChange={(e) => update(key, e.target.value)}
        className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    );
  }

  function handleSubmit() {
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
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">General Settings</h1>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {/* Site Title */}
        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">
            Site Title<span className="ml-0.5 text-[#ff0000]">*</span>
          </label>
          <input
            type="text"
            value={form.siteTitle}
            onChange={(e) => update("siteTitle", e.target.value)}
            className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
          />
        </div>

        {/* Site Base Color */}
        <ColorPicker
          label="Site Base Color"
          value={form.siteBaseColor}
          onChange={(v) => update("siteBaseColor", v)}
        />

        {/* Records Per Page */}
        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">Record To Display Per Page</label>
          {handleSelect("recordsPerPage", recordsPerPageOptions)}
        </div>

        {/* Quiz Attempts */}
        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">Quiz Attempts Limit</label>
          {handleSelect("quizAttemptsLimit", quizAttemptsOptions)}
        </div>

        {/* Default User Role */}
        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">Default User Role</label>
          {handleSelect("defaultUserRole", defaultUserRoleOptions)}
        </div>

        {/* Coins Expiry */}
        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">Coins Expiry</label>
          {handleSelect("coinsExpiry", coinsExpiryOptions)}
        </div>

        {/* Certificate Expiry */}
        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">Certificate Expiry Duration</label>
          {handleSelect("certificateExpiry", certificateExpiryOptions)}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white transition hover:bg-[#d99400]"
      >
        Submit
      </button>
    </div>
  );
}
