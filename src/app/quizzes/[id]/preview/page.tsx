import { notFound } from "next/navigation";

import { QuizPreviewView } from "@/components/quizzes/quiz-preview-view";
import { getQuizById } from "@/data/quizzes";

type QuizPreviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function QuizPreviewPage({ params }: QuizPreviewPageProps) {
  const { id } = await params;
  const quiz = getQuizById(id);

  if (!quiz) notFound();

  return <QuizPreviewView quiz={quiz} />;
}
