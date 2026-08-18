"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type CheckboxProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  className?: string;
};

export function Checkbox({ checked, onCheckedChange, label, className }: CheckboxProps) {
  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-2.5", className)}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border transition",
          checked
            ? "border-[#2563eb] bg-[#2563eb] text-white"
            : "border-[#d1d5db] bg-white"
        )}
      >
        {checked ? <Check className="size-3" strokeWidth={3} /> : null}
      </button>
      {label ? <span className="text-sm font-medium text-[#374151]">{label}</span> : null}
    </label>
  );
}
