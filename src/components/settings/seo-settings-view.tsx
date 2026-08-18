"use client";

import { useState } from "react";
import { ArrowLeft, Camera } from "lucide-react";
import { useRouter } from "next/navigation";

import { TagsInput } from "@/components/ui/tags-input";
import {
  defaultSeoSettings,
  sitePageOptions,
  metaRobotsOptions,
} from "@/data/settings";
import type { SeoSettingsValues } from "@/data/settings";

export function SeoSettingsView() {
  const router = useRouter();
  const [form, setForm] = useState<SeoSettingsValues>(defaultSeoSettings);

  function update<K extends keyof SeoSettingsValues>(key: K, value: SeoSettingsValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
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
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">SEO Configuration</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[35%_65%]">
        {/* Left — OG Image */}
        <div className="space-y-3">
          <h3 className="text-[16px] font-bold text-[#111827]">OG Tags</h3>
          <div className="relative overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white">
            <div className="aspect-[1180/600] w-full bg-[#eff6ff]">
              {form.ogImageUrl ? (
                <div className="flex size-full items-center justify-center text-sm text-[#6b7280]">Image uploaded</div>
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-2 text-[#9ca3af]">
                  <Camera className="size-10" />
                  <span className="text-sm">No image uploaded</span>
                </div>
              )}
            </div>
            <label className="absolute bottom-3 right-3 flex size-9 cursor-pointer items-center justify-center rounded-full bg-[#2563eb] text-white shadow-lg transition hover:bg-[#1d4ed8]">
              <Camera className="size-4" />
              <input
                type="file"
                accept=".png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) update("ogImageUrl", URL.createObjectURL(file));
                }}
              />
            </label>
          </div>
          <p className="text-[12px] text-[#6b7280]">Supported Files: png, jpg, jpeg. Image will be resized into 1180x600px</p>
        </div>

        {/* Right — Form */}
        <div className="space-y-5">
          <div className="flex flex-col gap-[10px]">
            <div className="flex items-center justify-between">
              <label className="text-[14px] font-medium text-[#111111]">Meta Keywords</label>
              <span className="text-[12px] text-[#6b7280]">Separate multiple keywords by comma(,) or enter key</span>
            </div>
            <TagsInput
              label=""
              tags={form.keywords}
              onChange={(v) => update("keywords", v)}
              placeholder="Type keyword and press Enter"
            />
          </div>

          <div className="flex flex-col gap-[10px]">
            <label className="text-[14px] font-medium text-[#111111]">Page</label>
            <select
              value={form.page}
              onChange={(e) => update("page", e.target.value as SeoSettingsValues["page"])}
              className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
            >
              {sitePageOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-[10px]">
            <label className="text-[14px] font-medium text-[#111111]">Meta Title</label>
            <input
              type="text"
              value={form.metaTitle}
              onChange={(e) => update("metaTitle", e.target.value)}
              className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
              placeholder="Enter meta title"
            />
          </div>

          <div className="flex flex-col gap-[10px]">
            <label className="text-[14px] font-medium text-[#111111]">Meta Robots (Optional)</label>
            <select
              value={form.metaRobots}
              onChange={(e) => update("metaRobots", e.target.value)}
              className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
            >
              {metaRobotsOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-[10px]">
            <label className="text-[14px] font-medium text-[#111111]">Meta Description</label>
            <textarea
              value={form.metaDescription}
              onChange={(e) => update("metaDescription", e.target.value)}
              rows={4}
              className="w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 py-3 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
              placeholder="Enter meta description"
            />
          </div>
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
