"use client";

import { useState } from "react";

import { Dialog } from "@/components/ui/dialog";
import { useQuizInfo } from "@/hooks/quizzes/use-quiz-info";
import { useQuizQuestions } from "@/hooks/quizzes/use-quiz-questions";
import { cn } from "@/lib/utils";

function capitalize(value: string | null | undefined) {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#f3f4f6] py-2.5 text-sm last:border-0">
      <span className="text-[#6b7280]">{label}</span>
      <span className="text-right font-medium text-[#111827]">{value}</span>
    </div>
  );
}

type QuizPreviewDialogProps = {
  open: boolean;
  quizId: number | null;
  onClose: () => void;
};

export function QuizPreviewDialog({ open, quizId, onClose }: QuizPreviewDialogProps) {
  const { quiz, loading, error } = useQuizInfo(quizId);
  const { items: questions, loading: questionsLoading } = useQuizQuestions(quizId);

  const [expanded, setExpanded] = useState<number | null>(null);

  const badge = (active: boolean | undefined) =>
    cn(
      "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
      active ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#fef3c7] text-[#d97706]",
    );

  return (
    <Dialog open={open} onClose={onClose} title="Quiz Preview" maxWidth="max-w-2xl">
      {loading ? (
        <p className="py-8 text-center text-sm text-[#6b7280]">Loading quiz...</p>
      ) : error || !quiz ? (
        <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
          {error ?? "Quiz not found."}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="relative mt-1">
            {quiz.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={quiz.image_url}
                alt={quiz.name}
                className="h-44 w-full rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-28 items-center justify-center rounded-xl bg-[#f3f4f6] text-sm font-semibold text-[#9ca3af]">
                {quiz.name}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#111827]">{quiz.name}</h2>
            {quiz.description ? (
              <p className="mt-1 text-sm text-[#6b7280]">{quiz.description}</p>
            ) : null}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold text-[#2563eb]">
                {quiz.category?.title ?? "Uncategorized"}
              </span>
              <span className="rounded-full bg-[#f3e8ff] px-3 py-1 text-xs font-semibold text-[#7c3aed]">
                {capitalize(quiz.difficulty_level)}
              </span>
              <span className="rounded-full bg-[#ecfdf5] px-3 py-1 text-xs font-semibold text-[#059669]">
                {capitalize(quiz.skill_level)}
              </span>
              {badge(quiz.is_active)}
            </div>
          </div>

          <div className="overflow-hidden">
            <InfoRow label="Category" value={quiz.category?.title ?? "—"} />
            <InfoRow label="Difficulty Level" value={capitalize(quiz.difficulty_level)} />
            <InfoRow label="Skill Level" value={capitalize(quiz.skill_level)} />
            <InfoRow label="Passing Score" value={`${quiz.passing_score ?? 0}%`} />
            <InfoRow label="Max Attempts" value={quiz.min_attempt ?? 1} />
            <InfoRow label="Total Questions" value={quiz.total_questions ?? questions.length ?? 0} />
            <InfoRow
              label="Total Duration"
              value={
                quiz.total_duration && quiz.total_duration > 0
                  ? `${Math.round(quiz.total_duration / 60)} min`
                  : "—"
              }
            />
            <InfoRow
              label="Shuffle Questions"
              value={quiz.shuffle_questions ? "Yes" : "No"}
            />
            <InfoRow
              label="Negative Marking"
              value={
                quiz.is_negative_marking
                  ? `${quiz.negative_marking_value ?? 0}`
                  : "No"
              }
            />
            <InfoRow
              label="Rating"
              value={quiz.average_rating ? `${quiz.average_rating.toFixed(1)} ★` : "—"}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#111827]">Questions</h3>
              {questionsLoading ? (
                <span className="text-xs text-[#6b7280]">Loading...</span>
              ) : (
                <span className="text-xs text-[#6b7280]">
                  {questions.length} shown
                </span>
              )}
            </div>

            {questionsLoading ? (
              <p className="mt-3 rounded-xl border border-[#e8ecf2] py-8 text-center text-sm text-[#6b7280]">
                Loading questions...
              </p>
            ) : questions.length === 0 ? (
              <p className="mt-3 rounded-xl border border-dashed border-[#e5e7eb] py-8 text-center text-sm text-[#6b7280]">
                No questions added yet.
              </p>
            ) : (
              <div className="mt-3 space-y-2.5">
                {questions.map((q, i) => {
                  const isOpen = expanded === q.id;
                  return (
                    <div
                      key={q.id}
                      className="overflow-hidden rounded-xl border border-[#e8ecf2]"
                    >
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : q.id)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition hover:bg-[#fafbfc]"
                      >
                        <span className="flex items-center gap-2 font-medium text-[#111827]">
                          <span className="rounded-md bg-[#eef5ff] px-2 py-0.5 text-xs font-semibold text-[#2563eb]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="truncate">{q.question}</span>
                        </span>
                        <span className="shrink-0 rounded-full bg-[#f3f4f6] px-2 py-1 text-xs text-[#6b7280]">
                          {q.time_limit ? `${q.time_limit}s` : "—"}
                        </span>
                      </button>

                      {isOpen ? (
                        <div className="space-y-2 border-t border-[#eef1f6] px-4 py-3">
                          {(q.option ?? []).map((opt, j) => (
                            <div
                              key={opt.id ?? j}
                              className={cn(
                                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
                                opt.is_correct
                                  ? "bg-[#dcfce7] font-medium text-[#15803d]"
                                  : "bg-[#f9fafb] text-[#374151]",
                              )}
                            >
                              <span
                                className={cn(
                                  "flex size-4 shrink-0 items-center justify-center rounded-full border-2 text-[10px] leading-none",
                                  opt.is_correct
                                    ? "border-[#22c55e] bg-[#22c55e] text-white"
                                    : "border-[#d1d5db]",
                                )}
                              >
                                {opt.is_correct ? "✓" : ""}
                              </span>
                              {opt.option_text}
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </Dialog>
  );
}