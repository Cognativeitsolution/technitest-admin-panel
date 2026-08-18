import { Award, BookOpenCheck, Users, Wallet } from "lucide-react";

import { DashboardToolbar } from "@/components/dashboard/dashboard-toolbar";
import { QuizAttemptChart } from "@/components/dashboard/quiz-attempt-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatCard } from "@/components/dashboard/stat-card";
import { TopScorers } from "@/components/dashboard/top-scorers";
import { UserGrowthChart } from "@/components/dashboard/user-growth-chart";

const stats = [
  {
    title: "Total User",
    value: "40,689",
    trend: { value: "8.5%", direction: "up" as const, label: "from yesterday" },
    icon: Users,
    iconWrapClassName: "bg-[#dbeafe]",
    iconClassName: "text-[#2563eb]",
  },
  {
    title: "Total Quizzes",
    value: "145,697",
    trend: { value: "8.5%", direction: "up" as const, label: "from yesterday" },
    icon: BookOpenCheck,
    iconWrapClassName: "bg-[#ffedd5]",
    iconClassName: "text-[#ea580c]",
  },
  {
    title: "Certificates Issued",
    value: "45K+",
    trend: {
      value: "8.5%",
      direction: "down" as const,
      label: "from yesterday",
    },
    icon: Award,
    iconWrapClassName: "bg-[#dcfce7]",
    iconClassName: "text-[#16a34a]",
  },
  {
    title: "Payments Received",
    value: "$110,000",
    trend: { value: "8.5%", direction: "up" as const, label: "from yesterday" },
    icon: Wallet,
    iconWrapClassName: "bg-[#e0f2fe]",
    iconClassName: "text-[#0284c7]",
  },
];

export default function DashboardPage() {
  return (
    <div>
      <DashboardToolbar />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <UserGrowthChart />
        </div>
        <QuizAttemptChart />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <TopScorers />
        <div className="xl:col-span-2">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
