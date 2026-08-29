"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";

export type SelectOption = {
  label: string;
  value: string;
};

type SearchableSelectProps = {
  value: string;
  options: SelectOption[];
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  fallbackLabel?: string;
  onChange: (value: string) => void;
  className?: string;
};

export function SearchableSelect({
  value,
  options,
  placeholder = "Select...",
  emptyText = "No results found",
  disabled = false,
  loading = false,
  loadingText = "Loading...",
  fallbackLabel,
  onChange,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const resolvedOptions = useMemo(() => {
    if (!value || options.some((option) => option.value === value)) {
      return options;
    }
    if (fallbackLabel) {
      return [{ value, label: fallbackLabel }, ...options];
    }
    return options;
  }, [options, value, fallbackLabel]);

  const selectedLabel = useMemo(() => {
    const found = resolvedOptions.find((option) => option.value === value)?.label;
    if (found) return found;
    if (value && fallbackLabel) return fallbackLabel;
    return "";
  }, [resolvedOptions, value, fallbackLabel]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return resolvedOptions;
    return resolvedOptions.filter((option) =>
      option.label.toLowerCase().includes(query),
    );
  }, [resolvedOptions, search]);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-[54px] w-full items-center justify-between rounded-[10px] border border-[#ebebeb] bg-white px-5 text-left text-[15px] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition focus:border-[#dcdcdc]",
          disabled && "cursor-not-allowed opacity-60",
          open && "border-[#dcdcdc]",
        )}
      >
        <span className={selectedLabel ? "text-[#4b5563]" : "text-[#b0b0b0]"}>
          {loading && !selectedLabel ? loadingText : selectedLabel || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-[#9ca3af] transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div className="absolute top-[calc(100%+6px)] left-0 z-50 w-full overflow-hidden rounded-[10px] border border-[#ebebeb] bg-white shadow-[0_12px_30px_rgba(16,24,40,0.14)]">
          <div className="border-b border-[#eef1f6] p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#9ca3af]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="h-9 w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] pr-3 pl-9 text-sm text-[#374151] outline-none placeholder:text-[#9ca3af] focus:border-[#3b82f6]"
              />
            </div>
          </div>
          <ul className="max-h-52 overflow-y-auto py-1.5">
            {loading ? (
              <li className="px-4 py-3 text-center text-sm text-[#9ca3af]">
                {loadingText}
              </li>
            ) : filtered.length === 0 ? (
              <li className="px-4 py-3 text-center text-sm text-[#9ca3af]">
                {emptyText}
              </li>
            ) : (
              filtered.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={cn(
                      "flex w-full px-4 py-2.5 text-left text-sm transition hover:bg-[#f8fafc]",
                      value === option.value
                        ? "bg-[#f0f5ff] font-medium text-[#2563eb]"
                        : "text-[#374151]",
                    )}
                  >
                    {option.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
