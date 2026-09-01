import {
  ActivityFilter,
  ActivityItem,
  DashboardDatePreset,
  DashboardStat,
  QuizAttemptPeriod,
  QuizAttemptPoint,
  ReportConfig,
  TopScorerItem,
  TopScorerPeriod,
  UserGrowthPeriod,
  UserGrowthPoint,
} from "@/types/dashboard.types";
import { downloadCsv, downloadPdf } from "@/lib/export-file";
import { DateRange } from "@/components/ui/date-range-picker";

export const INITIAL_STATS: DashboardStat[] = [
  {
    title: "Total User",
    value: "40,689",
    trend: { value: "8.5%", direction: "up", label: "from last period" },
    iconName: "users",
    iconWrapClassName: "bg-[#dbeafe]",
    iconClassName: "text-[#2563eb]",
  },
  {
    title: "Total Quizzes",
    value: "145,697",
    trend: { value: "12.3%", direction: "up", label: "from last period" },
    iconName: "quizzes",
    iconWrapClassName: "bg-[#ffedd5]",
    iconClassName: "text-[#ea580c]",
  },
  {
    title: "Certificates Issued",
    value: "45K+",
    trend: { value: "3.2%", direction: "down", label: "from last period" },
    iconName: "certificates",
    iconWrapClassName: "bg-[#dcfce7]",
    iconClassName: "text-[#16a34a]",
  },
  {
    title: "Payments Received",
    value: "$110,000",
    trend: { value: "15.8%", direction: "up", label: "from last period" },
    iconName: "payments",
    iconWrapClassName: "bg-[#e0f2fe]",
    iconClassName: "text-[#0284c7]",
  },
];

export const USER_GROWTH_DATASETS: Record<UserGrowthPeriod, UserGrowthPoint[]> = {
  "30d": [
    { month: "Week 1", students: 120, professionals: 90, total: 210 },
    { month: "Week 2", students: 180, professionals: 140, total: 320 },
    { month: "Week 3", students: 230, professionals: 190, total: 420 },
    { month: "Week 4", students: 310, professionals: 260, total: 570 },
  ],
  "3m": [
    { month: "Month 1", students: 480, professionals: 390, total: 870 },
    { month: "Month 2", students: 620, professionals: 510, total: 1130 },
    { month: "Month 3", students: 840, professionals: 680, total: 1520 },
  ],
  "6m": [
    { month: "Jul", students: 360, professionals: 270, total: 630 },
    { month: "Aug", students: 420, professionals: 340, total: 760 },
    { month: "Sep", students: 390, professionals: 380, total: 770 },
    { month: "Oct", students: 470, professionals: 350, total: 820 },
    { month: "Nov", students: 510, professionals: 430, total: 940 },
    { month: "Dec", students: 560, professionals: 480, total: 1040 },
  ],
  this_year: [
    { month: "Q1", students: 850, professionals: 620, total: 1470 },
    { month: "Q2", students: 1240, professionals: 980, total: 2220 },
    { month: "Q3", students: 1680, professionals: 1350, total: 3030 },
    { month: "Q4", students: 2100, professionals: 1720, total: 3820 },
  ],
  all: [
    { month: "Jan", students: 120, professionals: 90, total: 210 },
    { month: "Feb", students: 180, professionals: 140, total: 320 },
    { month: "Mar", students: 150, professionals: 220, total: 370 },
    { month: "Apr", students: 260, professionals: 180, total: 440 },
    { month: "May", students: 310, professionals: 250, total: 560 },
    { month: "Jun", students: 280, professionals: 300, total: 580 },
    { month: "Jul", students: 360, professionals: 270, total: 630 },
    { month: "Aug", students: 420, professionals: 340, total: 760 },
    { month: "Sep", students: 390, professionals: 380, total: 770 },
    { month: "Oct", students: 470, professionals: 350, total: 820 },
    { month: "Nov", students: 510, professionals: 430, total: 940 },
    { month: "Dec", students: 560, professionals: 480, total: 1040 },
  ],
};

export const QUIZ_ATTEMPT_DATASETS: Record<QuizAttemptPeriod, QuizAttemptPoint[]> = {
  this_week: [
    { day: "Mon", attempts: 42, completed: 38 },
    { day: "Tue", attempts: 68, completed: 61 },
    { day: "Wed", attempts: 55, completed: 50 },
    { day: "Thu", attempts: 88, completed: 82 },
    { day: "Fri", attempts: 72, completed: 65 },
    { day: "Sat", attempts: 48, completed: 42 },
    { day: "Sun", attempts: 35, completed: 30 },
  ],
  last_week: [
    { day: "Mon", attempts: 38, completed: 33 },
    { day: "Tue", attempts: 52, completed: 48 },
    { day: "Wed", attempts: 60, completed: 54 },
    { day: "Thu", attempts: 74, completed: 68 },
    { day: "Fri", attempts: 66, completed: 59 },
    { day: "Sat", attempts: 41, completed: 37 },
    { day: "Sun", attempts: 29, completed: 25 },
  ],
  this_month: [
    { day: "W1", attempts: 260, completed: 235 },
    { day: "W2", attempts: 310, completed: 280 },
    { day: "W3", attempts: 345, completed: 312 },
    { day: "W4", attempts: 390, completed: 360 },
  ],
  last_30d: [
    { day: "Day 1-5", attempts: 180, completed: 160 },
    { day: "Day 6-10", attempts: 220, completed: 198 },
    { day: "Day 11-15", attempts: 250, completed: 230 },
    { day: "Day 16-20", attempts: 290, completed: 265 },
    { day: "Day 21-25", attempts: 315, completed: 290 },
    { day: "Day 26-30", attempts: 360, completed: 330 },
  ],
};

export const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    text: "Amina Khan completed 'Advanced SEO Quiz' — scored 94% 🏆",
    time: "Today, 2:14 PM",
    date: "today",
    category: "quizzes",
  },
  {
    id: "act-2",
    text: "John Smith earned a Certificate in Digital Marketing",
    time: "Today, 1:02 PM",
    date: "today",
    category: "certificates",
  },
  {
    id: "act-3",
    text: "Sara Ali referred 3 new users and earned 150 coins",
    time: "Yesterday, 8:45 PM",
    date: "7d",
    category: "referrals",
  },
  {
    id: "act-4",
    text: "Usman Raza started 'Frontend Fundamentals' quiz",
    time: "2 days ago, 6:20 PM",
    date: "7d",
    category: "quizzes",
  },
  {
    id: "act-5",
    text: "Hira Malik left a 5-star review on UX Design Path",
    time: "3 days ago, 4:11 PM",
    date: "7d",
    category: "reviews",
  },
  {
    id: "act-6",
    text: "David Miller passed 'Full-Stack React Certification'",
    time: "10 days ago, 11:30 AM",
    date: "30d",
    category: "certificates",
  },
  {
    id: "act-7",
    text: "Fatima Noor claimed referral reward of 500 coins",
    time: "15 days ago, 3:25 PM",
    date: "30d",
    category: "referrals",
  },
  {
    id: "act-8",
    text: "Ali Hassan completed 'Python Data Science' Quiz",
    time: "18 days ago, 5:10 PM",
    date: "30d",
    category: "quizzes",
  },
];

export const TOP_SCORERS: TopScorerItem[] = [
  {
    name: "Shalina David",
    score: "98%",
    avatar: "https://i.pravatar.cc/80?img=5",
    quizzesTaken: 24,
    period: "this_week",
  },
  {
    name: "John Smith",
    score: "95%",
    avatar: "https://i.pravatar.cc/80?img=33",
    quizzesTaken: 19,
    period: "this_week",
  },
  {
    name: "Amina Khan",
    score: "94%",
    avatar: "https://i.pravatar.cc/80?img=47",
    quizzesTaken: 31,
    period: "this_month",
  },
  {
    name: "Usman Raza",
    score: "92%",
    avatar: "https://i.pravatar.cc/80?img=12",
    quizzesTaken: 18,
    period: "this_month",
  },
  {
    name: "Zainab Ahmed",
    score: "91%",
    avatar: "https://i.pravatar.cc/80?img=25",
    quizzesTaken: 15,
    period: "all",
  },
];

export function getFilteredStats(preset: DashboardDatePreset, range?: DateRange): DashboardStat[] {
  if (preset === "today") {
    return [
      {
        title: "Today Users",
        value: "342",
        trend: { value: "+14.2%", direction: "up", label: "vs yesterday" },
        iconName: "users",
        iconWrapClassName: "bg-[#dbeafe]",
        iconClassName: "text-[#2563eb]",
      },
      {
        title: "Today Quizzes",
        value: "1,248",
        trend: { value: "+9.1%", direction: "up", label: "vs yesterday" },
        iconName: "quizzes",
        iconWrapClassName: "bg-[#ffedd5]",
        iconClassName: "text-[#ea580c]",
      },
      {
        title: "Certificates Today",
        value: "385",
        trend: { value: "+5.4%", direction: "up", label: "vs yesterday" },
        iconName: "certificates",
        iconWrapClassName: "bg-[#dcfce7]",
        iconClassName: "text-[#16a34a]",
      },
      {
        title: "Today Payments",
        value: "$3,450",
        trend: { value: "+18.0%", direction: "up", label: "vs yesterday" },
        iconName: "payments",
        iconWrapClassName: "bg-[#e0f2fe]",
        iconClassName: "text-[#0284c7]",
      },
    ];
  }

  if (preset === "7d") {
    return [
      {
        title: "7 Days Users",
        value: "2,890",
        trend: { value: "+11.4%", direction: "up", label: "vs prev 7 days" },
        iconName: "users",
        iconWrapClassName: "bg-[#dbeafe]",
        iconClassName: "text-[#2563eb]",
      },
      {
        title: "7 Days Quizzes",
        value: "9,640",
        trend: { value: "+8.7%", direction: "up", label: "vs prev 7 days" },
        iconName: "quizzes",
        iconWrapClassName: "bg-[#ffedd5]",
        iconClassName: "text-[#ea580c]",
      },
      {
        title: "Certificates Issued",
        value: "2,980",
        trend: { value: "-2.1%", direction: "down", label: "vs prev 7 days" },
        iconName: "certificates",
        iconWrapClassName: "bg-[#dcfce7]",
        iconClassName: "text-[#16a34a]",
      },
      {
        title: "7 Days Payments",
        value: "$24,800",
        trend: { value: "+13.5%", direction: "up", label: "vs prev 7 days" },
        iconName: "payments",
        iconWrapClassName: "bg-[#e0f2fe]",
        iconClassName: "text-[#0284c7]",
      },
    ];
  }

  if (preset === "30d" || preset === "this_month") {
    return [
      {
        title: "Monthly Users",
        value: "12,450",
        trend: { value: "+16.8%", direction: "up", label: "vs last month" },
        iconName: "users",
        iconWrapClassName: "bg-[#dbeafe]",
        iconClassName: "text-[#2563eb]",
      },
      {
        title: "Monthly Quizzes",
        value: "42,800",
        trend: { value: "+14.2%", direction: "up", label: "vs last month" },
        iconName: "quizzes",
        iconWrapClassName: "bg-[#ffedd5]",
        iconClassName: "text-[#ea580c]",
      },
      {
        title: "Certificates Issued",
        value: "14.2K",
        trend: { value: "+7.8%", direction: "up", label: "vs last month" },
        iconName: "certificates",
        iconWrapClassName: "bg-[#dcfce7]",
        iconClassName: "text-[#16a34a]",
      },
      {
        title: "Monthly Payments",
        value: "$76,500",
        trend: { value: "+21.4%", direction: "up", label: "vs last month" },
        iconName: "payments",
        iconWrapClassName: "bg-[#e0f2fe]",
        iconClassName: "text-[#0284c7]",
      },
    ];
  }

  if (preset === "this_year") {
    return [
      {
        title: "Yearly Users",
        value: "40,689",
        trend: { value: "+28.5%", direction: "up", label: "vs last year" },
        iconName: "users",
        iconWrapClassName: "bg-[#dbeafe]",
        iconClassName: "text-[#2563eb]",
      },
      {
        title: "Yearly Quizzes",
        value: "145,697",
        trend: { value: "+34.1%", direction: "up", label: "vs last year" },
        iconName: "quizzes",
        iconWrapClassName: "bg-[#ffedd5]",
        iconClassName: "text-[#ea580c]",
      },
      {
        title: "Certificates Issued",
        value: "45K+",
        trend: { value: "+18.9%", direction: "up", label: "vs last year" },
        iconName: "certificates",
        iconWrapClassName: "bg-[#dcfce7]",
        iconClassName: "text-[#16a34a]",
      },
      {
        title: "Yearly Payments",
        value: "$110,000",
        trend: { value: "+31.2%", direction: "up", label: "vs last year" },
        iconName: "payments",
        iconWrapClassName: "bg-[#e0f2fe]",
        iconClassName: "text-[#0284c7]",
      },
    ];
  }

  if (range?.start && range?.end) {
    return [
      {
        title: "Selected Range Users",
        value: "18,920",
        trend: { value: "+9.4%", direction: "up", label: "for custom period" },
        iconName: "users",
        iconWrapClassName: "bg-[#dbeafe]",
        iconClassName: "text-[#2563eb]",
      },
      {
        title: "Range Quizzes",
        value: "67,400",
        trend: { value: "+11.2%", direction: "up", label: "for custom period" },
        iconName: "quizzes",
        iconWrapClassName: "bg-[#ffedd5]",
        iconClassName: "text-[#ea580c]",
      },
      {
        title: "Certificates Issued",
        value: "21.5K",
        trend: { value: "+6.7%", direction: "up", label: "for custom period" },
        iconName: "certificates",
        iconWrapClassName: "bg-[#dcfce7]",
        iconClassName: "text-[#16a34a]",
      },
      {
        title: "Range Payments",
        value: "$84,200",
        trend: { value: "+17.3%", direction: "up", label: "for custom period" },
        iconName: "payments",
        iconWrapClassName: "bg-[#e0f2fe]",
        iconClassName: "text-[#0284c7]",
      },
    ];
  }

  return INITIAL_STATS;
}

export function filterActivities(activities: ActivityItem[], filter: ActivityFilter): ActivityItem[] {
  if (filter === "all") return activities;
  if (filter === "today") return activities.filter((a) => a.date === "today");
  if (filter === "7d") return activities.filter((a) => a.date === "today" || a.date === "7d");
  if (filter === "30d") return activities;
  return activities.filter((a) => a.category === filter);
}

export function filterTopScorers(scorers: TopScorerItem[], period: TopScorerPeriod): TopScorerItem[] {
  if (period === "all") return scorers;
  if (period === "this_week") return scorers.filter((s) => s.period === "this_week");
  if (period === "this_month") return scorers.filter((s) => s.period === "this_week" || s.period === "this_month");
  return scorers;
}

export async function exportDashboardReport(config: ReportConfig): Promise<void> {
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `dashboard-report-${config.type}-${timestamp}`;

  const headers: string[] = ["Metric / Section", "Value / Details", "Category", "Period / Date"];
  const rows: string[][] = [];

  if (config.includeSummary) {
    INITIAL_STATS.forEach((stat) => {
      rows.push([stat.title, stat.value, "Summary Metric", `${stat.trend.value} (${stat.trend.label})`]);
    });
  }

  if (config.includeGrowth) {
    USER_GROWTH_DATASETS.all.forEach((point) => {
      rows.push([
        `User Growth - ${point.month}`,
        `Students: ${point.students}, Professionals: ${point.professionals}, Total: ${point.total}`,
        "User Growth",
        point.month,
      ]);
    });
  }

  if (config.includeQuizzes) {
    QUIZ_ATTEMPT_DATASETS.this_week.forEach((point) => {
      rows.push([
        `Quiz Attempts - ${point.day}`,
        `Attempts: ${point.attempts}, Completed: ${point.completed}`,
        "Quiz Performance",
        point.day,
      ]);
    });
  }

  if (config.includeTopScorers) {
    TOP_SCORERS.forEach((scorer) => {
      rows.push([
        scorer.name,
        `Score: ${scorer.score}, Quizzes Taken: ${scorer.quizzesTaken}`,
        "Top Performer",
        scorer.period.replace("_", " "),
      ]);
    });
  }

  if (config.includeActivities) {
    RECENT_ACTIVITIES.forEach((activity) => {
      rows.push([
        activity.text,
        activity.category,
        "User Activity",
        activity.time,
      ]);
    });
  }

  if (rows.length === 0) {
    throw new Error("Please select at least one section to include in the report.");
  }

  if (config.format === "csv") {
    downloadCsv(`${filename}.csv`, headers, rows);
  } else {
    downloadPdf(`${filename}.pdf`, config.title || "Technitest Admin Dashboard Report", headers, rows);
  }
}
