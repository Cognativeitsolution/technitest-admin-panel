"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Dialog } from "@/components/ui/dialog";
import { TextField } from "@/components/ui/text-field";
import {
  FAQ_CATEGORY_LABELS,
  isFaqCategory,
  nextDisplayOrder,
} from "@/lib/faq-utils";
import { cn } from "@/lib/utils";
import { FAQ_CATEGORIES, type FaqPayload, type FaqRecord } from "@/types/faq.types";

type FaqDialogProps = {
  open: boolean;
  onClose: () => void;
  faq: FaqRecord | null;
  existingFaqs: FaqRecord[];
  submitting?: boolean;
  onCreate: (payloads: FaqPayload[]) => Promise<boolean>;
  onUpdate: (faqId: number, payload: FaqPayload) => Promise<boolean>;
};

type DraftFaq = {
  key: string;
  question: string;
  answer: string;
  faq_category: (typeof FAQ_CATEGORIES)[number];
  display_order: string;
};

const selectClassName =
  "h-[48px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-4 text-[14px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0";

const textareaClassName =
  "w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 py-3 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0";

function emptyDraft(displayOrder: number): DraftFaq {
  return {
    key: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    question: "",
    answer: "",
    faq_category: "basic",
    display_order: String(displayOrder),
  };
}

function draftFromFaq(faq: FaqRecord): DraftFaq {
  return {
    key: String(faq.id),
    question: faq.question,
    answer: faq.answer,
    faq_category: isFaqCategory(faq.faq_category)
      ? faq.faq_category
      : "basic",
    display_order:
      faq.display_order == null ? "" : String(faq.display_order),
  };
}

function FieldLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[14px] font-medium text-[#111111]"
    >
      {children}
    </label>
  );
}

function parseDisplayOrder(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  if (!Number.isInteger(parsed) || parsed < 1) return undefined;
  return parsed;
}

export function FaqDialog({
  open,
  onClose,
  faq,
  existingFaqs,
  submitting = false,
  onCreate,
  onUpdate,
}: FaqDialogProps) {
  const isEdit = Boolean(faq);
  const [drafts, setDrafts] = useState<DraftFaq[]>([emptyDraft(1)]);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (faq) {
      setDrafts([draftFromFaq(faq)]);
    } else {
      setDrafts([emptyDraft(nextDisplayOrder(existingFaqs))]);
    }
    setFormError(null);
  }, [open, faq, existingFaqs]);

  function updateDraft(key: string, patch: Partial<DraftFaq>) {
    setDrafts((prev) =>
      prev.map((draft) => (draft.key === key ? { ...draft, ...patch } : draft)),
    );
  }

  function addDraft() {
    setDrafts((prev) => [
      ...prev,
      emptyDraft(nextDisplayOrder(existingFaqs) + prev.length),
    ]);
  }

  function removeDraft(key: string) {
    setDrafts((prev) => (prev.length <= 1 ? prev : prev.filter((d) => d.key !== key)));
  }

  async function handleSave() {
    const payloads: FaqPayload[] = [];

    for (const [index, draft] of drafts.entries()) {
      const question = draft.question.trim();
      const answer = draft.answer.trim();
      const displayOrder = parseDisplayOrder(draft.display_order);

      if (!question) {
        setFormError(
          drafts.length > 1
            ? `Question is required on item ${index + 1}.`
            : "Question is required.",
        );
        return;
      }
      if (!answer) {
        setFormError(
          drafts.length > 1
            ? `Answer is required on item ${index + 1}.`
            : "Answer is required.",
        );
        return;
      }
      if (displayOrder === undefined) {
        setFormError("Display order must be a whole number of 1 or more.");
        return;
      }

      payloads.push({
        question,
        answer,
        faq_category: draft.faq_category,
        display_order: displayOrder,
      });
    }

    setFormError(null);
    const ok = isEdit && faq
      ? await onUpdate(faq.id, payloads[0])
      : await onCreate(payloads);
    if (ok) onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit FAQ" : "Add FAQ"}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {drafts.map((draft, index) => (
          <div
            key={draft.key}
            className={cn(
              drafts.length > 1 &&
                "rounded-2xl border border-[#eef1f6] bg-[#fafbfc] p-4",
            )}
          >
            {drafts.length > 1 ? (
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-[#111827]">
                  Question {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeDraft(draft.key)}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-[#ef4444] transition hover:bg-[#fef2f2]"
                >
                  <Trash2 className="size-3.5" />
                  Remove
                </button>
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-[10px]">
                <FieldLabel htmlFor={`faq-category-${draft.key}`}>
                  Category
                </FieldLabel>
                <select
                  id={`faq-category-${draft.key}`}
                  value={draft.faq_category}
                  onChange={(e) =>
                    updateDraft(draft.key, {
                      faq_category: e.target.value as DraftFaq["faq_category"],
                    })
                  }
                  className={selectClassName}
                >
                  {FAQ_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {FAQ_CATEGORY_LABELS[category]}
                    </option>
                  ))}
                </select>
              </div>

              <TextField
                label="Display order"
                type="number"
                min={1}
                value={draft.display_order}
                onChange={(e) =>
                  updateDraft(draft.key, { display_order: e.target.value })
                }
                placeholder="e.g. 1"
                inputClassName="h-[48px] text-[#4b5563]"
              />

              <div className="flex flex-col gap-[10px] sm:col-span-2">
                <FieldLabel htmlFor={`faq-question-${draft.key}`}>
                  Question<span className="ml-0.5 text-[#ff0000]">*</span>
                </FieldLabel>
                <input
                  id={`faq-question-${draft.key}`}
                  value={draft.question}
                  onChange={(e) =>
                    updateDraft(draft.key, { question: e.target.value })
                  }
                  placeholder="What do users usually ask?"
                  className="h-[48px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
                />
              </div>

              <div className="flex flex-col gap-[10px] sm:col-span-2">
                <FieldLabel htmlFor={`faq-answer-${draft.key}`}>
                  Answer<span className="ml-0.5 text-[#ff0000]">*</span>
                </FieldLabel>
                <textarea
                  id={`faq-answer-${draft.key}`}
                  value={draft.answer}
                  onChange={(e) =>
                    updateDraft(draft.key, { answer: e.target.value })
                  }
                  rows={4}
                  placeholder="Write a clear, helpful answer"
                  className={textareaClassName}
                />
              </div>
            </div>
          </div>
        ))}

        {!isEdit ? (
          <button
            type="button"
            onClick={addDraft}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-dashed border-[#d1d5db] bg-white px-3.5 text-sm font-medium text-[#374151] transition hover:border-[#f0a500] hover:bg-[#fffbeb] hover:text-[#b45309]"
          >
            <Plus className="size-4" />
            Add another question
          </button>
        ) : null}

        {formError ? (
          <p className="text-sm text-[#b91c1c]">{formError}</p>
        ) : null}
      </div>

      <div className="mt-6 flex justify-end gap-3 border-t border-[#eef1f6] pt-5">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={submitting}
          className="inline-flex h-11 min-w-[140px] items-center justify-center rounded-xl bg-[#f0a500] px-6 text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:opacity-50"
        >
          {submitting
            ? "Saving..."
            : isEdit
              ? "Update FAQ"
              : drafts.length > 1
                ? `Add ${drafts.length} FAQs`
                : "Add FAQ"}
        </button>
      </div>
    </Dialog>
  );
}
