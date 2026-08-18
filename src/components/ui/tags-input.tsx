"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type TagsInputProps = {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
};

export function TagsInput({ label, tags, onChange, placeholder = "Type and press Enter", required, className }: TagsInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addTag(value: string) {
    const trimmed = value.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    onChange([...tags, trimmed]);
    setInput("");
  }

  function removeTag(index: number) {
    onChange(tags.filter((_, i) => i !== index));
  }

  return (
    <div className={cn("flex w-full flex-col gap-[10px]", className)}>
      <label className="text-[14px] leading-none font-medium text-[#111111]">
        {label}
        {required ? <span className="ml-0.5 text-[#ff0000]">*</span> : null}
      </label>
      <div
        onClick={() => inputRef.current?.focus()}
        className="flex min-h-[54px] w-full flex-wrap items-center gap-2 rounded-[10px] border border-[#ebebeb] bg-white px-4 py-2 shadow-[0_2px_10px_rgba(16,24,40,0.06)] transition focus-within:border-[#dcdcdc] focus-within:shadow-[0_2px_12px_rgba(16,24,40,0.08)]"
      >
        {tags.map((tag, i) => (
          <span key={tag} className="inline-flex items-center gap-1.5 rounded-full bg-[#eff6ff] px-3 py-1 text-sm font-medium text-[#2563eb]">
            {tag}
            <button type="button" aria-label={`Remove ${tag}`} onClick={() => removeTag(i)} className="rounded-full p-0.5 transition hover:bg-[#dbeafe]">
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); addTag(input); }
            if (e.key === "Backspace" && !input && tags.length > 0) removeTag(tags.length - 1);
          }}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="min-w-[120px] flex-1 bg-transparent text-[15px] text-[#111827] outline-none placeholder:text-[#b0b0b0]"
        />
      </div>
    </div>
  );
}
