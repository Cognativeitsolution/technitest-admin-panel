import { notFound } from "next/navigation";

import { QuizDetailView } from "@/components/quizzes/quiz-detail-view";
import { getQuizById } from "@/data/quizzes";

type QuizDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function QuizDetailPage({ params }: QuizDetailPageProps) {
  const { id } = await params;

  if (id === "new") {
    return (
      <QuizDetailView
        quiz={{
          id: "",
          title: "",
          category: "Programming",
          level: "Beginner",
          type: "Manual",
          questionsCount: 0,
          status: "Draft",
          quizName: "",
          passingScore: "50%",
          role: "Student",
          description: "",
          maxAttempts: "03",
          totalTime: "45 minutes",
          image: "",
          questions: [],
          rules: { shuffleQuestions: false, allowNegativeMarking: false, showAnswersAfterSubmit: false, shuffleAnswers: false },
        }}
        isNew
      />
    );
  }

  const quiz = getQuizById(id);
  if (!quiz) notFound();

  return <QuizDetailView quiz={quiz} />;
}
