"use client";

import { useState } from "react";
import { Pencil, Trash2, Sparkles } from "lucide-react";

import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/data/quizzes";

const sampleGenerated: QuizQuestion[] = [
  { id: "g1", question: "What is the primary purpose of market segmentation?", type: "MCQs", timePerQuestion: "00:00:40", options: ["To increase production efficiency", "To identify and target specific customer groups", "To reduce marketing expenses", "To improve internal communication"], correctAnswer: 1 },
  { id: "g2", question: "Which of the following is NOT a type of market segmentation?", type: "MCQs", timePerQuestion: "00:00:35", options: ["Geographic", "Demographic", "Psychographic", "Financial"], correctAnswer: 3 },
  { id: "g3", question: "What does B2B stand for in marketing?", type: "MCQs", timePerQuestion: "00:00:30", options: ["Business to Business", "Brand to Brand", "Business to Buyer", "Back to Basics"], correctAnswer: 0 },
];

type AiGenerateDialogProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (questions: QuizQuestion[]) => void;
};

export function AiGenerateDialog({ open, onClose, onAdd }: AiGenerateDialogProps) {
  const [count, setCount] = useState(5);
  const [generated, setGenerated] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function handleGenerate() {
    setLoading(true);
    setTimeout(() => {
      const items = sampleGenerated.slice(0, Math.min(count, sampleGenerated.length));
      setGenerated(items);
      setSelected(new Set(items.map((q) => q.id)));
      setLoading(false);
    }, 1200);
  }

  function toggleSelect(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  function handleAddSelected() {
    const items = generated.filter((q) => selected.has(q.id));
    onAdd(items);
    setGenerated([]);
    setSelected(new Set());
    onClose();
  }

  function handleDeleteGenerated(id: string) {
    setGenerated((prev) => prev.filter((q) => q.id !== id));
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
  }

  return (
    <Dialog open={open} onClose={onClose} title="Generate AI Based Quiz" maxWidth="max-w-2xl">
      <div className="space-y-5">
        <div className="flex flex-wrap items-end gap-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-[#374151]">Number of Questions*</span>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value) || 1)}
              min={1}
              max={50}
              className="h-11 w-28 rounded-xl border border-[#e5e7eb] bg-[#f8fafc] px-3.5 text-sm font-medium text-[#111827] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
            />
          </label>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:opacity-50"
          >
            <Sparkles className="size-4" />
            {loading ? "Generating..." : "Generate Quiz"}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="size-8 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#6366f1]" />
          </div>
        ) : generated.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#111827]">AI Generated Questions</p>
                <p className="mt-0.5 text-xs text-[#6b7280]">Select and press add to quiz button to add these questions to the quiz.</p>
              </div>
              <button
                type="button"
                onClick={handleAddSelected}
                disabled={selected.size === 0}
                className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#111827] px-4 text-sm font-semibold text-white transition hover:bg-[#1f2937] disabled:opacity-50"
              >
                Add To Quiz Bank
              </button>
            </div>

            <div className="max-h-80 space-y-3 overflow-y-auto rounded-xl border border-[#eef1f6] p-3">
              {generated.map((q, i) => (
                <div key={q.id} className="rounded-xl border border-[#eef1f6] bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => toggleSelect(q.id)}
                        className={cn(
                          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border-2 transition",
                          selected.has(q.id) ? "border-[#2563eb] bg-[#2563eb] text-white" : "border-[#d1d5db]"
                        )}
                      >
                        {selected.has(q.id) ? <span className="size-2 rounded-full bg-white" /> : null}
                      </button>
                      <p className="text-sm font-semibold text-[#111827]">Q{i + 1}. {q.question}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" aria-label="Edit" className="rounded-lg p-1.5 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]">
                        <Pencil className="size-3.5" />
                      </button>
                      <button type="button" aria-label="Delete" onClick={() => handleDeleteGenerated(q.id)} className="rounded-lg p-1.5 text-[#9ca3af] transition hover:bg-[#fef2f2] hover:text-[#ef4444]">
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1.5 pl-8">
                    {q.options.map((opt, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm">
                        <span className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded-full border-2",
                          q.correctAnswer === j ? "border-[#22c55e] bg-[#22c55e] text-white" : "border-[#d1d5db]"
                        )}>
                          {q.correctAnswer === j ? <span className="size-1.5 rounded-full bg-white" /> : null}
                        </span>
                        <span className={cn(q.correctAnswer === j ? "font-medium text-[#111827]" : "text-[#4b5563]")}>{opt}</span>
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
