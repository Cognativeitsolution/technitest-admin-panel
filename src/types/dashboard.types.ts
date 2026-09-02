export type DashboardDatePreset = "all" | "today" | "7d" | "30d" | "this_month" | "this_year";

export type UserGrowthPeriod = "30d" | "3m" | "6m" | "this_year" | "all";
export type UserGrowthSegment = "all" | "students" | "professionals";

export type QuizAttemptPeriod = "this_week" | "last_week" | "this_month" | "last_30d";

export type ActivityFilter = "all" | "today" | "7d" | "30d" | "quizzes" | "certificates" | "referrals" | "reviews";

export type TopScorerPeriod = "all" | "this_month" | "this_week";

export type DashboardStat = {
  title: string;
  value: string;
  trend: {
    value: string;
    direction: "up" | "down";
    label: string;
  };
  iconName: "users" | "quizzes" | "certificates" | "payments";
  iconWrapClassName: string;
  iconClassName: string;
};

export type UserGrowthPoint = {
  month: string;
  students: number;
  professionals: number;
  total: number;
};

export type QuizAttemptPoint = {
  day: string;
  attempts: number;
  completed: number;
};

export type ActivityItem = {
  id: string;
  text: string;
  time: string;
  date: string;
  category: "quizzes" | "certificates" | "referrals" | "reviews";
};

export type TopScorerItem = {
  name: string;
  score: string;
  avatar: string;
  quizzesTaken: number;
  period: "all" | "this_month" | "this_week";
};

export type ReportType = "full" | "growth" | "quizzes" | "financial" | "activities";
export type ReportFormat = "pdf" | "csv";

export type ReportConfig = {
  title: string;
  type: ReportType;
  format: ReportFormat;
  includeSummary: boolean;
  includeGrowth: boolean;
  includeQuizzes: boolean;
  includeTopScorers: boolean;
  includeActivities: boolean;
  startDate?: string;
  endDate?: string;
};
