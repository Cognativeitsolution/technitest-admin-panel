"use client";

import { useState } from "react";

import { Dialog } from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import { Switch } from "@/components/ui/switch";
import { StarRating } from "@/components/ui/star-rating";

type AddReviewDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function AddReviewDialog({ open, onClose }: AddReviewDialogProps) {
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [featured, setFeatured] = useState(false);

  function handleSave() {
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title="Add Reviews" maxWidth="max-w-2xl">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Left column */}
        <div className="space-y-4">
          <div className="flex flex-col gap-[10px]">
            <label className="text-[14px] font-medium text-[#111111]">
              User Name<span className="ml-0.5 text-[#ff0000]">*</span>
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
              placeholder="Enter user name"
            />
          </div>

          <div className="flex flex-col gap-[10px]">
            <label className="text-[14px] font-medium text-[#111111]">
              Review / Message<span className="ml-0.5 text-[#ff0000]">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 py-3 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
              placeholder="Enter review message"
            />
          </div>

          <FileUpload
            label="Upload Video"
            accept=".mp4,.mov,.avi"
            helperText="Supported Formats: MP4, MOV, AVI. Max File Size: 50 MB."
          />

          <div className="rounded-xl border border-[#e5e7eb] px-4 py-3">
            <Switch checked={featured} onCheckedChange={setFeatured} label="Featured on homepage?" />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="flex flex-col gap-[10px]">
            <label className="text-[14px] font-medium text-[#111111]">
              Rating<span className="ml-0.5 text-[#ff0000]">*</span>
            </label>
            <div className="flex h-[54px] items-center rounded-[10px] border border-[#ebebeb] bg-white px-5 shadow-[0_2px_10px_rgba(16,24,40,0.06)]">
              <StarRating rating={rating} size="size-7" onChange={setRating} />
            </div>
          </div>

          <div className="flex flex-col gap-[10px]">
            <label className="text-[14px] font-medium text-[#111111]">
              Date<span className="ml-0.5 text-[#ff0000]">*</span>
            </label>
            <input
              type="date"
              defaultValue="2025-11-12"
              className="h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-start">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white transition hover:bg-[#d99400]"
        >
          Add Review
        </button>
      </div>
    </Dialog>
  );
}
