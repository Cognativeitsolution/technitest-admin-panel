"use client";

import { useEffect, useState } from "react";

import { Dialog } from "@/components/ui/dialog";
import { StarRating } from "@/components/ui/star-rating";
import type { SubmitUserFeedbackInput } from "@/types/user-feedback.types";

type SubmitUserFeedbackDialogProps = {
  open: boolean;
  onClose: () => void;
  submitting?: boolean;
  onSubmit: (input: SubmitUserFeedbackInput) => Promise<boolean>;
};

export function SubmitUserFeedbackDialog({
  open,
  onClose,
  submitting = false,
  onSubmit,
}: SubmitUserFeedbackDialogProps) {
  const [quizInfoId, setQuizInfoId] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [target, setTarget] = useState("quiz");
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setQuizInfoId("");
    setQuestionId("");
    setTarget("quiz");
    setRating(0);
    setContent("");
    setFormError(null);
  }, [open]);

  async function handleSave() {
    const quizId = Number(quizInfoId);
    if (!Number.isInteger(quizId) || quizId < 1) {
      setFormError("A valid Quiz Info ID is required.");
      return;
    }
    if (rating < 1) {
      setFormError("Rating is required.");
      return;
    }
    if (!content.trim()) {
      setFormError("Feedback content is required.");
      return;
    }

    let parsedQuestionId: number | null = null;
    if (questionId.trim()) {
      const qid = Number(questionId);
      if (!Number.isInteger(qid) || qid < 1) {
        setFormError("Question ID must be a positive number when provided.");
        return;
      }
      parsedQuestionId = qid;
    }

    const ok = await onSubmit({
      quiz_info_id: quizId,
      question_id: parsedQuestionId,
      target: target.trim() || "quiz",
      rating,
      content: content.trim(),
    });

    if (ok) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title="Submit Feedback" maxWidth="max-w-xl">
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-[#374151]">Quiz Info ID</span>
            <input
              type="number"
              min={1}
              value={quizInfoId}
              onChange={(e) => setQuizInfoId(e.target.value)}
              placeholder="e.g. 12"
              className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-white px-3 text-sm text-[#111827] outline-none transition focus:border-[#2563eb]"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-[#374151]">
              Question ID <span className="font-normal text-[#9ca3af]">(optional)</span>
            </span>
            <input
              type="number"
              min={1}
              value={questionId}
              onChange={(e) => setQuestionId(e.target.value)}
              placeholder="e.g. 5"
              className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-white px-3 text-sm text-[#111827] outline-none transition focus:border-[#2563eb]"
            />
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-[#374151]">Target</span>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-white px-3 text-sm text-[#111827] outline-none transition focus:border-[#2563eb]"
          >
            <option value="quiz">quiz</option>
            <option value="question">question</option>
          </select>
        </label>

        <div className="space-y-2">
          <span className="text-sm font-medium text-[#374151]">Rating</span>
          <StarRating rating={rating} onChange={setRating} size="size-6" />
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-[#374151]">Content</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="Write feedback..."
            className="w-full resize-none rounded-xl border border-[#e5e7eb] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none transition focus:border-[#2563eb]"
          />
        </label>

        {formError ? (
          <p className="text-sm text-[#b91c1c]">{formError}</p>
        ) : null}

        <div className="flex justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={submitting}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
