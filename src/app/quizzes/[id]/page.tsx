import { notFound } from "next/navigation";

import { QuizDetailView } from "@/components/quizzes/quiz-detail-view";

type QuizDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ category_id?: string }>;
};

export default async function QuizDetailPage({
  params,
  searchParams,
}: QuizDetailPageProps) {
  const { id } = await params;
  const { category_id } = await searchParams;
  const parsedCategoryId = Number(category_id);
  const initialCategoryId =
    Number.isInteger(parsedCategoryId) && parsedCategoryId > 0
      ? parsedCategoryId
      : undefined;

  if (id === "new") {
    return <QuizDetailView isNew initialCategoryId={initialCategoryId} />;
  }

  const quizId = Number(id);
  if (!Number.isInteger(quizId) || quizId <= 0) {
    notFound();
  }

  return <QuizDetailView quizId={quizId} />;
}