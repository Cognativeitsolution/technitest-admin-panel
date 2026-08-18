"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Quiz, QuizQuestion } from "@/data/quizzes";

type QuizPreviewViewProps = {
  quiz: Quiz;
};

export function QuizPreviewView({ quiz }: QuizPreviewViewProps) {
  const questions = quiz.questions;
  const [current, setCurrent] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  const q: QuizQuestion | undefined = questions[current];
  const total = questions.length || 1;

  function selectAnswer(questionId: string, answerIndex: number) {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-[#f0f0f5] py-8">
      <div className="mx-auto max-w-2xl px-4">
        <Link
          href={`/quizzes/${quiz.id}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#6b7280] transition hover:text-[#111827]"
        >
          <ArrowLeft className="size-4" />
          Back to Quiz Detail
        </Link>

        <div className="mb-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-[#9ca3af]">Quiz Name</p>
          <h1 className="mt-1 text-xl font-bold text-[#111827]">{quiz.title}</h1>
        </div>

        {q ? (
          <div className="rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(16,24,40,0.08)] sm:p-8">
            <div className="flex min-h-[300px] flex-col">
              <div className="flex items-start justify-between">
                <p className="text-[15px] font-medium leading-relaxed text-[#111827]">
                  {q.question}
                </p>
                <button type="button" aria-label="Favorite" className="shrink-0 rounded-lg p-1.5 text-[#d1d5db] transition hover:text-[#ef4444]">
                  <Heart className="size-5" />
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {q.options.map((opt, i) => {
                  const isSelected = selectedAnswers[q.id] === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => selectAnswer(q.id, i)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition",
                        isSelected
                          ? "border-[#2563eb] bg-[#eff6ff] font-medium text-[#2563eb]"
                          : "border-[#e5e7eb] text-[#374151] hover:border-[#d1d5db] hover:bg-[#f9fafb]"
                      )}
                    >
                      <span className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                        isSelected ? "border-[#2563eb] bg-[#2563eb] text-white" : "border-[#d1d5db]"
                      )}>
                        {isSelected ? <span className="size-2 rounded-full bg-white" /> : null}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto pt-6">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    disabled={current === 0}
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-[#e5e7eb] px-5 text-sm font-medium text-[#6b7280] transition hover:bg-[#d1d5db] disabled:opacity-40"
                  >
                    Skip
                  </button>
                  <button
                    type="button"
                    disabled={current >= total - 1}
                    onClick={() => setCurrent((p) => Math.min(p + 1, total - 1))}
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:opacity-40"
                  >
                    Next
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-[#eef1f6] pt-4">
              <div className="flex items-center justify-center gap-1.5">
                {Array.from({ length: Math.min(total, 15) }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrent(i)}
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full text-xs font-semibold transition",
                      i === current
                        ? "bg-[#111827] text-white"
                        : "bg-[#f0f0f5] text-[#6b7280] hover:bg-[#e5e5ea]"
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-center text-xs text-[#9ca3af]">
                Attempted Question {Object.keys(selectedAnswers).length} out of {total}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-10 text-center shadow-[0_4px_20px_rgba(16,24,40,0.08)]">
            <p className="text-sm text-[#6b7280]">No questions to preview.</p>
          </div>
        )}
      </div>
    </div>
  );
}
