"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Upload } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { categoryService } from "@/services/category.service";
import type { CategoryItem } from "@/types/category.types";

const inputClassName =
  "h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#f8fafc] px-3.5 text-sm font-medium text-[#111827] outline-none transition focus:border-[#3b82f6] focus:bg-white focus:ring-2 focus:ring-[#3b82f6]/20";

const readOnlyClassName =
  "h-11 w-full rounded-xl border border-[#e5e7eb] bg-[#f8fafc] px-3.5 text-sm font-medium text-[#111827] cursor-default";

const levelOptions = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Skilled" },
  { value: "advance", label: "Advanced" },
];

const skillOptions = [
  { value: "student", label: "Student" },
  { value: "professional", label: "Professional" },
];

export type QuizBasicInfoValues = {
  quizName: string;
  categoryId: number | null;
  difficultyLevel: string;
  skillLevel: string;
  passingScore: string;
  maxAttempts: string;
  description: string;
  imageUrl: string;
  negativeMarkingValue: string;
  rules: {
    shuffleQuestions: boolean;
    allowNegativeMarking: boolean;
    showAnswersAfterSubmit: boolean;
    shuffleAnswers: boolean;
  };
};

export const emptyQuizBasicInfoValues: QuizBasicInfoValues = {
  quizName: "",
  categoryId: null,
  difficultyLevel: "beginner",
  skillLevel: "student",
  passingScore: "50",
  maxAttempts: "3",
  description: "",
  imageUrl: "",
  negativeMarkingValue: "0",
  rules: {
    shuffleQuestions: false,
    allowNegativeMarking: false,
    showAnswersAfterSubmit: false,
    shuffleAnswers: false,
  },
};

type FieldProps = { label: string; required?: boolean; children: React.ReactNode };
function Field({ label, required, children }: FieldProps) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-[#374151]">
        {label}
        {required ? <span className="ml-0.5 text-[#ef4444]">*</span> : null}
      </span>
      {children}
    </label>
  );
}

type QuizBasicInfoProps = {
  value: QuizBasicInfoValues;
  onChange: (next: QuizBasicInfoValues) => void;
  onImageFileChange?: (file: File | null) => void;
  readonly?: boolean;
};

export function QuizBasicInfo({
  value,
  onChange,
  onImageFileChange,
  readonly = false,
}: QuizBasicInfoProps) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    categoryService
      .getAdminList({ page: 1, per_page: 100 })
      .then((result) => {
        if (!cancelled) setCategories(result.items ?? []);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function patch(next: Partial<QuizBasicInfoValues>) {
    onChange({ ...value, ...next });
  }

  function updateRule(key: keyof QuizBasicInfoValues["rules"], checked: boolean) {
    patch({ rules: { ...value.rules, [key]: checked } });
  }

  function handleImageChange(file: File | null) {
    onImageFileChange?.(file);
    patch({ imageUrl: file ? URL.createObjectURL(file) : "" });
  }

  return (
    <>
      <section className="rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)] sm:p-6">
        <h2 className="text-lg font-bold text-[#111827]">1. Basic Information</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Quiz Name" required>
            <input
              type="text"
              value={value.quizName}
              onChange={(e) => patch({ quizName: e.target.value })}
              readOnly={readonly}
              className={readonly ? readOnlyClassName : inputClassName}
            />
          </Field>
          <Field label="Category" required>
            <div className="relative">
              <select
                value={value.categoryId ?? ""}
                onChange={(e) => patch({ categoryId: e.target.value ? Number(e.target.value) : null })}
                disabled={readonly}
                className={cn(readonly ? readOnlyClassName : inputClassName, "appearance-none pr-10")}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9ca3af]" />
            </div>
          </Field>
          <Field label="Level">
            <div className="relative">
              <select
                value={value.difficultyLevel}
                onChange={(e) => patch({ difficultyLevel: e.target.value })}
                disabled={readonly}
                className={cn(readonly ? readOnlyClassName : inputClassName, "appearance-none pr-10")}
              >
                {levelOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9ca3af]" />
            </div>
          </Field>
          <Field label="Skill Level">
            <div className="relative">
              <select
                value={value.skillLevel}
                onChange={(e) => patch({ skillLevel: e.target.value })}
                disabled={readonly}
                className={cn(readonly ? readOnlyClassName : inputClassName, "appearance-none pr-10")}
              >
                {skillOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9ca3af]" />
            </div>
          </Field>
          <Field label="Passing Score (%)" required>
            <input
              type="number"
              value={value.passingScore}
              onChange={(e) => patch({ passingScore: e.target.value })}
              readOnly={readonly}
              min={40}
              className={readonly ? readOnlyClassName : inputClassName}
            />
          </Field>
          <Field label="Minimum Attempts" required>
            <input
              type="number"
              value={value.maxAttempts}
              onChange={(e) => patch({ maxAttempts: e.target.value })}
              readOnly={readonly}
              min={1}
              className={readonly ? readOnlyClassName : inputClassName}
            />
          </Field>
          <Field label="Description" required>
            <textarea
              value={value.description}
              onChange={(e) => patch({ description: e.target.value })}
              readOnly={readonly}
              rows={3}
              className={cn(readonly ? readOnlyClassName : inputClassName, "resize-none")}
            />
          </Field>
          <Field label="Quiz Image">
            <div
              className={cn(
                "flex h-11 cursor-pointer items-center gap-3 rounded-xl border border-[#e5e7eb] bg-[#f8fafc] px-3.5",
                readonly ? "cursor-default" : "cursor-pointer",
              )}
              onClick={() => {
                if (!readonly) fileInputRef.current?.click();
              }}
            >
              <Upload className="size-4 text-[#9ca3af]" />
              <span className="text-sm text-[#6b7280]">
                {value.imageUrl ? "Change image" : "Choose file"}
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
            />
            <p className="mt-1 text-xs text-[#6b7280]">
              Supported Formats: PNG, JPG, JPEG. Max File Size: 2 MB.
            </p>
          </Field>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-medium text-[#374151]">Preview Quiz Image</p>
          <div className="flex h-40 items-center justify-center rounded-2xl bg-[#ede9fe]">
            {value.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value.imageUrl} alt="Quiz preview" className="h-full w-full rounded-2xl object-cover" />
            ) : (
              <span className="text-sm text-[#9ca3af]">No image uploaded</span>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)] sm:p-6">
        <h2 className="text-lg font-bold text-[#111827]">3. Quiz Rules &amp; Behavior</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Switch
            checked={value.rules.shuffleQuestions}
            onCheckedChange={(checked) => updateRule("shuffleQuestions", checked)}
            label="Shuffle Questions"
          />
          <Switch
            checked={value.rules.allowNegativeMarking}
            onCheckedChange={(checked) => updateRule("allowNegativeMarking", checked)}
            label="Allow Negative Marking"
          />
          <Switch
            checked={value.rules.showAnswersAfterSubmit}
            onCheckedChange={(checked) => updateRule("showAnswersAfterSubmit", checked)}
            label="Show Answers after Submit"
          />
          <Switch
            checked={value.rules.shuffleAnswers}
            onCheckedChange={(checked) => updateRule("shuffleAnswers", checked)}
            label="Shuffle Answers"
          />
        </div>
        {value.rules.allowNegativeMarking ? (
          <div className="mt-4 max-w-xs">
            <Field label="Negative Marking Value">
              <input
                type="number"
                value={value.negativeMarkingValue}
                onChange={(e) => patch({ negativeMarkingValue: e.target.value })}
                readOnly={readonly}
                min={0}
                step="0.25"
                className={readonly ? readOnlyClassName : inputClassName}
              />
            </Field>
          </div>
        ) : null}
      </section>
    </>
  );
}