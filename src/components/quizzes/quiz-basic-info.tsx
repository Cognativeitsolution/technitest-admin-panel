"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Plus, Trash2, Upload } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { categoryService } from "@/services/category.service";
import { tradeService } from "@/services/trade.service";
import type { CategoryItem } from "@/types/category.types";
import type { AttemptRuleTier, WaitUnit } from "@/types/quiz-info.types";
import type { TradeItem } from "@/types/trade.types";

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

const waitUnitOptions: { value: WaitUnit; label: string }[] = [
  { value: "hours", label: "Hours" },
  { value: "days", label: "Days" },
  { value: "weeks", label: "Weeks" },
  { value: "months", label: "Months" },
  { value: "years", label: "Years" },
];

export type QuizBasicInfoValues = {
  quizName: string;
  categoryId: number | null;
  difficultyLevel: string;
  skillLevel: string;
  passingScore: string;
  minAttempt: string;
  displayCount: string;
  description: string;
  imageUrl: string;
  negativeMarkingValue: string;
  attemptRules: AttemptRuleTier[];
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
  minAttempt: "1",
  displayCount: "1",
  description: "",
  imageUrl: "",
  negativeMarkingValue: "0",
  attemptRules: [],
  rules: {
    shuffleQuestions: false,
    allowNegativeMarking: false,
    showAnswersAfterSubmit: false,
    shuffleAnswers: false,
  },
};

function syncAttemptNumbers(
  rules: AttemptRuleTier[],
  minAttempt: number,
): AttemptRuleTier[] {
  const start = Math.max(2, minAttempt + 1);
  return rules.map((rule, index) => ({
    ...rule,
    attempt_number: start + index,
  }));
}

type FieldProps = { label: string; required?: boolean; hint?: string; children: React.ReactNode };
function Field({ label, required, hint, children }: FieldProps) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-[#374151]">
        {label}
        {required ? <span className="ml-0.5 text-[#ef4444]">*</span> : null}
      </span>
      {children}
      {hint ? <span className="block text-xs text-[#6b7280]">{hint}</span> : null}
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
  const [trades, setTrades] = useState<TradeItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedTradeId, setSelectedTradeId] = useState<number | null>(null);
  const hydratedCategoryRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    tradeService
      .getAdminListAll()
      .then((result) => {
        if (!cancelled) setTrades(result.items ?? []);
      })
      .catch(() => {
        if (!cancelled) setTrades([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!value.categoryId || hydratedCategoryRef.current === value.categoryId) {
      return;
    }

    let cancelled = false;
    categoryService
      .getById(value.categoryId)
      .then((category) => {
        if (cancelled || !category.trade_id) return;
        hydratedCategoryRef.current = value.categoryId;
        setSelectedTradeId(category.trade_id);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [value.categoryId]);

  useEffect(() => {
    let cancelled = false;
    if (!selectedTradeId) {
      setCategories([]);
      return;
    }

    categoryService
      .getAdminList({ trade_id: selectedTradeId, page: 1, per_page: 100 })
      .then((result) => {
        if (!cancelled) setCategories(result.items ?? []);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedTradeId]);

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

  function handleMinAttemptChange(raw: string) {
    const minAttempt = Math.max(1, Number(raw) || 1);
    patch({
      minAttempt: raw,
      attemptRules: syncAttemptNumbers(value.attemptRules, minAttempt),
    });
  }

  function addAttemptRule() {
    const minAttempt = Math.max(1, Number(value.minAttempt) || 1);
    const nextAttempt =
      value.attemptRules.length > 0
        ? value.attemptRules[value.attemptRules.length - 1].attempt_number + 1
        : Math.max(2, minAttempt + 1);

    patch({
      attemptRules: [
        ...value.attemptRules,
        { attempt_number: nextAttempt, duration: 1, unit: "hours" },
      ],
    });
  }

  function updateAttemptRule(
    index: number,
    next: Partial<Pick<AttemptRuleTier, "duration" | "unit">>,
  ) {
    const rules = value.attemptRules.map((rule, i) =>
      i === index ? { ...rule, ...next } : rule,
    );
    patch({ attemptRules: rules });
  }

  function removeAttemptRule(index: number) {
    const minAttempt = Math.max(1, Number(value.minAttempt) || 1);
    patch({
      attemptRules: syncAttemptNumbers(
        value.attemptRules.filter((_, i) => i !== index),
        minAttempt,
      ),
    });
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
          <Field label="Trade" required>
            <div className="relative">
              <select
                value={selectedTradeId ?? ""}
                onChange={(e) => {
                  const nextTradeId = e.target.value ? Number(e.target.value) : null;
                  setSelectedTradeId(nextTradeId);
                  patch({ categoryId: null });
                }}
                disabled={readonly}
                className={cn(readonly ? readOnlyClassName : inputClassName, "appearance-none pr-10")}
              >
                <option value="">Select trade</option>
                {trades.map((trade) => (
                  <option key={trade.id} value={trade.id}>
                    {trade.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9ca3af]" />
            </div>
          </Field>
          <Field label="Subcategory" required>
            <div className="relative">
              <select
                value={value.categoryId ?? ""}
                onChange={(e) => patch({ categoryId: e.target.value ? Number(e.target.value) : null })}
                disabled={readonly || !selectedTradeId}
                className={cn(readonly ? readOnlyClassName : inputClassName, "appearance-none pr-10")}
              >
                <option value="">
                  {selectedTradeId ? "Select subcategory" : "Select a trade first"}
                </option>
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
          <Field
            label="Free Attempts"
            required
            hint="How many free attempts a user gets before wait rules apply. Minimum 1."
          >
            <input
              type="number"
              value={value.minAttempt}
              onChange={(e) => handleMinAttemptChange(e.target.value)}
              readOnly={readonly}
              min={1}
              className={readonly ? readOnlyClassName : inputClassName}
            />
          </Field>
          <Field
            label="Display Count"
            required
            hint="How many questions are shown to the user on the front side."
          >
            <input
              type="number"
              value={value.displayCount}
              onChange={(e) => patch({ displayCount: e.target.value })}
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
              className={cn(readonly ? readOnlyClassName : inputClassName, "h-auto resize-none py-2.5")}
            />
          </Field>
          <Field label="Quiz Image" required>
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
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">2. Attempt Wait Rules</h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              After {Math.max(1, Number(value.minAttempt) || 1)} free attempt
              {Math.max(1, Number(value.minAttempt) || 1) === 1 ? "" : "s"}, set how long
              users must wait before each next attempt.
            </p>
          </div>
          {!readonly ? (
            <button
              type="button"
              onClick={addAttemptRule}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-3 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
            >
              <Plus className="size-4" />
              Add rule
            </button>
          ) : null}
        </div>

        <div className="mt-5 space-y-3">
          {value.attemptRules.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#e5e7eb] px-4 py-8 text-center text-sm text-[#6b7280]">
              No wait rules yet. Add one for the next attempt after free attempts.
            </div>
          ) : (
            value.attemptRules.map((rule, index) => (
              <div
                key={`${rule.attempt_number}-${index}`}
                className="grid items-end gap-3 rounded-xl border border-[#eef1f6] bg-[#fafbfc] p-4 sm:grid-cols-[1fr_1fr_1fr_auto]"
              >
                <Field label="Attempt #">
                  <input
                    type="number"
                    value={rule.attempt_number}
                    readOnly
                    className={readOnlyClassName}
                  />
                </Field>
                <Field label="Wait duration" required>
                  <input
                    type="number"
                    value={rule.duration}
                    onChange={(e) =>
                      updateAttemptRule(index, {
                        duration: Math.max(1, Number(e.target.value) || 1),
                      })
                    }
                    readOnly={readonly}
                    min={1}
                    className={readonly ? readOnlyClassName : inputClassName}
                  />
                </Field>
                <Field label="Unit" required>
                  <div className="relative">
                    <select
                      value={rule.unit}
                      onChange={(e) =>
                        updateAttemptRule(index, {
                          unit: e.target.value as WaitUnit,
                        })
                      }
                      disabled={readonly}
                      className={cn(
                        readonly ? readOnlyClassName : inputClassName,
                        "appearance-none pr-10",
                      )}
                    >
                      {waitUnitOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#9ca3af]" />
                  </div>
                </Field>
                {!readonly ? (
                  <button
                    type="button"
                    aria-label={`Remove wait rule for attempt ${rule.attempt_number}`}
                    onClick={() => removeAttemptRule(index)}
                    className="mb-0.5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#fecaca] text-[#ef4444] transition hover:bg-[#fef2f2]"
                  >
                    <Trash2 className="size-4" />
                  </button>
                ) : (
                  <div />
                )}
              </div>
            ))
          )}
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
