"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ColorPickerProps = {
  value: string;
  onChange: (hex: string) => void;
  label?: string;
  className?: string;
};

export function ColorPicker({ value, onChange, label, className }: ColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hexInput, setHexInput] = useState(value);

  function handleHexChange(v: string) {
    setHexInput(v);
    if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
      onChange(v);
    }
  }

  return (
    <div className={cn("flex w-full flex-col gap-[10px]", className)}>
      {label ? (
        <label className="text-[14px] leading-none font-medium text-[#111111]">{label}</label>
      ) : null}
      <div className="flex h-[54px] items-center gap-3 rounded-[10px] border border-[#ebebeb] bg-white px-4 shadow-[0_2px_10px_rgba(16,24,40,0.06)]">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="size-9 shrink-0 rounded-lg border border-[#e5e7eb] transition hover:opacity-80"
          style={{ backgroundColor: value }}
          aria-label="Pick color"
        />
        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={(e) => {
            setHexInput(e.target.value);
            onChange(e.target.value);
          }}
          className="hidden"
        />
        <input
          type="text"
          value={hexInput}
          onChange={(e) => handleHexChange(e.target.value)}
          className="flex-1 bg-transparent text-[15px] font-medium text-[#374151] outline-none placeholder:text-[#b0b0b0]"
          placeholder="#000000"
          maxLength={7}
        />
      </div>
    </div>
  );
}
