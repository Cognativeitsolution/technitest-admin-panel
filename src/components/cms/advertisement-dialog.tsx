"use client";

import { useEffect, useState } from "react";
import NextImage from "next/image";

import { Dialog } from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import { Switch } from "@/components/ui/switch";
import { usePagesDropdown } from "@/hooks/cms/use-pages-dropdown";
import type { Banner, BannerPayload } from "@/types/banner.types";

type AdvertisementDialogProps = {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  banner: Banner | null;
  submitting: boolean;
  onSubmit: (payload: BannerPayload, image: File | null) => Promise<boolean>;
};

const inputClassName =
  "h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none";

export function AdvertisementDialog({
  open,
  onClose,
  mode,
  banner,
  submitting,
  onSubmit,
}: AdvertisementDialogProps) {
  const pagesQuery = usePagesDropdown({ enabled: open });
  const [title, setTitle] = useState("");
  const [pageId, setPageId] = useState<number | "">("");
  const [active, setActive] = useState(true);
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (!open) return;
    setTitle(banner?.title ?? "");
    setPageId(banner?.page_id ?? "");
    setActive(banner ? banner.status === "active" : true);
    setImage(null);
  }, [open, banner]);

  useEffect(() => {
    if (!open || pageId || pagesQuery.items.length === 0) return;
    setPageId(pagesQuery.items[0].id);
  }, [open, pageId, pagesQuery.items]);

  async function handleSave() {
    const trimmed = title.trim();
    if (!trimmed || pageId === "") return;
    if (mode === "create" && !image) return;

    const success = await onSubmit(
      {
        title: trimmed,
        page_id: Number(pageId),
        status: active ? "active" : "inactive",
      },
      image,
    );
    if (success) onClose();
  }

  const missingPageInDropdown =
    banner?.page_id != null &&
    !pagesQuery.items.some((item) => item.id === banner.page_id);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Add Banner" : "Edit Banner"}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-2.5">
          <label className="text-[14px] font-medium text-[#111111]">
            Banner Title<span className="ml-0.5 text-[#ff0000]">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClassName}
            placeholder="Enter banner title"
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-[14px] font-medium text-[#111111]">
            Select Page / Placement<span className="ml-0.5 text-[#ff0000]">*</span>
          </label>
          <select
            value={pageId}
            onChange={(e) => setPageId(Number(e.target.value))}
            className={inputClassName}
          >
            {pagesQuery.loading ? (
              <option value="">Loading pages...</option>
            ) : (
              <>
                {missingPageInDropdown && banner ? (
                  <option value={banner.page_id}>
                    {banner.page?.title ?? `Page #${banner.page_id}`}
                  </option>
                ) : null}
                {pagesQuery.items.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.title}
                  </option>
                ))}
              </>
            )}
          </select>
          {pagesQuery.error ? (
            <p className="text-xs text-[#ef4444]">{pagesQuery.error}</p>
          ) : null}
        </div>

        <div className="space-y-3">
          <FileUpload
            key={`${open}-${banner?.id ?? "new"}`}
            label="Select Image"
            helperText="PNG, JPG, JPEG. Max 2 MB."
            required={mode === "create"}
            onChange={setImage}
          />
          {banner?.image_url && !image ? (
            <NextImage
              src={banner.image_url}
              alt={banner.title}
              width={80}
              height={80}
              className="size-20 rounded-xl object-cover"
            />
          ) : null}
        </div>

        <div className="rounded-xl border border-[#e5e7eb] px-4 py-3">
          <Switch checked={active} onCheckedChange={setActive} label="Status" />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-[#f0a500] text-sm font-semibold text-[#f0a500] transition hover:bg-[#fff8eb] disabled:pointer-events-none disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={submitting}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-[#f0a500] text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:pointer-events-none disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save Banner"}
        </button>
      </div>
    </Dialog>
  );
}
