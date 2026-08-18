"use client";

import { useRef, useState } from "react";
import { Paperclip } from "lucide-react";

import { cn } from "@/lib/utils";

type FileUploadProps = {
  label: string;
  accept?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  onChange?: (file: File | null) => void;
};

export function FileUpload({ label, accept = ".png,.jpg,.jpeg", helperText, required, className, onChange }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  return (
    <div className={cn("flex w-full flex-col gap-[10px]", className)}>
      <label className="text-[14px] leading-none font-medium text-[#111111]">
        {label}
        {required ? <span className="ml-0.5 text-[#ff0000]">*</span> : null}
      </label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
        className="flex h-[54px] w-full cursor-pointer items-center gap-3 rounded-[10px] border border-[#ebebeb] bg-white px-5 shadow-[0_2px_10px_rgba(16,24,40,0.06)] transition hover:bg-[#fafbfc] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)]"
      >
        <Paperclip className="size-5 shrink-0 text-[#9ca3af]" />
        <span className="truncate text-[15px] text-[#b0b0b0]">
          {fileName || "Choose file"}
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          setFileName(file?.name ?? "");
          onChange?.(file);
        }}
      />
      {helperText ? (
        <p className="text-[12px] leading-snug text-[#6b7280]">{helperText}</p>
      ) : null}
    </div>
  );
}
