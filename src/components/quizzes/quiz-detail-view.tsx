"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import {
  QuizBasicInfo,
  emptyQuizBasicInfoValues,
  type QuizBasicInfoValues,
} from "@/components/quizzes/quiz-basic-info";
import { QuestionBank } from "@/components/quizzes/question-bank";
import { useQuizInfo } from "@/hooks/quizzes/use-quiz-info";
import { quizInfoService } from "@/services/quiz-info.service";
import { ApiError } from "@/lib/api-error";
import type {
  QuizDifficultyLevel,
  QuizInfoCreatePayload,
  QuizInfoListItem,
  QuizSkillLevel,
} from "@/types/quiz-info.types";

function mapFromApi(quiz: QuizInfoListItem): QuizBasicInfoValues {
  return {
    quizName: quiz.name ?? "",
    categoryId: quiz.category_id ?? quiz.category?.id ?? null,
    difficultyLevel: (quiz.difficulty_level ?? "beginner") as string,
    skillLevel: (quiz.skill_level ?? "student") as string,
    passingScore: String(quiz.passing_score ?? 50),
    maxAttempts: String(quiz.min_attempt ?? 3),
    description: quiz.description ?? "",
    imageUrl: quiz.image_url ?? "",
    negativeMarkingValue: String(quiz.negative_marking_value ?? 0),
    rules: {
      shuffleQuestions: quiz.shuffle_questions ?? false,
      allowNegativeMarking: quiz.is_negative_marking ?? false,
      showAnswersAfterSubmit: false,
      shuffleAnswers: false,
    },
  };
}

type QuizDetailViewProps = {
  quizId?: number;
  isNew?: boolean;
};

export function QuizDetailView({ quizId, isNew = false }: QuizDetailViewProps) {
  const router = useRouter();
  const { quiz, loading, error, reload } = useQuizInfo(isNew ? null : (quizId ?? null));

  const [values, setValues] = useState<QuizBasicInfoValues>(emptyQuizBasicInfoValues);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [syncedQuizId, setSyncedQuizId] = useState<number | null | undefined>(undefined);

  if (quiz && quiz.id !== syncedQuizId) {
    setSyncedQuizId(quiz.id);
    setValues(mapFromApi(quiz));
  }

  function buildPayload(): QuizInfoCreatePayload {
    return {
      name: values.quizName,
      description: values.description,
      difficulty_level: values.difficultyLevel as QuizDifficultyLevel,
      skill_level: values.skillLevel as QuizSkillLevel,
      category_id: values.categoryId ?? 0,
      passing_score: Number(values.passingScore) || 40,
      min_attempt: Number(values.maxAttempts) || 1,
      shuffle_questions: values.rules.shuffleQuestions,
      is_negative_marking: values.rules.allowNegativeMarking,
      negative_marking_value: values.rules.allowNegativeMarking
        ? Number(values.negativeMarkingValue) || 0
        : 0,
    };
  }

  async function handleSave() {
    if (!values.quizName.trim() || values.categoryId === null) {
      toast.error("Quiz name and category are required.");
      return;
    }

    if (!imageFile && !values.imageUrl.trim()) {
      toast.error("Quiz image is required.");
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        const created = await quizInfoService.create(buildPayload(), imageFile);
        toast.success("Quiz created successfully");
        const createdId = (created as QuizInfoListItem | undefined)?.id;
        router.push(createdId ? `/quizzes/${createdId}` : "/quizzes");
      } else if (quizId) {
        await quizInfoService.update(quizId, buildPayload(), imageFile);
        toast.success("Quiz updated successfully");
        reload();
      }
    } catch (err) {
      toast.error(ApiError.fromAxiosError(err).message);
    } finally {
      setSaving(false);
    }
  }

  const headerTitle = isNew ? "Add New Quiz" : "Quiz Detail";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/quizzes"
          className="inline-flex items-center gap-2 text-[22px] font-bold tracking-tight text-[#111827] transition hover:text-[#3b82f6]"
        >
          <ArrowLeft className="size-5" />
          {headerTitle}
        </Link>
        {!isNew && values.quizName ? (
          <>
            <span className="hidden h-6 w-px bg-[#d1d5db] sm:block" />
            <span className="rounded-full bg-[#111827] px-3.5 py-1.5 text-sm font-semibold text-white">
              {values.quizName}
            </span>
          </>
        ) : null}
      </div>

      {!isNew && loading ? (
        <p className="text-sm text-[#6b7280]">Loading quiz...</p>
      ) : null}

      {!isNew && error ? (
        <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
          {error}
        </div>
      ) : null}

      {isNew || !loading ? (
        <>
          <QuizBasicInfo
            value={values}
            onChange={setValues}
            onImageFileChange={setImageFile}
          />

          {isNew ? (
            <div className="rounded-2xl border border-dashed border-[#e5e7eb] p-6 text-center">
              <p className="text-sm text-[#6b7280]">
                After creating the quiz, you will be redirected here to add questions.
              </p>
            </div>
          ) : quizId ? (
            <QuestionBank quizId={quizId} totalDuration={quiz?.total_duration} />
          ) : null}
        </>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || (!isNew && loading)}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-[#f0a500] px-8 text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:opacity-50"
        >
          {saving ? "Saving..." : isNew ? "Create Quiz" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}