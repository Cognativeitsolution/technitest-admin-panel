"use client";

import { useEffect, useState } from "react";

import { Dialog } from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import { Switch } from "@/components/ui/switch";
import type { AdvertisementBanner } from "@/data/cms";
import { placementOptions } from "@/data/cms";

type AdvertisementDialogProps = {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  banner: AdvertisementBanner | null;
};

export function AdvertisementDialog({
  open,
  onClose,
  mode,
  banner,
}: AdvertisementDialogProps) {
  const [title, setTitle] = useState("");
  const [placement, setPlacement] = useState(placementOptions[0]);
  const [destinationUrl, setDestinationUrl] = useState("");
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!open) return;
    setTitle(banner?.title ?? "");
    setPlacement(banner?.placement ?? placementOptions[0]);
    setDestinationUrl(banner?.destinationUrl ?? "");
    setActive(banner ? banner.status === "Active" : true);
  }, [open, banner]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Add/Edit Banner" : "Add/Edit Banner"}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">
            Banner Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none"
            placeholder="Enter banner title"
          />
        </div>

        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">
            Placement Selection
          </label>
          <select
            value={placement}
            onChange={(e) => setPlacement(e.target.value)}
            className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none"
          >
            {placementOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-[10px]">
          <label className="text-[14px] font-medium text-[#111111]">
            Link URL
          </label>
          <input
            type="url"
            value={destinationUrl}
            onChange={(e) => setDestinationUrl(e.target.value)}
            className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none"
            placeholder="https://example.com"
          />
        </div>

        <FileUpload label="Select Image" helperText="PNG, JPG, JPEG. Max 2 MB." />

        <div className="rounded-xl border border-[#e5e7eb] px-4 py-3">
          <Switch checked={active} onCheckedChange={setActive} label="Status" />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-[#f0a500] text-sm font-semibold text-[#f0a500] transition hover:bg-[#fff8eb]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-[#f0a500] text-sm font-semibold text-white transition hover:bg-[#d99400]"
        >
          Save Banner
        </button>
      </div>
    </Dialog>
  );
}
