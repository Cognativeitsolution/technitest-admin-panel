"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Dialog } from "@/components/ui/dialog";
import { Can } from "@/components/shared/can";
import { QuestionFormDialog } from "@/components/quizzes/question-form-dialog";
import { AiGenerateDialog } from "@/components/quizzes/ai-generate-dialog";
import { useQuizQuestions } from "@/hooks/quizzes/use-quiz-questions";
import type { QuizQuestion } from "@/data/quizzes";
import type {
  QuizQuestionAdmin,
  QuizQuestionCreatePayload,
  QuizQuestionType,
} from "@/types/quiz-create.types";

const typeLabels: Record<QuizQuestionType, string> = {
  mcq: "MCQs",
  tf: "True/False",
  blanks: "Fill in the blanks",
};

function mapMockType(type: string): QuizQuestionType {
  if (type === "True/False") return "tf";
  if (type === "Fill in the blanks") return "blanks";
  return "mcq";
}

function parseTimeToSeconds(timePerQuestion: string): number {
  const parts = timePerQuestion.split(":").map((part) => Number(part) || 0);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] || 30;
}

function mockToPayload(q: QuizQuestion): QuizQuestionCreatePayload {
  return {
    question: q.question,
    type: mapMockType(q.type),
    time_limit: parseTimeToSeconds(q.timePerQuestion),
    source_type: "manual",
    option: q.options.map((opt, index) => ({
      option_text: opt,
      is_correct: index === q.correctAnswer,
    })),
  };
}

type QuestionBankProps = {
  quizId: number;
  totalDuration?: number;
  readonly?: boolean;
};

export function QuestionBank({ quizId, totalDuration, readonly = false }: QuestionBankProps) {
  const { items, loading, mutating, error, addMany, updateOne, removeOne } =
    useQuizQuestions(quizId);

  const [questionFormOpen, setQuestionFormOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState<QuizQuestionAdmin | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<QuizQuestionAdmin | null>(null);

  async function handleSaveQuestion(payload: QuizQuestionCreatePayload) {
    if (editQuestion) {
      const ok = await updateOne(editQuestion.id, payload);
      if (ok) {
        toast.success("Question updated successfully");
        setEditQuestion(null);
        setQuestionFormOpen(false);
      }
    } else {
      const ok = await addMany({ question: [payload] });
      if (ok) {
        toast.success("Question added successfully");
        setQuestionFormOpen(false);
      }
    }
  }

  async function handleDeleteQuestion() {
    if (!deleteTarget) return;
    const ok = await removeOne(deleteTarget.id);
    if (ok) {
      toast.success("Question deleted successfully");
      setDeleteTarget(null);
    }
  }

  async function handleAddFromAi(newQuestions: QuizQuestion[]) {
    if (newQuestions.length === 0) return;
    const ok = await addMany({ question: newQuestions.map(mockToPayload) });
    if (ok) toast.success(`${newQuestions.length} question(s) added`);
  }

  const displayTime =
    totalDuration && totalDuration > 0
      ? `${Math.round(totalDuration / 60)} min`
      : "—";

  return (
    <>
      <section className="rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)] sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-[#111827]">2. Question Bank</h2>
            <span className="text-sm text-[#6b7280]">Total Duration: {displayTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Can permission="quiz:update">
              <button
                type="button"
                onClick={() => setAiOpen(true)}
                className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#6366f1] px-4 text-sm font-semibold text-white transition hover:bg-[#4f46e5]"
              >
                <Sparkles className="size-4" />
                Generate via AI
              </button>
            </Can>
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-4 rounded-xl border border-[#e8ecf2] py-10 text-center text-sm text-[#6b7280]">
            Loading questions...
          </div>
        ) : items.length > 0 ? (
          <div className="mt-4 overflow-hidden rounded-xl border border-[#e8ecf2]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
                    <th className="px-4 py-3">Sr#</th>
                    <th className="px-4 py-3">Question</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Time per Question</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((q, i) => (
                    <tr
                      key={q.id}
                      className="border-t border-[#eef1f6] text-sm text-[#374151]"
                    >
                      <td className="px-4 py-3.5 font-medium">
                        {String(i + 1).padStart(2, "0")}
                      </td>
                      <td className="max-w-xs truncate px-4 py-3.5">{q.question}</td>
                      <td className="px-4 py-3.5">{typeLabels[q.type] ?? q.type}</td>
                      <td className="px-4 py-3.5 font-mono text-xs">
                        {q.time_limit ? `${q.time_limit}s` : "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <Can permission="quiz:update">
                            <button
                              type="button"
                              aria-label="Edit question"
                              onClick={() => {
                                setEditQuestion(q);
                                setQuestionFormOpen(true);
                              }}
                              className="rounded-lg p-1.5 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]"
                            >
                              <Pencil className="size-4" />
                            </button>
                          </Can>
                          <Can permission="quiz:update">
                            <button
                              type="button"
                              aria-label="Delete question"
                              onClick={() => setDeleteTarget(q)}
                              className="rounded-lg p-1.5 text-[#9ca3af] transition hover:bg-[#fef2f2] hover:text-[#ef4444]"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </Can>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-[#e5e7eb] py-10 text-center">
            <p className="text-sm text-[#6b7280]">No questions added yet</p>
          </div>
        )}

        {!readonly ? (
          <div className="mt-5 flex flex-col items-center gap-2">
            <Can permission="quiz:update">
              <button
                type="button"
                onClick={() => {
                  setEditQuestion(null);
                  setQuestionFormOpen(true);
                }}
                disabled={mutating}
                className="flex size-10 items-center justify-center rounded-full bg-[#ede9fe] text-[#7c3aed] transition hover:bg-[#ddd6fe] disabled:opacity-50"
              >
                <Plus className="size-5" />
              </button>
            </Can>
            <span className="text-sm font-medium text-[#6b7280]">Add more Questions</span>
          </div>
        ) : null}
      </section>

      <QuestionFormDialog
        open={questionFormOpen}
        onClose={() => {
          setQuestionFormOpen(false);
          setEditQuestion(null);
        }}
        question={editQuestion}
        onSave={handleSaveQuestion}
      />

      <AiGenerateDialog
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        onAdd={handleAddFromAi}
      />

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Question">
        <p className="text-[15px] text-[#4b5563]">
          Are you sure you want to delete this question?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteQuestion}
            disabled={mutating}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#ef4444] px-5 text-sm font-semibold text-white transition hover:bg-[#dc2626] disabled:opacity-50"
          >
            {mutating ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Dialog>
    </>
  );
}