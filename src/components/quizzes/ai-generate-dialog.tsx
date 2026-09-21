"use client";

import { useEffect, useState } from "react";
import { Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  getQuestionCountLimits,
  useQuizGenerate,
} from "@/hooks/quizzes/use-quiz-generate";
import { categoryService } from "@/services/category.service";
import { tradeService } from "@/services/trade.service";
import type { QuizQuestionCreatePayload } from "@/types/quiz-create.types";
import type { AiQuestionFormat } from "@/types/quiz-generate.types";

const STAGE_LABELS: Record<string, string> = {
  queued: "Queued",
  parsing: "Reading document",
  syllabus: "Building syllabus",
  blueprint: "Planning questions",
  generation: "Generating questions",
  validation: "Checking answers",
  images: "Creating images",
  completed: "Completed",
  failed: "Failed",
};

const FORMAT_OPTIONS: { value: AiQuestionFormat; label: string }[] = [
  { value: "mcq", label: "MCQs" },
  { value: "true_false", label: "True / False" },
  { value: "image", label: "Image" },
];

type AiGenerateDialogProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (questions: QuizQuestionCreatePayload[]) => Promise<void> | void;
  categoryId: number | null;
  categoryName: string;
  quizTitle: string;
  description: string;
};

export function AiGenerateDialog({
  open,
  onClose,
  onAdd,
  categoryId,
  categoryName,
  quizTitle,
  description,
}: AiGenerateDialogProps) {
  const [format, setFormat] = useState<AiQuestionFormat>("mcq");
  const [count, setCount] = useState(5);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [adding, setAdding] = useState(false);
  const { generating, status, progress, questions, error, generate, reset, setQuestions, setError } =
    useQuizGenerate();

  const limits = getQuestionCountLimits(format);
  const completed = progress?.completed_slots ?? 0;
  const total = progress?.total_slots ?? 0;
  const percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : generating ? 8 : 0;

  useEffect(() => {
    if (!open) return;
    reset();
    setFormat("mcq");
    setCount(5);
    setSelected(new Set());
    setAdding(false);
    setError(null);
  }, [open, reset, setError]);

  function handleClose() {
    if (generating || adding) return;
    onClose();
  }

  function handleFormatChange(next: AiQuestionFormat) {
    setFormat(next);
    const nextLimits = getQuestionCountLimits(next);
    setCount((current) =>
      Math.min(nextLimits.max, Math.max(nextLimits.min, current)),
    );
  }

  async function handleGenerate() {
    if (categoryId == null) {
      toast.error("Select a subcategory before generating questions.");
      return;
    }

    const topic =
      description.trim() || quizTitle.trim() || `Questions for ${categoryName}`;
    let resolvedCategory = categoryName.trim();
    if (!resolvedCategory) {
      try {
        const category = await categoryService.getById(categoryId);
        if (category.trade_id) {
          try {
            const trade = await tradeService.getById(category.trade_id);
            resolvedCategory = trade.title?.trim() || "";
          } catch {
            resolvedCategory = "";
          }
        }
        resolvedCategory = resolvedCategory || category.title?.trim() || "General";
      } catch {
        resolvedCategory = "General";
      }
    }

    const result = await generate({
      categoryId,
      category: resolvedCategory,
      description: topic,
      quizTitle: quizTitle.trim() || undefined,
      totalQuestions: count,
      questionFormat: format,
    });

    if (result.ok) {
      setSelected(new Set(result.questions.map((question) => question.key)));
      if (result.questions.length === 0) {
        toast.error("The AI job finished without questions. Try again.");
        return;
      }
      if (result.partial) {
        toast.warning("Some questions could not be generated. Review the ones that are ready.");
      }
    } else if (!("cancelled" in result && result.cancelled) && "message" in result && result.message) {
      toast.error(result.message);
    }
  }

  function toggleSelect(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  async function handleAddSelected() {
    const items = questions.filter((question) => selected.has(question.key));
    if (items.length === 0) return;
    setAdding(true);
    try {
      await onAdd(items.map((question) => question.payload));
      onClose();
    } finally {
      setAdding(false);
    }
  }

  function handleDeleteGenerated(id: string) {
    setQuestions((prev) => prev.filter((question) => question.key !== id));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  const statusLabel = STAGE_LABELS[progress?.stage ?? status ?? ""] ?? "Generating";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Generate AI Based Quiz"
      maxWidth="max-w-2xl"
      preventClose={generating || adding}
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-end gap-4">
          <label className="block min-w-40 space-y-1.5">
            <span className="text-sm font-medium text-[#374151]">Question Format*</span>
            <select
              value={format}
              disabled={generating}
              onChange={(e) => handleFormatChange(e.target.value as AiQuestionFormat)}
              className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#f8fafc] px-3.5 text-sm font-medium text-[#111827] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
            >
              {FORMAT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-[#374151]">Number of Questions*</span>
            <input
              type="number"
              value={count}
              disabled={generating}
              onChange={(e) =>
                setCount(
                  Math.min(
                    limits.max,
                    Math.max(limits.min, Number(e.target.value) || limits.min),
                  ),
                )
              }
              min={limits.min}
              max={limits.max}
              className="h-11 w-28 rounded-xl border border-[#e5e7eb] bg-[#f8fafc] px-3.5 text-sm font-medium text-[#111827] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
            />
          </label>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating || adding || categoryId == null}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:opacity-50"
          >
            <Sparkles className="size-4" />
            {generating ? "Generating..." : "Generate Quiz"}
          </button>
        </div>
        <p className="text-xs text-[#6b7280]">
          {format === "image"
            ? "Image questions: 1 to 3."
            : "MCQ and True/False: 5 to 100 questions."}
        </p>
        {categoryId == null ? (
          <p className="text-sm text-[#b91c1c]">
            Save the quiz with a subcategory first, then generate questions.
          </p>
        ) : null}

        {generating ? (
          <div className="rounded-xl border border-[#eef1f6] bg-[#f8fafc] px-5 py-8 text-center">
            <div className="mx-auto size-8 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#6366f1]" />
            <p className="mt-4 text-sm font-semibold text-[#111827]">
              Generating questions…
            </p>
            <p className="mt-1 text-xs text-[#6b7280]">
              {statusLabel}
              {total > 0 ? ` · ${completed} of ${total}` : ""}
            </p>
            <div className="mx-auto mt-4 h-2 w-full max-w-sm overflow-hidden rounded-full bg-[#e5e7eb]">
              <div
                className="h-full rounded-full bg-[#6366f1] transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        ) : null}

        {error && !generating ? (
          <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
            {error}
          </div>
        ) : null}

        {!generating && questions.length > 0 ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#111827]">AI Generated Questions</p>
                <p className="mt-0.5 text-xs text-[#6b7280]">
                  Select and add these questions to the quiz bank.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddSelected}
                disabled={selected.size === 0 || adding}
                className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#111827] px-4 text-sm font-semibold text-white transition hover:bg-[#1f2937] disabled:opacity-50"
              >
                {adding ? "Adding..." : "Add To Quiz Bank"}
              </button>
            </div>

            <div className="max-h-80 space-y-3 overflow-y-auto rounded-xl border border-[#eef1f6] p-3">
              {questions.map((q, i) => (
                <div key={q.key} className="rounded-xl border border-[#eef1f6] bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => toggleSelect(q.key)}
                        className={cn(
                          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border-2 transition",
                          selected.has(q.key)
                            ? "border-[#2563eb] bg-[#2563eb] text-white"
                            : "border-[#d1d5db]",
                        )}
                      >
                        {selected.has(q.key) ? (
                          <span className="size-2 rounded-full bg-white" />
                        ) : null}
                      </button>
                      <p className="text-sm font-semibold text-[#111827]">
                        Q{i + 1}. {q.question}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Delete"
                      onClick={() => handleDeleteGenerated(q.key)}
                      className="rounded-lg p-1.5 text-[#9ca3af] transition hover:bg-[#fef2f2] hover:text-[#ef4444]"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                  {q.imageUrl ? (
                    <div className="mt-3 overflow-hidden rounded-lg border border-[#eef1f6] bg-[#f8fafc] pl-8">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={q.imageUrl}
                        alt=""
                        className="max-h-48 w-full object-contain"
                      />
                    </div>
                  ) : null}
                  <div className="mt-3 space-y-1.5 pl-8">
                    {q.options.map((opt, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm">
                        <span
                          className={cn(
                            "flex size-4 shrink-0 items-center justify-center rounded-full border-2",
                            opt.isCorrect
                              ? "border-[#22c55e] bg-[#22c55e] text-white"
                              : "border-[#d1d5db]",
                          )}
                        >
                          {opt.isCorrect ? (
                            <span className="size-1.5 rounded-full bg-white" />
                          ) : null}
                        </span>
                        <span
                          className={cn(
                            opt.isCorrect ? "font-medium text-[#111827]" : "text-[#4b5563]",
                          )}
                        >
                          {opt.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </Dialog>
  );
}
