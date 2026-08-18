"use client";

import { useState } from "react";
import { CalendarDays, ChevronDown, Upload } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const inputClassName =
  "h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#f8fafc] px-3.5 text-sm font-medium text-[#111827] outline-none transition focus:border-[#3b82f6] focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/20";

const readOnlyClassName =
  "h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#f8fafc] px-3.5 text-sm font-medium text-[#111827] cursor-default";

type FieldProps = { label: string; required?: boolean; children: React.ReactNode };
function Field({ label, required, children }: FieldProps) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-[#374151]">
        {label}{required ? <span className="ml-0.5 text-[#ef4444]">*</span> : null}
      </span>
      {children}
    </label>
  );
}

type QuizBasicInfoProps = {
  quiz: {
    quizName: string;
    category: string;
    level: string;
    passingScore: string;
    role: string;
    description: string;
    maxAttempts: string;
    image: string;
    rules: { shuffleQuestions: boolean; allowNegativeMarking: boolean; showAnswersAfterSubmit: boolean; shuffleAnswers: boolean };
  };
  readonly?: boolean;
  onRulesChange?: (rules: QuizBasicInfoProps["quiz"]["rules"]) => void;
};

export function QuizBasicInfo({ quiz, readonly = false, onRulesChange }: QuizBasicInfoProps) {
  const [rules, setRules] = useState(quiz.rules);
  const [aiOpen, setAiOpen] = useState(false);

  function updateRule(key: keyof typeof rules, value: boolean) {
    const next = { ...rules, [key]: value };
    setRules(next);
    onRulesChange?.(next);
  }

  return (
    <>
      {/* Basic Information */}
      <section className="rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)] sm:p-6">
        <h2 className="text-lg font-bold text-[#111827]">1. Basic Information</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Quiz Name" required>
            <input type="text" defaultValue={quiz.quizName} readOnly={readonly} className={readonly ? readOnlyClassName : inputClassName} />
          </Field>
          <Field label="Category">
            <div className="relative">
              <select defaultValue={quiz.category} disabled={readonly} className={cn(readonly ? readOnlyClassName : inputClassName, "appearance-none pr-10")}>
                <option>Programming</option><option>Web Dev</option><option>Designing</option><option>Electronics</option><option>Mathematics</option><option>GK</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9ca3af]" />
            </div>
          </Field>
          <Field label="Level">
            <div className="relative">
              <select defaultValue={quiz.level} disabled={readonly} className={cn(readonly ? readOnlyClassName : inputClassName, "appearance-none pr-10")}>
                <option>Beginner</option><option>Skilled</option><option>Advanced</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9ca3af]" />
            </div>
          </Field>
          <Field label="Passing Score">
            <input type="text" defaultValue={quiz.passingScore} readOnly={readonly} className={readonly ? readOnlyClassName : inputClassName} />
          </Field>
          <Field label="Role">
            <div className="relative">
              <select defaultValue={quiz.role} disabled={readonly} className={cn(readonly ? readOnlyClassName : inputClassName, "appearance-none pr-10")}>
                <option>Student</option><option>Admin</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9ca3af]" />
            </div>
          </Field>
          <Field label="Maximum Attempts">
            <input type="text" defaultValue={quiz.maxAttempts} readOnly={readonly} className={readonly ? readOnlyClassName : inputClassName} />
          </Field>
          <Field label="Description">
            <div className="relative">
              <textarea
                defaultValue={quiz.description}
                readOnly={readonly}
                rows={3}
                className={cn(readonly ? readOnlyClassName : inputClassName, "resize-none pr-24")}
              />
              {readonly ? null : (
                <button
                  type="button"
                  onClick={() => setAiOpen(true)}
                  className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#ede9fe] px-3 py-1 text-xs font-semibold text-[#7c3aed] transition hover:bg-[#ddd6fe]"
                >
                  AI Generate
                </button>
              )}
            </div>
          </Field>
          <Field label="Quiz Image" required>
            <div className="flex h-11 items-center gap-3 rounded-xl border border-[#e5e7eb] bg-[#f8fafc] px-3.5">
              <Upload className="size-4 text-[#9ca3af]" />
              <span className="text-sm text-[#6b7280]">Choose file</span>
            </div>
            <p className="mt-1 text-xs text-[#6b7280]">Supported Formats: PNG, JPG, JPEG. Max File Size: 2 MB.</p>
          </Field>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-medium text-[#374151]">Preview Quiz Image</p>
          <div className="flex h-40 items-center justify-center rounded-2xl bg-[#ede9fe]">
            {quiz.image ? (
              <img src={quiz.image} alt="Quiz preview" className="h-full w-full rounded-2xl object-cover" />
            ) : (
              <span className="text-sm text-[#9ca3af]">No image uploaded</span>
            )}
          </div>
        </div>
      </section>

      {/* Quiz Rules */}
      <section className="rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)] sm:p-6">
        <h2 className="text-lg font-bold text-[#111827]">3. Quiz Rules &amp; Behavior</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Switch checked={rules.shuffleQuestions} onCheckedChange={(v) => updateRule("shuffleQuestions", v)} label="Shuffle Questions" />
          <Switch checked={rules.allowNegativeMarking} onCheckedChange={(v) => updateRule("allowNegativeMarking", v)} label="Allow Negative Marking" />
          <Switch checked={rules.showAnswersAfterSubmit} onCheckedChange={(v) => updateRule("showAnswersAfterSubmit", v)} label="Show Answers after Submit" />
          <Switch checked={rules.shuffleAnswers} onCheckedChange={(v) => updateRule("shuffleAnswers", v)} label="Shuffle Answers" />
        </div>
      </section>

      <Dialog open={aiOpen} onClose={() => setAiOpen(false)} title="AI Generate Description" maxWidth="max-w-md">
        <p className="text-sm text-[#4b5563]">Generate a quiz description using AI. This feature will be available soon.</p>
        <div className="mt-4 flex justify-end">
          <button type="button" onClick={() => setAiOpen(false)} className="inline-flex h-10 items-center justify-center rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white transition hover:bg-[#d99400]">
            Close
          </button>
        </div>
      </Dialog>
    </>
  );
}
