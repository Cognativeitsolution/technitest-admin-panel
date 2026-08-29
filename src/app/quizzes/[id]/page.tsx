import { notFound } from "next/navigation";

import { QuizDetailView } from "@/components/quizzes/quiz-detail-view";

type QuizDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function QuizDetailPage({ params }: QuizDetailPageProps) {
  const { id } = await params;

  if (id === "new") {
    return <QuizDetailView isNew />;
  }

  const quizId = Number(id);
  if (!Number.isInteger(quizId) || quizId <= 0) {
    notFound();
  }

  return <QuizDetailView quizId={quizId} />;
}