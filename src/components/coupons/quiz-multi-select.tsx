"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import type { QuizInfoListItem } from "@/types/quiz-info.types";

type QuizMultiSelectProps = {
  quizzes: QuizInfoListItem[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  loading?: boolean;
  className?: string;
};

export function QuizMultiSelect({
  quizzes,
  selectedIds,
  onChange,
  loading = false,
  className,
}: QuizMultiSelectProps) {
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

  const filtered = quizzes.filter((quiz) =>
    quiz.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const selectedNames = quizzes
    .filter((quiz) => selectedIds.includes(quiz.id))
    .map((quiz) => quiz.name);

  const displayText =
    selectedIds.length === 0
      ? "Select quizzes"
      : selectedIds.length === 1
        ? selectedNames[0] ?? "1 selected"
        : `${selectedIds.length} quizzes selected`;

  function toggle(id: number) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((value) => value !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  return (
    <div className={cn("relative w-full", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={loading}
        className="flex h-[48px] w-full items-center justify-between rounded-[10px] border border-[#ebebeb] bg-white px-4 text-left text-[14px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition hover:border-[#dcdcdc] disabled:opacity-60"
      >
        <span className="truncate">{loading ? "Loading quizzes..." : displayText}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-[#9ca3af] transition",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div className="absolute top-[calc(100%+6px)] left-0 z-50 w-full">
          <div className="overflow-hidden rounded-2xl border border-[#eef1f6] bg-white shadow-[0_12px_30px_rgba(16,24,40,0.14)]">
            <div className="border-b border-[#eef1f6] p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-[#9ca3af]" />
                <input
                  type="text"
                  placeholder="Search quizzes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] pr-2 pl-8 text-xs text-[#374151] outline-none placeholder:text-[#9ca3af] focus:border-[#3b82f6]"
                />
              </div>
            </div>
            <ul className="max-h-52 overflow-y-auto py-1.5">
              {filtered.map((quiz, index) => {
                const isSelected = selectedIds.includes(quiz.id);
                return (
                  <li key={quiz.id}>
                    {index > 0 ? <div className="mx-3 h-px bg-[#eef1f6]" /> : null}
                    <button
                      type="button"
                      onClick={() => toggle(quiz.id)}
                      className={cn(
                        "flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-sm transition",
                        isSelected
                          ? "bg-[#f0f5ff] font-medium text-[#2563eb]"
                          : "text-[#374151] hover:bg-[#f8fafc]",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded border",
                          isSelected
                            ? "border-[#2563eb] bg-[#2563eb] text-white"
                            : "border-[#d1d5db]",
                        )}
                      >
                        {isSelected ? <Check className="size-2.5" /> : null}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate">{quiz.name}</span>
                        {quiz.category?.title ? (
                          <span className="block truncate text-xs font-normal text-[#9ca3af]">
                            {quiz.category.title}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })}
              {filtered.length === 0 ? (
                <li className="px-3.5 py-3 text-center text-xs text-[#9ca3af]">
                  No quizzes found
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
