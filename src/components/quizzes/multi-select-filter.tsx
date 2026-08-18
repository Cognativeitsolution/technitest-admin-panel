"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";

type MultiSelectFilterProps = {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  className?: string;
};

export function MultiSelectFilter({ label, options, selected, onChange, className }: MultiSelectFilterProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const filtered = options.filter((o) => o.toLowerCase().includes(search.toLowerCase()));
  const displayText = selected.length === 0 ? label : selected.length === 1 ? selected[0] : `${selected.length} selected`;

  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-3.5 text-sm font-medium text-[#374151] shadow-sm transition hover:bg-[#f9fafb]"
      >
        {displayText}
        <ChevronDown className={cn("size-4 text-[#9ca3af] transition", open && "rotate-180")} />
      </button>

      {open ? (
        <div className="absolute top-[calc(100%+6px)] left-0 z-50 w-56">
          <div className="overflow-hidden rounded-2xl border border-[#eef1f6] bg-white shadow-[0_12px_30px_rgba(16,24,40,0.14)]">
            <div className="border-b border-[#eef1f6] p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-[#9ca3af]" />
                <input
                  type="text"
                  placeholder={`Search ${label.toLowerCase()}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] pl-8 pr-2 text-xs text-[#374151] outline-none placeholder:text-[#9ca3af] focus:border-[#3b82f6]"
                />
              </div>
            </div>
            <ul className="max-h-52 overflow-y-auto py-1.5">
              {filtered.map((option, i) => {
                const isSelected = selected.includes(option);
                return (
                  <li key={option}>
                    {i > 0 ? <div className="mx-3 h-px bg-[#eef1f6]" /> : null}
                    <button
                      type="button"
                      onClick={() => toggle(option)}
                      className={cn(
                        "flex w-full items-center gap-3 px-3.5 py-2.5 text-sm transition",
                        isSelected ? "bg-[#f0f5ff] font-medium text-[#2563eb]" : "text-[#374151] hover:bg-[#f8fafc]"
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded border",
                          isSelected ? "border-[#2563eb] bg-[#2563eb] text-white" : "border-[#d1d5db]"
                        )}
                      >
                        {isSelected ? <Check className="size-2.5" /> : null}
                      </span>
                      {option}
                    </button>
                  </li>
                );
              })}
              {filtered.length === 0 ? (
                <li className="px-3.5 py-3 text-center text-xs text-[#9ca3af]">No results</li>
              ) : null}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
