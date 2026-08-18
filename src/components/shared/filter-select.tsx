"use client";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type FilterSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  className?: string;
};

export function FilterSelect({
  label,
  value,
  options,
  onChange,
  className,
}: FilterSelectProps) {
  return (
    <div className={cn("relative inline-flex", className)}>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 appearance-none rounded-xl border border-[#e5e7eb] bg-white py-2 pr-10 pl-3.5 text-sm font-medium text-[#374151] shadow-sm outline-none transition hover:bg-[#f9fafb] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === options[0] ? label : option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9ca3af]" />
    </div>
  );
}
