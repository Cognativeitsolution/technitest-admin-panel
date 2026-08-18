"use client";

import { cn } from "@/lib/utils";

type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  className?: string;
};

export function Switch({ checked, onCheckedChange, label, className }: SwitchProps) {
  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-[#2563eb]" : "bg-[#d1d5db]"
        )}
      >
        <span
          className={cn(
            "inline-block size-4 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
      {label ? <span className="text-sm font-medium text-[#374151]">{label}</span> : null}
    </label>
  );
}
