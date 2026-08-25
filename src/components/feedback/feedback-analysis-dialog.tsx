"use client";

import { Dialog } from "@/components/ui/dialog";
import { StarRating } from "@/components/ui/star-rating";
import type { FeedbackAnalysisRecord } from "@/types/user-feedback.types";

type FeedbackAnalysisDialogProps = {
  open: boolean;
  onClose: () => void;
  item: FeedbackAnalysisRecord | null;
};

export function FeedbackAnalysisDialog({
  open,
  onClose,
  item,
}: FeedbackAnalysisDialogProps) {
  if (!item) return null;

  const message = item.content?.trim() || "No message";
  const sentiment = item.sentiment_label || item.sentiment_summary;

  return (
    <Dialog open={open} onClose={onClose} title="Feedback Details" maxWidth="max-w-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <StarRating rating={item.rating} size="size-5" />
          <span className="text-xs font-semibold capitalize text-[#6b7280]">
            {item.sentiment_status ?? "—"}
          </span>
        </div>

        <p className="text-[15px] leading-relaxed text-[#374151]">
          {message}
        </p>

        <div className="space-y-2 rounded-xl border border-[#eef1f6] bg-[#f9fafb] p-4 text-sm">
          <p>
            <span className="font-semibold text-[#111827]">Sentiment: </span>
            <span className="text-[#374151]">{sentiment ?? "—"}</span>
          </p>
          {item.sentiment_confidence != null ? (
            <p>
              <span className="font-semibold text-[#111827]">Confidence: </span>
              <span className="text-[#374151]">
                {Math.round(item.sentiment_confidence * 100)}%
              </span>
            </p>
          ) : null}
          {item.sentiment_tone ? (
            <p>
              <span className="font-semibold text-[#111827]">Tone: </span>
              <span className="text-[#374151]">{item.sentiment_tone}</span>
            </p>
          ) : null}
          {item.analysis_note ? (
            <p>
              <span className="font-semibold text-[#111827]">Note: </span>
              <span className="text-[#374151]">{item.analysis_note}</span>
            </p>
          ) : null}
        </div>
      </div>
    </Dialog>
  );
}
