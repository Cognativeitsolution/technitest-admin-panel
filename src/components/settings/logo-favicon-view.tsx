"use client";

import { useState } from "react";
import { ArrowLeft, Camera } from "lucide-react";
import { useRouter } from "next/navigation";

import type { LogoFaviconValues } from "@/data/settings";

type UploadAreaProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspectClass?: string;
};

function UploadArea({ label, value, onChange, aspectClass = "aspect-video" }: UploadAreaProps) {
  return (
    <div className="space-y-3">
      <label className="text-[14px] font-medium text-[#111111]">{label}</label>
      <div className="relative overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white">
        <div className={`${aspectClass} w-full bg-[#f9fafb] flex items-center justify-center`}>
          {value ? (
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
            accept=".png,.jpg,.jpeg,.svg"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onChange(URL.createObjectURL(file));
            }}
          />
        </label>
      </div>
      <p className="text-[12px] text-[#6b7280]">Supported Files: png, jpg, jpeg, svg</p>
    </div>
  );
}

export function LogoFaviconView() {
  const router = useRouter();
  const [form, setForm] = useState<LogoFaviconValues>({
    primaryLogo: "",
    darkLogo: "",
    favicon: "",
  });

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
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">Logo and Favicon</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <UploadArea
          label="Primary Logo"
          value={form.primaryLogo}
          onChange={(v) => setForm((p) => ({ ...p, primaryLogo: v }))}
        />
        <UploadArea
          label="Dark Logo"
          value={form.darkLogo}
          onChange={(v) => setForm((p) => ({ ...p, darkLogo: v }))}
        />
        <UploadArea
          label="Favicon"
          value={form.favicon}
          onChange={(v) => setForm((p) => ({ ...p, favicon: v }))}
          aspectClass="aspect-square"
        />
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
