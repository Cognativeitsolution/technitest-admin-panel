"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type DropdownOption = {
  label: string;
  value: string;
};

type DropdownMenuProps = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function DropdownMenu({
  label,
  options,
  value,
  onChange,
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const items: DropdownOption[] = options.map((opt) => ({
    label: opt,
    value: opt,
  }));

  const displayLabel = value === options[0] ? label : value;

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
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
        <ChevronDown
          className={cn(
            "size-4 text-[#9ca3af] transition",
            open && "rotate-180"
          )}
        />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label={label}
          className="absolute top-[calc(100%+8px)] left-0 z-50 w-full min-w-[180px]"
        >
          <div className="overflow-hidden rounded-2xl border border-[#eef1f6] bg-white shadow-[0_12px_30px_rgba(16,24,40,0.14)]">
            <ul className="py-1.5">
              {items.map((item, index) => {
                const isSelected = item.value === value;

                return (
                  <li key={item.value}>
                    {index > 0 ? (
                      <div className="mx-3 h-px bg-[#eef1f6]" />
                    ) : null}
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onChange(item.value);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition",
                        isSelected
                          ? "bg-[#f0f5ff] text-[#2563eb]"
                          : "text-[#111827] hover:bg-[#f8fafc]"
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded-full border",
                          isSelected
                            ? "border-[#2563eb] bg-[#2563eb] text-white"
                            : "border-[#d1d5db]"
                        )}
                      >
                        {isSelected ? (
                          <Check className="size-2.5" />
                        ) : null}
                      </span>
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
