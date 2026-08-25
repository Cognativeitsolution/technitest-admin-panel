"use client";

import Image from "next/image";
import { ImageIcon, Pencil, Video } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { StarRating } from "@/components/ui/star-rating";
import type { WebsiteReviewRecord } from "@/types/website-review.types";

function formatReviewDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

type WebsiteReviewsTableProps = {
  reviews: WebsiteReviewRecord[];
  loading?: boolean;
  onToggleFeatured: (id: number, featured: boolean) => void;
  onEdit: (review: WebsiteReviewRecord) => void;
  onMessageClick: (review: WebsiteReviewRecord) => void;
};

export function WebsiteReviewsTable({
  reviews,
  loading = false,
  onToggleFeatured,
  onEdit,
  onMessageClick,
}: WebsiteReviewsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">User</th>
              <th className="px-5 py-3.5">Rating</th>
              <th className="px-5 py-3.5">Review Message</th>
              <th className="px-5 py-3.5">Media</th>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5">Featured</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-[#6b7280]">
                  Loading reviews...
                </td>
              </tr>
            ) : null}

            {!loading
              ? reviews.map((review) => (
                  <tr
                    key={review.id}
                    className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {review.image_url ? (
                          <Image
                            src={review.image_url}
                            alt={review.name}
                            width={36}
                            height={36}
                            className="size-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex size-9 items-center justify-center rounded-full bg-[#eef2ff] text-xs font-semibold text-[#4338ca]">
                            {review.name.slice(0, 1).toUpperCase()}
                          </div>
                        )}
                        <span className="text-sm font-medium text-[#111827]">
                          {review.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StarRating rating={review.rating} size="size-4" />
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => onMessageClick(review)}
                        className="max-w-[220px] truncate text-sm text-[#374151] underline decoration-[#d1d5db] underline-offset-2 transition hover:text-[#2563eb] hover:decoration-[#2563eb]"
                      >
                        &quot;{review.message}&quot;
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {review.image_url ? (
                          <a
                            href={review.image_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex size-10 items-center justify-center rounded-lg bg-[#f3f4f6] text-[#6b7280] transition hover:bg-[#eef2ff] hover:text-[#2563eb]"
                            title="Open image"
                          >
                            <ImageIcon className="size-5" />
                          </a>
                        ) : null}
                        {review.video_url ? (
                          <a
                            href={review.video_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex size-10 items-center justify-center rounded-lg bg-[#f3f4f6] text-[#6b7280] transition hover:bg-[#eef2ff] hover:text-[#2563eb]"
                            title="Open video"
                          >
                            <Video className="size-5" />
                          </a>
                        ) : null}
                        {!review.image_url && !review.video_url ? (
                          <span className="text-sm text-[#9ca3af]">--</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#6b7280]">
                      {formatReviewDate(review.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <Switch
                        checked={review.is_featured}
                        onCheckedChange={(checked) =>
                          onToggleFeatured(review.id, checked)
                        }
                      />
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        aria-label={`Edit ${review.name}`}
                        onClick={() => onEdit(review)}
                        className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]"
                      >
                        <Pencil className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))
              : null}

            {!loading && reviews.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-sm text-[#6b7280]"
                >
                  No website reviews found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
