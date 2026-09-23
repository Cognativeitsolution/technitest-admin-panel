"use client";

import { useState } from "react";
import {
  Award,
  BookOpen,
  Clock3,
  Eye,
  Layers,
  Shuffle,
  Star,
  Timer,
} from "lucide-react";

import { Dialog } from "@/components/ui/dialog";
import { useQuizInfo } from "@/hooks/quizzes/use-quiz-info";
import { useQuizQuestions } from "@/hooks/quizzes/use-quiz-questions";
import { cn } from "@/lib/utils";

function capitalize(value: string | null | undefined) {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDurationSeconds(totalSeconds?: number | null) {
  if (!totalSeconds || totalSeconds <= 0) return "—";
  const minutes = Math.round(totalSeconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem > 0 ? `${hours}h ${rem}m` : `${hours}h`;
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#f1f5f9] py-3 text-sm last:border-0">
      <span className="shrink-0 font-medium text-[#64748b]">{label}</span>
      <span className="text-right font-semibold text-[#0f172a]">{value}</span>
    </div>
  );
}

type QuizPreviewDialogProps = {
  open: boolean;
  quizId: number | null;
  onClose: () => void;
};

export function QuizPreviewDialog({ open, quizId, onClose }: QuizPreviewDialogProps) {
  const { quiz, loading, error } = useQuizInfo(open ? quizId : null);
  const { items: questions, loading: questionsLoading } = useQuizQuestions(
    open ? quizId : null,
  );
  const [expanded, setExpanded] = useState<number | null>(null);

  const tradeTitle =
    quiz?.trade?.title ?? quiz?.category?.trade?.title ?? null;
  const categoryTitle = quiz?.category?.title ?? null;
  const questionCount = quiz?.total_questions ?? questions.length ?? 0;
  const attemptRules = quiz?.attempt_rules ?? [];

  return (
    <Dialog open={open} onClose={onClose} title="Quiz Preview" maxWidth="max-w-2xl">
      {loading ? (
        <p className="py-10 text-center text-sm text-[#64748b]">Loading quiz...</p>
      ) : error || !quiz ? (
        <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
          {error ?? "Quiz not found."}
        </div>
      ) : (
        <div className="space-y-5">
          {quiz.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={quiz.image_url}
              alt={quiz.name}
              className="h-44 w-full rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-28 items-center justify-center rounded-2xl bg-linear-to-br from-[#eff6ff] via-[#f8fafc] to-[#f1f5f9]">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                <BookOpen className="size-6 text-[#2563eb]" />
              </div>
            </div>
          )}

          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-extrabold tracking-tight text-[#0f172a]">
                  {quiz.name}
                </h2>
                {quiz.description ? (
                  <p className="mt-1.5 text-sm leading-relaxed text-[#64748b]">
                    {quiz.description}
                  </p>
                ) : null}
              </div>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold",
                  quiz.is_active
                    ? "bg-[#dcfce7] text-[#16a34a]"
                    : "bg-[#fef3c7] text-[#d97706]",
                )}
              >
                {quiz.is_active ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {categoryTitle ? (
                <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold text-[#2563eb]">
                  {categoryTitle}
                </span>
              ) : null}
              <span className="rounded-full bg-[#f3e8ff] px-3 py-1 text-xs font-semibold text-[#7c3aed]">
                {capitalize(quiz.difficulty_level)}
              </span>
              <span className="rounded-full bg-[#ecfdf5] px-3 py-1 text-xs font-semibold text-[#059669]">
                {capitalize(quiz.skill_level)}
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#e8edf5] bg-[#f8fafc] p-3.5">
              <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-[#dbeafe] text-[#2563eb]">
                <Eye className="size-4" />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">
                Display Count
              </p>
              <p className="mt-1 text-lg font-extrabold text-[#0f172a]">
                {quiz.display_count ?? "—"}
              </p>
            </div>
            <div className="rounded-2xl border border-[#e8edf5] bg-[#f8fafc] p-3.5">
              <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-[#ffedd5] text-[#ea580c]">
                <Layers className="size-4" />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">
                Free Attempts
              </p>
              <p className="mt-1 text-lg font-extrabold text-[#0f172a]">
                {quiz.min_attempt ?? 1}
              </p>
            </div>
            <div className="rounded-2xl border border-[#e8edf5] bg-[#f8fafc] p-3.5">
              <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-[#dcfce7] text-[#16a34a]">
                <Award className="size-4" />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">
                Passing Score
              </p>
              <p className="mt-1 text-lg font-extrabold text-[#0f172a]">
                {quiz.passing_score ?? 0}%
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#e8edf5] bg-white px-4">
            <InfoRow label="Trade" value={tradeTitle ?? "—"} />
            <InfoRow label="Subcategory" value={categoryTitle ?? "—"} />
            <InfoRow label="Difficulty Level" value={capitalize(quiz.difficulty_level)} />
            <InfoRow label="Skill Level" value={capitalize(quiz.skill_level)} />
            <InfoRow label="Total Questions" value={questionCount} />
            <InfoRow
              label="Total Duration"
              value={formatDurationSeconds(quiz.total_duration)}
            />
            <InfoRow
              label="Shuffle Questions"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <Shuffle className="size-3.5 text-[#94a3b8]" />
                  {quiz.shuffle_questions ? "Yes" : "No"}
                </span>
              }
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
              value={
                quiz.average_rating && quiz.average_rating > 0
                  ? (
                      <span className="inline-flex items-center gap-1">
                        <Star className="size-3.5 fill-[#fbbf24] text-[#fbbf24]" />
                        {quiz.average_rating.toFixed(1)}
                      </span>
                    )
                  : "—"
              }
            />
          </div>

          <div className="rounded-2xl border border-[#e8edf5] bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-[#ede9fe] text-[#7c3aed]">
                  <Timer className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0f172a]">Attempt Wait Rules</h3>
                  <p className="text-xs text-[#64748b]">
                    {attemptRules.length > 0
                      ? `${attemptRules.length} rule${attemptRules.length === 1 ? "" : "s"} configured`
                      : "No wait rules configured"}
                  </p>
                </div>
              </div>
            </div>

            {attemptRules.length === 0 ? (
              <p className="rounded-xl border border-dashed border-[#e5e7eb] py-6 text-center text-sm text-[#94a3b8]">
                No wait rules for this quiz.
              </p>
            ) : (
              <ul className="space-y-2.5">
                {attemptRules.map((rule) => (
                  <li
                    key={rule.id ?? `${rule.attempt_number}-${rule.unit}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#eef2f7] bg-[#f8fafc] px-3.5 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 items-center justify-center rounded-full bg-[#2563eb] text-xs font-bold text-white">
                        #{rule.attempt_number}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#0f172a]">
                          Attempt {rule.attempt_number}
                        </p>
                        <p className="text-xs text-[#64748b]">
                          Wait before this attempt
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#334155] shadow-sm">
                      <Clock3 className="size-3.5 text-[#94a3b8]" />
                      {rule.duration} {rule.unit}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#0f172a]">Questions</h3>
              {questionsLoading ? (
                <span className="text-xs text-[#64748b]">Loading...</span>
              ) : (
                <span className="rounded-full bg-[#f1f5f9] px-2.5 py-1 text-xs font-semibold text-[#64748b]">
                  {questions.length} shown
                </span>
              )}
            </div>

            {questionsLoading ? (
              <p className="mt-3 rounded-xl border border-[#e8ecf2] py-8 text-center text-sm text-[#64748b]">
                Loading questions...
              </p>
            ) : questions.length === 0 ? (
              <p className="mt-3 rounded-xl border border-dashed border-[#e5e7eb] py-8 text-center text-sm text-[#64748b]">
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
                        <span className="flex min-w-0 items-center gap-2 font-medium text-[#0f172a]">
                          <span className="rounded-md bg-[#eef5ff] px-2 py-0.5 text-xs font-semibold text-[#2563eb]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="truncate">{q.question}</span>
                        </span>
                        <span className="shrink-0 rounded-full bg-[#f3f4f6] px-2 py-1 text-xs text-[#64748b]">
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
