"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { QuizBasicInfo } from "@/components/quizzes/quiz-basic-info";
import { QuestionBank } from "@/components/quizzes/question-bank";
import type { Quiz, QuizQuestion, QuizRuleSettings } from "@/data/quizzes";

type QuizDetailViewProps = {
  quiz: Quiz;
  isNew?: boolean;
};

export function QuizDetailView({ quiz, isNew = false }: QuizDetailViewProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(quiz.questions);
  const [rules, setRules] = useState<QuizRuleSettings>(quiz.rules);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/quizzes"
          className="inline-flex items-center gap-2 text-[22px] font-bold tracking-tight text-[#111827] transition hover:text-[#3b82f6]"
        >
          <ArrowLeft className="size-5" />
          {isNew ? "Add New Quiz" : "Quiz Detail"}
        </Link>
        {!isNew ? (
          <>
            <span className="hidden h-6 w-px bg-[#d1d5db] sm:block" />
            <span className="rounded-full bg-[#111827] px-3.5 py-1.5 text-sm font-semibold text-white">
              {quiz.quizName}
            </span>
          </>
        ) : null}
      </div>

      <QuizBasicInfo quiz={quiz} onRulesChange={setRules} />

      <QuestionBank
        questions={questions}
        totalTime={quiz.totalTime}
        onQuestionsChange={setQuestions}
        onPreview={() => {}}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-[#f0a500] px-8 text-sm font-semibold text-white transition hover:bg-[#d99400]"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
