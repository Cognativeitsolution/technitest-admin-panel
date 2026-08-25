"use client";

import { useEffect, useState } from "react";

import { Dialog } from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import { Switch } from "@/components/ui/switch";
import { StarRating } from "@/components/ui/star-rating";
import type { WebsiteReviewRecord } from "@/types/website-review.types";

type AddReviewDialogProps = {
  open: boolean;
  onClose: () => void;
  review?: WebsiteReviewRecord | null;
  submitting?: boolean;
  onSubmit: (input: {
    name: string;
    rating: number;
    message: string;
    image?: File | null;
    video?: File | null;
    isFeatured?: boolean;
  }) => Promise<boolean>;
};

export function AddReviewDialog({
  open,
  onClose,
  review = null,
  submitting = false,
  onSubmit,
}: AddReviewDialogProps) {
  const isEdit = Boolean(review);
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [featured, setFeatured] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setUserName(review?.name ?? "");
    setMessage(review?.message ?? "");
    setRating(review?.rating ?? 0);
    setFeatured(review?.is_featured ?? false);
    setImage(null);
    setVideo(null);
    setFormError(null);
  }, [open, review]);

  async function handleSave() {
    if (!userName.trim() || !message.trim() || rating < 1) {
      setFormError("Name, rating, and message are required.");
      return;
    }

    const ok = await onSubmit({
      name: userName.trim(),
      rating,
      message: message.trim(),
      image,
      video,
      isFeatured: !isEdit ? featured : undefined,
    });

    if (ok) {
      onClose();
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Review" : "Add Review"}
      maxWidth="max-w-2xl"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
            label="Upload Image"
            accept=".png,.jpg,.jpeg,.webp"
            helperText="Optional. PNG, JPG, JPEG, WEBP."
            onChange={setImage}
          />

          <FileUpload
            label="Upload Video"
            accept=".mp4,.mov,.avi,.webm"
            helperText="Optional. MP4, MOV, AVI, WEBM."
            onChange={setVideo}
          />

          {!isEdit ? (
            <div className="rounded-xl border border-[#e5e7eb] px-4 py-3">
              <Switch
                checked={featured}
                onCheckedChange={setFeatured}
                label="Featured on homepage?"
              />
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-[10px]">
            <label className="text-[14px] font-medium text-[#111111]">
              Rating<span className="ml-0.5 text-[#ff0000]">*</span>
            </label>
            <div className="flex h-[54px] items-center rounded-[10px] border border-[#ebebeb] bg-white px-5 shadow-[0_2px_10px_rgba(16,24,40,0.06)]">
              <StarRating rating={rating} size="size-7" onChange={setRating} />
            </div>
          </div>

          {isEdit && review ? (
            <div className="rounded-xl border border-[#e5e7eb] bg-[#f8fafc] px-4 py-3 text-sm text-[#6b7280]">
              <p>
                Current image:{" "}
                {review.image_url ? (
                  <a
                    href={review.image_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-[#2563eb] hover:underline"
                  >
                    View
                  </a>
                ) : (
                  "None"
                )}
              </p>
              <p className="mt-1">
                Current video:{" "}
                {review.video_url ? (
                  <a
                    href={review.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-[#2563eb] hover:underline"
                  >
                    View
                  </a>
                ) : (
                  "None"
                )}
              </p>
              <p className="mt-2 text-xs">
                Upload new files only if you want to replace existing media.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {formError ? (
        <p className="mt-4 text-sm font-medium text-[#ef4444]">{formError}</p>
      ) : null}

      <div className="mt-6 flex justify-start gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-[#e5e7eb] px-6 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={submitting}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:opacity-50"
        >
          {submitting ? "Saving..." : isEdit ? "Save Changes" : "Add Review"}
        </button>
      </div>
    </Dialog>
  );
}
