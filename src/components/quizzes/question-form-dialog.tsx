"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type {
  QuizQuestionAdmin,
  QuizQuestionCreatePayload,
  QuizQuestionType,
} from "@/types/quiz-create.types";

const inputClassName =
  "h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#f8fafc] px-3.5 text-sm font-medium text-[#111827] outline-none transition focus:border-[#3b82f6] focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/20";

const typeOptions: { value: QuizQuestionType; label: string }[] = [
  { value: "mcq", label: "MCQs" },
  { value: "tf", label: "True/False" },
  { value: "blanks", label: "Fill in the blanks" },
];

type QuestionFormDialogProps = {
  open: boolean;
  onClose: () => void;
  question: QuizQuestionAdmin | null;
  onSave: (payload: QuizQuestionCreatePayload) => void;
};

export function QuestionFormDialog({
  open,
  onClose,
  question,
  onSave,
}: QuestionFormDialogProps) {
  const [type, setType] = useState<QuizQuestionType>("mcq");
  const [time, setTime] = useState("40");
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [prevOpen, setPrevOpen] = useState(open);

  const MIN_TIME_SECONDS = 5;

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setFormError(null);
      setType(question?.type ?? "mcq");
      setTime(String(Math.max(question?.time_limit ?? 30, MIN_TIME_SECONDS)));
      setText(question?.question ?? "");
      const baseOptions = question?.option?.map((opt) => opt.option_text) ?? [];
      setOptions(
        [...baseOptions, ...Array(Math.max(0, 4 - baseOptions.length)).fill("")].slice(0, 4),
      );
      setCorrectAnswer(
        question
          ? Math.max(0, (question.option ?? []).findIndex((opt) => opt.is_correct))
          : 0,
      );
    }
  }

  function handleSave() {
    const trimmedText = text.trim();
    const timeLimit = Number(time);

    if (!trimmedText) {
      setFormError("Question text is required.");
      return;
    }

    if (!Number.isFinite(timeLimit) || timeLimit < MIN_TIME_SECONDS) {
      setFormError(`Time per question must be at least ${MIN_TIME_SECONDS} seconds.`);
      return;
    }

    const optionPayload = options
      .map((opt, index) => ({
        option_text: opt.trim(),
        is_correct: index === correctAnswer,
      }))
      .filter((opt) => opt.option_text !== "");

    if (optionPayload.length < 2) {
      setFormError("Add at least two answer options.");
      return;
    }

    if (!optionPayload.some((opt) => opt.is_correct)) {
      setFormError("Select the correct answer option.");
      return;
    }

    setFormError(null);
    onSave({
      question: trimmedText,
      type,
      time_limit: timeLimit,
      source_type: "manual",
      option: optionPayload,
    });
  }

  return (
    <Dialog open={open} onClose={onClose} title="Add / Edit Question" maxWidth="max-w-xl">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-[#374151]">Question Type</span>
            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as QuizQuestionType)}
                className={cn(inputClassName, "appearance-none pr-10")}
              >
                {typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9ca3af]" />
            </div>
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-[#374151]">Time Per Question (seconds)</span>
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              min={MIN_TIME_SECONDS}
              className={inputClassName}
            />
            <span className="text-xs text-[#6b7280]">
              Minimum {MIN_TIME_SECONDS} seconds
            </span>
          </label>
        </div>

        {formError ? (
          <p className="rounded-lg bg-[#fef2f2] px-3 py-2 text-sm text-[#b91c1c]">
            {formError}
          </p>
        ) : null}

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-[#374151]">Question Text</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            className={cn(inputClassName, "resize-none")}
          />
        </label>

        <div className="space-y-3">
          <span className="text-sm font-medium text-[#374151]">Answer Options</span>
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCorrectAnswer(i)}
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition",
                  correctAnswer === i
                    ? "border-[#22c55e] bg-[#22c55e] text-white"
                    : "border-[#d1d5db]",
                )}
                aria-label={`Set option ${i + 1} as correct`}
              >
                {correctAnswer === i ? <span className="size-2 rounded-full bg-white" /> : null}
              </button>
              <input
                type="text"
                value={opt}
                onChange={(e) => {
                  const next = [...options];
                  next[i] = e.target.value;
                  setOptions(next);
                }}
                placeholder={`Answer Option ${i + 1}`}
                className={cn(inputClassName, "border-dashed")}
              />
            </div>
          ))}
          <p className="text-xs text-[#6b7280]">
            Select the correct answer by clicking the radio button.
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={!text.trim()}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:opacity-50"
        >
          Save Changes
        </button>
      </div>
    </Dialog>
  );
}