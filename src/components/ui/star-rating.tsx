"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingProps = {
  rating: number;
  maxStars?: number;
  size?: string;
  className?: string;
  onChange?: (rating: number) => void;
};

export function StarRating({ rating, maxStars = 5, size = "size-5", className, onChange }: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: maxStars }).map((_, i) => {
        const filled = i < rating;
        return (
          <button
            key={i}
            type="button"
            disabled={!onChange}
            onClick={() => onChange?.(i + 1)}
            className={cn("transition", onChange && "cursor-pointer hover:scale-110")}
          >
            <Star
              className={cn(
                size,
                filled ? "fill-[#2563eb] text-[#2563eb]" : "fill-[#d1d5db] text-[#d1d5db]"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
