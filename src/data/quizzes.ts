export type QuizCategory = "Programming" | "Web Dev" | "Designing" | "Electronics" | "Mathematics" | "GK";
export type QuizLevel = "Beginner" | "Skilled" | "Advanced";
export type QuizType = "Manual" | "AI-Generated";
export type QuizStatus = "Active" | "Draft";
export type QuestionType = "MCQs" | "True/False" | "Image Based" | "Fill in the blanks";

export type QuizRuleSettings = {
  shuffleQuestions: boolean;
  allowNegativeMarking: boolean;
  showAnswersAfterSubmit: boolean;
  shuffleAnswers: boolean;
};

export type QuizQuestion = {
  id: string;
  question: string;
  type: QuestionType;
  timePerQuestion: string;
  options: string[];
  correctAnswer: number;
};

export type Quiz = {
  id: string;
  title: string;
  category: QuizCategory;
  level: QuizLevel;
  type: QuizType;
  questionsCount: number;
  status: QuizStatus;
  quizName: string;
  passingScore: string;
  role: string;
  description: string;
  maxAttempts: string;
  totalTime: string;
  image: string;
  questions: QuizQuestion[];
  rules: QuizRuleSettings;
};

export const categoryOptions: QuizCategory[] = ["Programming", "Web Dev", "Designing", "Electronics", "Mathematics", "GK"];
export const levelOptions: QuizLevel[] = ["Beginner", "Skilled", "Advanced"];
export const typeOptions: QuizType[] = ["AI-Generated", "Manual"];
export const questionTypeOptions: QuestionType[] = ["MCQs", "True/False", "Image Based", "Fill in the blanks"];

export const quizzes: Quiz[] = [
  {
    id: "QZ-001",
    title: "JavaScript Basics",
    category: "Programming",
    level: "Beginner",
    type: "Manual",
    questionsCount: 45,
    status: "Active",
    quizName: "JavaScript Basic",
    passingScore: "50%",
    role: "Student",
    description: "Brief description of quiz...",
    maxAttempts: "03",
    totalTime: "45 minutes",
    image: "",
    questions: [
      { id: "q1", question: "What is the primary purpose of market segmentation?", type: "MCQs", timePerQuestion: "00:00:40", options: ["To increase production efficiency", "To identify and target specific customer groups", "To reduce marketing expenses", "To improve internal communication"], correctAnswer: 1 },
      { id: "q2", question: "Is guerrilla marketing typically a low-cost strategy that relies on creative, unconventional methods to promote a product?", type: "MCQs", timePerQuestion: "00:01:00", options: ["Yes", "No"], correctAnswer: 0 },
      { id: "q3", question: "Which image represents \u201cGuerrilla Marketing\u201d?", type: "Image Based", timePerQuestion: "00:00:50", options: ["Image A", "Image B", "Image C", "Image D"], correctAnswer: 2 },
      { id: "q4", question: "What is the primary purpose of market segmentation?", type: "True/False", timePerQuestion: "00:00:35", options: ["Yes", "No"], correctAnswer: 1 },
      { id: "q5", question: "Which image represents \u201cGuerrilla Marketing\u201d?", type: "Fill in the blanks", timePerQuestion: "00:02:00", options: ["Guerrilla", "Viral", "Ambient", "Experiential"], correctAnswer: 0 },
      { id: "q6", question: "What is the primary purpose of market segmentation?", type: "MCQs", timePerQuestion: "00:00:60", options: ["Option A", "Option B", "Option C", "Option D"], correctAnswer: 0 },
      { id: "q7", question: "Which image represents \u201cGuerrilla Marketing\u201d?", type: "MCQs", timePerQuestion: "00:00:25", options: ["Image 1", "Image 2", "Image 3", "Image 4"], correctAnswer: 1 },
    ],
    rules: { shuffleQuestions: true, allowNegativeMarking: false, showAnswersAfterSubmit: true, shuffleAnswers: false },
  },
  {
    id: "QZ-002",
    title: "HTML Advanced Challenge",
    category: "Web Dev",
    level: "Advanced",
    type: "AI-Generated",
    questionsCount: 40,
    status: "Draft",
    quizName: "HTML Advanced",
    passingScore: "60%",
    role: "Student",
    description: "Advanced HTML quiz covering semantic elements and accessibility.",
    maxAttempts: "05",
    totalTime: "40 minutes",
    image: "",
    questions: [],
    rules: { shuffleQuestions: false, allowNegativeMarking: false, showAnswersAfterSubmit: false, shuffleAnswers: false },
  },
  {
    id: "QZ-003",
    title: "General Knowledge Test",
    category: "GK",
    level: "Advanced",
    type: "AI-Generated",
    questionsCount: 45,
    status: "Active",
    quizName: "General Knowledge",
    passingScore: "40%",
    role: "Student",
    description: "General knowledge assessment covering various topics.",
    maxAttempts: "03",
    totalTime: "50 minutes",
    image: "",
    questions: [],
    rules: { shuffleQuestions: true, allowNegativeMarking: false, showAnswersAfterSubmit: true, shuffleAnswers: true },
  },
  {
    id: "QZ-004",
    title: "Math Quick Quiz",
    category: "Mathematics",
    level: "Beginner",
    type: "Manual",
    questionsCount: 40,
    status: "Active",
    quizName: "Math Quick",
    passingScore: "50%",
    role: "Student",
    description: "Quick math assessment for beginners.",
    maxAttempts: "02",
    totalTime: "30 minutes",
    image: "",
    questions: [],
    rules: { shuffleQuestions: false, allowNegativeMarking: true, showAnswersAfterSubmit: true, shuffleAnswers: false },
  },
  {
    id: "QZ-005",
    title: "HTML Advanced Challenge",
    category: "Web Dev",
    level: "Advanced",
    type: "Manual",
    questionsCount: 40,
    status: "Active",
    quizName: "HTML Advanced 2",
    passingScore: "55%",
    role: "Student",
    description: "Second version of the HTML advanced challenge.",
    maxAttempts: "03",
    totalTime: "45 minutes",
    image: "",
    questions: [],
    rules: { shuffleQuestions: true, allowNegativeMarking: false, showAnswersAfterSubmit: false, shuffleAnswers: true },
  },
];

export function getQuizById(id: string) {
  return quizzes.find((q) => q.id === id);
}
