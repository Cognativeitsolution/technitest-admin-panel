"use client";

import Image from "next/image";
import { Video, Pencil, Trash2 } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { StarRating } from "@/components/ui/star-rating";
import type { WebsiteReview } from "@/data/feedback";

type WebsiteReviewsTableProps = {
  reviews: WebsiteReview[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  onToggleActive: (id: string, active: boolean) => void;
  onMessageClick: (review: WebsiteReview) => void;
};

export function WebsiteReviewsTable({
  reviews,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onToggleActive,
  onMessageClick,
}: WebsiteReviewsTableProps) {
  const allSelected = reviews.length > 0 && reviews.every((r) => selectedIds.includes(r.id));

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="w-12 px-5 py-3.5">
                <Checkbox checked={allSelected} onCheckedChange={onSelectAll} />
              </th>
              <th className="px-5 py-3.5">User</th>
              <th className="px-5 py-3.5">Rating</th>
              <th className="px-5 py-3.5">Review Message</th>
              <th className="px-5 py-3.5">Video</th>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]">
                <td className="px-5 py-4">
                  <Checkbox
                    checked={selectedIds.includes(review.id)}
                    onCheckedChange={(checked) => onSelectRow(review.id, checked)}
                  />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Image src={review.userAvatar} alt={review.userName} width={36} height={36} className="size-9 rounded-full object-cover" />
                    <span className="text-sm font-medium text-[#111827]">{review.userName}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <StarRating rating={review.rating} size="size-4" />
                </td>
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => onMessageClick(review)}
                    className="max-w-[200px] truncate text-sm text-[#374151] underline decoration-[#d1d5db] underline-offset-2 transition hover:text-[#2563eb] hover:decoration-[#2563eb]"
                  >
                    &quot;{review.message}&quot;
                  </button>
                </td>
                <td className="px-5 py-4">
                  {review.videoUrl ? (
                    <div className="flex size-10 items-center justify-center rounded-lg bg-[#f3f4f6]">
                      <Video className="size-5 text-[#6b7280]" />
                    </div>
                  ) : (
                    <span className="text-sm text-[#9ca3af]">--</span>
                  )}
                </td>
                <td className="px-5 py-4 text-sm text-[#6b7280]">{review.date}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold ${
                      review.status === "Approved"
                        ? "bg-[#dcfce7] text-[#16a34a]"
                        : review.status === "Pending"
                          ? "bg-[#fef9c3] text-[#ca8a04]"
                          : "bg-[#f3f4f6] text-[#6b7280]"
                    }`}
                  >
                    {review.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <Switch checked={review.active} onCheckedChange={(checked) => onToggleActive(review.id, checked)} />
                </td>
              </tr>
            ))}
            {reviews.length === 0 ? (
              <tr><td colSpan={8} className="px-5 py-10 text-center text-sm text-[#6b7280]">No website reviews found.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
