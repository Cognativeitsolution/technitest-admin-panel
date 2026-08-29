"use client";

import { cn } from "@/lib/utils";

type FormSelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
  required?: boolean;
};

export function FormSelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "Select...",
  error,
  required = false,
}: FormSelectFieldProps) {
  return (
    <div>
      <label className="mb-[10px] block text-[14px] font-medium text-[#111111]">
        {label}
        {required ? <span className="ml-0.5 text-[#ff0000]">*</span> : null}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0",
          error && "border-[#ef4444]",
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-xs text-[#ef4444]">{error}</p> : null}
    </div>
  );
}
