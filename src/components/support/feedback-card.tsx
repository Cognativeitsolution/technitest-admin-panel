"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

import { cn } from "@/lib/utils";

type FeedbackValue = "yes" | "no" | null;

export function FeedbackCard() {
  const [selected, setSelected] = useState<FeedbackValue>(null);

  return (
    <div className="mt-12 ml-4 mb-8 rounded-2xl border border-[#eef1f6] bg-white px-6 py-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)] sm:px-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[15px] font-medium text-[#111827]">
          Was this article helpful?
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSelected(selected === "yes" ? null : "yes")}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all",
              selected === "yes"
                ? "border-[#2563eb] bg-[#eff6ff] text-[#2563eb]"
                : "border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f9fafb]"
            )}
          >
            <ThumbsUp className="size-4" />
            Yes
          </button>
          <button
            type="button"
            onClick={() => setSelected(selected === "no" ? null : "no")}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all",
              selected === "no"
                ? "border-[#dc2626] bg-[#fef2f2] text-[#dc2626]"
                : "border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f9fafb]"
            )}
          >
            <ThumbsDown className="size-4" />
            No
          </button>
        </div>
      </div>
    </div>
  );
}
