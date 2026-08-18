"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex items-center justify-center gap-2 pt-2">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-[#6b7280] transition hover:bg-white hover:text-[#111827] disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
        Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={cn(
            "flex size-8 items-center justify-center rounded-full text-sm font-semibold transition",
            page === currentPage
              ? "bg-[#f0a500] text-white"
              : "text-[#6b7280] hover:bg-white hover:text-[#111827]"
          )}
        >
          {String(page).padStart(2, "0")}
        </button>
      ))}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-[#6b7280] transition hover:bg-white hover:text-[#111827] disabled:pointer-events-none disabled:opacity-40"
      >
        Next
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
