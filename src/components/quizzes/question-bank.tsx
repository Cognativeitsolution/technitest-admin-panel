"use client";

import { useState } from "react";
import { Eye, Pencil, Plus, Trash2, Sparkles } from "lucide-react";

import { Dialog } from "@/components/ui/dialog";
import { QuestionFormDialog } from "@/components/quizzes/question-form-dialog";
import { AiGenerateDialog } from "@/components/quizzes/ai-generate-dialog";
import type { QuizQuestion } from "@/data/quizzes";

type QuestionBankProps = {
  questions: QuizQuestion[];
  totalTime: string;
  onQuestionsChange: (questions: QuizQuestion[]) => void;
  onPreview: () => void;
  readonly?: boolean;
};

export function QuestionBank({ questions, totalTime, onQuestionsChange, onPreview, readonly = false }: QuestionBankProps) {
  const [questionFormOpen, setQuestionFormOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState<QuizQuestion | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<QuizQuestion | null>(null);

  function handleSaveQuestion(q: QuizQuestion) {
    if (editQuestion) {
      onQuestionsChange(questions.map((item) => (item.id === q.id ? q : item)));
    } else {
      onQuestionsChange([...questions, q]);
    }
    setEditQuestion(null);
    setQuestionFormOpen(false);
  }

  function handleDeleteQuestion() {
    if (deleteTarget) {
      onQuestionsChange(questions.filter((q) => q.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  }

  function handleAddFromAi(newQuestions: QuizQuestion[]) {
    onQuestionsChange([...questions, ...newQuestions]);
  }

  return (
    <>
      <section className="rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)] sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-[#111827]">2. Question Bank</h2>
            <span className="text-sm text-[#6b7280]">Total Time: {totalTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPreview}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-4 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb]"
            >
              <Eye className="size-4" />
              Preview Questions
            </button>
            <button
              type="button"
              onClick={() => setAiOpen(true)}
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#6366f1] px-4 text-sm font-semibold text-white transition hover:bg-[#4f46e5]"
            >
              <Sparkles className="size-4" />
              Generate via AI
            </button>
          </div>
        </div>

        {questions.length > 0 ? (
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
                  {questions.map((q, i) => (
                    <tr key={q.id} className="border-t border-[#eef1f6] text-sm text-[#374151]">
                      <td className="px-4 py-3.5 font-medium">{String(i + 1).padStart(2, "0")}</td>
                      <td className="max-w-xs truncate px-4 py-3.5">{q.question}</td>
                      <td className="px-4 py-3.5">{q.type}</td>
                      <td className="px-4 py-3.5 font-mono text-xs">{q.timePerQuestion}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            aria-label="Edit question"
                            onClick={() => { setEditQuestion(q); setQuestionFormOpen(true); }}
                            className="rounded-lg p-1.5 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            type="button"
                            aria-label="Delete question"
                            onClick={() => setDeleteTarget(q)}
                            className="rounded-lg p-1.5 text-[#9ca3af] transition hover:bg-[#fef2f2] hover:text-[#ef4444]"
                          >
                            <Trash2 className="size-4" />
                          </button>
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
            <button
              type="button"
              onClick={() => { setEditQuestion(null); setQuestionFormOpen(true); }}
              className="flex size-10 items-center justify-center rounded-full bg-[#ede9fe] text-[#7c3aed] transition hover:bg-[#ddd6fe]"
            >
              <Plus className="size-5" />
            </button>
            <span className="text-sm font-medium text-[#6b7280]">Add more Questions</span>
          </div>
        ) : null}
      </section>

      <QuestionFormDialog
        open={questionFormOpen}
        onClose={() => { setQuestionFormOpen(false); setEditQuestion(null); }}
        question={editQuestion}
        onSave={handleSaveQuestion}
      />

      <AiGenerateDialog
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        onAdd={handleAddFromAi}
      />

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Question">
        <p className="text-[15px] text-[#4b5563]">Are you sure you want to delete this question?</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={() => setDeleteTarget(null)} className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb]">
            Cancel
          </button>
          <button type="button" onClick={handleDeleteQuestion} className="inline-flex h-10 items-center justify-center rounded-xl bg-[#ef4444] px-5 text-sm font-semibold text-white transition hover:bg-[#dc2626]">
            Delete
          </button>
        </div>
      </Dialog>
    </>
  );
}
