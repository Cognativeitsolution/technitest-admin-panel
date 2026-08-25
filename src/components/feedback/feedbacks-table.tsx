"use client";

import { StarRating } from "@/components/ui/star-rating";
import { cn } from "@/lib/utils";
import type { FeedbackAnalysisRecord } from "@/types/user-feedback.types";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function capitalize(value: string | null | undefined) {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function sentimentColor(label: string | null | undefined) {
  const value = (label ?? "").toLowerCase();
  if (value === "positive") return "bg-[#dcfce7] text-[#16a34a]";
  if (value === "negative") return "bg-[#fef2f2] text-[#ef4444]";
  if (value === "neutral") return "bg-[#f3f4f6] text-[#6b7280]";
  return "bg-[#f3f4f6] text-[#6b7280]";
}

function statusColor(status: string | null | undefined) {
  const value = (status ?? "").toLowerCase();
  if (value === "completed") return "bg-[#dcfce7] text-[#16a34a]";
  if (value === "pending") return "bg-[#fef9c3] text-[#ca8a04]";
  return "bg-[#f3f4f6] text-[#6b7280]";
}

type FeedbacksTableProps = {
  items: FeedbackAnalysisRecord[];
  loading?: boolean;
  onMessageClick: (item: FeedbackAnalysisRecord) => void;
};

export function FeedbacksTable({
  items,
  loading = false,
  onMessageClick,
}: FeedbacksTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">User</th>
              <th className="px-5 py-3.5">Target</th>
              <th className="px-5 py-3.5">Rating</th>
              <th className="px-5 py-3.5">Review Message</th>
              <th className="px-5 py-3.5">Sentiment</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-sm text-[#6b7280]"
                >
                  Loading feedback...
                </td>
              </tr>
            ) : null}

            {!loading
              ? items.map((item) => {
                  const message = item.content?.trim() || "No message";
                  const initial =
                    item.user.username?.slice(0, 1).toUpperCase() || "?";
                  const sentiment =
                    item.sentiment_label || item.sentiment_summary;

                  return (
                    <tr
                      key={item.id}
                      className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 items-center justify-center rounded-full bg-[#eef2ff] text-xs font-semibold text-[#4338ca]">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-[#111827]">
                              {item.user.username}
                            </p>
                            <p className="truncate text-xs text-[#6b7280]">
                              {item.user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex h-7 items-center rounded-full bg-[#f3f4f6] px-3 text-xs font-semibold capitalize text-[#374151]">
                          {item.target}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <StarRating rating={item.rating} size="size-4" />
                      </td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => onMessageClick(item)}
                          className="max-w-[220px] cursor-pointer truncate text-sm text-[#374151] underline decoration-[#d1d5db] underline-offset-2 transition hover:text-[#2563eb] hover:decoration-[#2563eb]"
                        >
                          &quot;{message}&quot;
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold",
                            sentimentColor(sentiment),
                          )}
                        >
                          {sentiment ? capitalize(sentiment) : "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold",
                            statusColor(item.sentiment_status),
                          )}
                        >
                          {capitalize(item.sentiment_status)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#6b7280]">
                        {formatDate(item.created_at)}
                      </td>
                    </tr>
                  );
                })
              : null}

            {!loading && items.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-sm text-[#6b7280]"
                >
                  No feedback found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
