"use client";

import { StarRating } from "@/components/ui/star-rating";
import type { UserFeedbackRecord } from "@/types/user-feedback.types";

function formatReviewDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

type UserReviewsTableProps = {
  reviews: UserFeedbackRecord[];
  loading?: boolean;
  onMessageClick: (review: UserFeedbackRecord) => void;
};

export function UserReviewsTable({
  reviews,
  loading = false,
  onMessageClick,
}: UserReviewsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">User</th>
              <th className="px-5 py-3.5">Target</th>
              <th className="px-5 py-3.5">Rating</th>
              <th className="px-5 py-3.5">Review Message</th>
              <th className="px-5 py-3.5">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-[#6b7280]">
                  Loading reviews...
                </td>
              </tr>
            ) : null}

            {!loading
              ? reviews.map((review) => {
                  const message = review.content?.trim() || "No message";
                  const initial =
                    review.user.username?.slice(0, 1).toUpperCase() || "?";

                  return (
                    <tr
                      key={review.id}
                      className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 items-center justify-center rounded-full bg-[#eef2ff] text-xs font-semibold text-[#4338ca]">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-[#111827]">
                              {review.user.username}
                            </p>
                            <p className="truncate text-xs text-[#6b7280]">
                              {review.user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex h-7 items-center rounded-full bg-[#f3f4f6] px-3 text-xs font-semibold capitalize text-[#374151]">
                          {review.target}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <StarRating rating={review.rating} size="size-4" />
                      </td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => onMessageClick(review)}
                          className="max-w-[280px] truncate text-sm text-[#374151] underline decoration-[#d1d5db] underline-offset-2 transition hover:text-[#2563eb] hover:decoration-[#2563eb]"
                        >
                          &quot;{message}&quot;
                        </button>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#6b7280]">
                        {formatReviewDate(review.created_at)}
                      </td>
                    </tr>
                  );
                })
              : null}

            {!loading && reviews.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-[#6b7280]">
                  No user reviews found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
