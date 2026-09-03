"use client";

import { useEffect, useState } from "react";

import { Dialog } from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import { TextField } from "@/components/ui/text-field";
import type { CategoryItem, CategoryPayload } from "@/types/category.types";

type CategoryDialogProps = {
  open: boolean;
  onClose: () => void;
  category: CategoryItem | null;
  submitting?: boolean;
  onCreate: (payload: CategoryPayload, image: File | null) => Promise<boolean>;
  onUpdate: (
    categoryId: number,
    payload: CategoryPayload,
    image: File | null,
  ) => Promise<boolean>;
};

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

function isAllowedImage(file: File) {
  return /image\/(png|jpeg|webp)/i.test(file.type) || /\.(png|jpe?g|webp)$/i.test(file.name);
}

const textareaClassName =
  "w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 py-3 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0";

export function CategoryDialog({
  open,
  onClose,
  category,
  submitting = false,
  onCreate,
  onUpdate,
}: CategoryDialogProps) {
  const isEdit = Boolean(category);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadKey, setUploadKey] = useState(0);

  useEffect(() => {
    if (!open) return;
    setTitle(category?.title ?? "");
    setDetail(category?.detail === "string" ? "" : (category?.detail ?? ""));
    setImage(null);
    setFormError(null);
    setUploadKey((key) => key + 1);
  }, [open, category]);

  async function handleSave() {
    if (submitting) return;

    const trimmedTitle = title.trim();
    const trimmedDetail = detail.trim();

    if (!trimmedTitle) {
      setFormError("Title is required.");
      return;
    }
    if (!trimmedDetail) {
      setFormError("Description is required.");
      return;
    }
    if (image) {
      if (!isAllowedImage(image)) {
        setFormError("Cover image must be a PNG, JPG, or WEBP file.");
        return;
      }
      if (image.size > MAX_IMAGE_BYTES) {
        setFormError("Cover image must be 2 MB or smaller.");
        return;
      }
    }

    const payload: CategoryPayload = {
      title: trimmedTitle,
      detail: trimmedDetail,
    };

    const ok = isEdit && category
      ? await onUpdate(category.id, payload, image)
      : await onCreate(payload, image);

    if (ok) onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Category" : "Add Category"}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        <TextField
          label="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Web Development"
          inputClassName="h-[48px] text-[#4b5563]"
        />

        <div className="flex flex-col gap-2.5">
          <label htmlFor="category-detail" className="text-[14px] font-medium text-[#111111]">
            Description<span className="ml-0.5 text-[#ff0000]">*</span>
          </label>
          <textarea
            id="category-detail"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            rows={4}
            placeholder="What kinds of quizzes belong here?"
            className={textareaClassName}
          />
        </div>

        <FileUpload
          key={`${open}-${category?.id ?? "new"}-${uploadKey}`}
          label="Cover image"
          accept=".png,.jpg,.jpeg,.webp"
          helperText="Optional. PNG, JPG, or WEBP up to 2 MB."
          onChange={(file) => {
            if (file && file.size > MAX_IMAGE_BYTES) {
              setImage(null);
              setFormError("Cover image must be 2 MB or smaller.");
              setUploadKey((key) => key + 1);
              return;
            }
            setImage(file);
            setFormError(null);
          }}
        />

        {isEdit && category?.image_url && !image ? (
          <div className="overflow-hidden rounded-xl border border-[#eef1f6] bg-[#f9fafb] p-3">
            <p className="mb-2 text-xs font-medium text-[#6b7280]">Current image</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={category.image_url}
              alt={category.title}
              className="h-28 w-full rounded-lg object-cover"
            />
          </div>
        ) : null}

        {formError ? <p className="text-sm text-[#b91c1c]">{formError}</p> : null}
      </div>

      <div className="mt-6 flex justify-end gap-3 border-t border-[#eef1f6] pt-5">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={submitting}
          className="inline-flex h-11 min-w-[150px] items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:opacity-50"
        >
          {submitting
            ? "Saving..."
            : isEdit
              ? "Update Category"
              : "Add Category"}
        </button>
      </div>
    </Dialog>
  );
}
