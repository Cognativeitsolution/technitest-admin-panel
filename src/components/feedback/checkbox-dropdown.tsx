"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type CheckboxDropdownProps = {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  className?: string;
};

export function CheckboxDropdown({ label, options, selected, onChange, className }: CheckboxDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const displayLabel = selected.length === 0 ? label : `${label} (${selected.length})`;

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  function toggle(option: string) {
    if (selected.includes(option)) {
      onChange(selected.filter((v) => v !== option));
    } else {
      onChange([...selected, option]);
    }
  }

  return (
    <div className={cn("relative inline-flex", className)} ref={ref}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-3.5 text-sm font-medium text-[#374151] shadow-sm transition hover:bg-[#f9fafb]"
      >
        {displayLabel}
        <ChevronDown className={cn("size-4 text-[#9ca3af] transition", open && "rotate-180")} />
      </button>

      {open ? (
        <div className="absolute top-[calc(100%+8px)] left-0 z-50 min-w-[180px]">
          <div className="overflow-hidden rounded-2xl border border-[#eef1f6] bg-white shadow-[0_12px_30px_rgba(16,24,40,0.14)]">
            <ul className="py-1.5">
              {options.map((option, index) => (
                <li key={option}>
                  {index > 0 ? <div className="mx-3 h-px bg-[#eef1f6]" /> : null}
                  <button
                    type="button"
                    onClick={() => toggle(option)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-[#111827] transition hover:bg-[#f8fafc]"
                  >
                    <Checkbox
                      checked={selected.includes(option)}
                      onCheckedChange={() => toggle(option)}
                    />
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
