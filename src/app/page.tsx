"use client";

import { useState } from "react";
import { Award, BookOpenCheck, Users, Wallet, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { DashboardToolbar } from "@/components/dashboard/dashboard-toolbar";
import { QuizAttemptChart } from "@/components/dashboard/quiz-attempt-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatCard } from "@/components/dashboard/stat-card";
import { TopScorers } from "@/components/dashboard/top-scorers";
import { UserGrowthChart } from "@/components/dashboard/user-growth-chart";
import { useDashboardStats } from "@/hooks/dashboard/use-dashboard-stats";
import { dashboardService } from "@/services/dashboard.service";

export default function DashboardPage() {
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);
  const { stats, loading } = useDashboardStats({ dateFrom, dateTo });

  const handleGenerateReport = async () => {
    try {
      const result = await dashboardService.generateReport(dateFrom, dateTo);
      if (!result) {
        toast.error("No report available for the selected range.");
      }
    } catch (error) {
      toast.error("Failed to generate dashboard report.");
    }
  };

  if (!stats) {
    return (
      <div>
        <DashboardToolbar onDateChange={(from, to) => {
          setDateFrom(from);
          setDateTo(to);
        }} />

        <div className="flex items-center justify-center rounded-xl border border-[#e5e7eb] bg-white p-12">
          <Loader2 className="size-8 animate-spin text-[#2563eb]" />
          <span className="ml-3 text-lg text-[#6b7280]">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const statCardsData = [
    {
      title: "Verified Users",
      value: stats.verified_users.count.toString(),
      trend: {
        value: Math.abs(stats.verified_users.daily_change_percent).toFixed(1) + "%",
        direction: (
          stats.verified_users.daily_change_percent >= 0 ? "up" : "down"
        ) as "up" | "down",
        label: "from yesterday",
      },
      icon: Users,
      iconWrapClassName: "bg-[#dbeafe]",
      iconClassName: "text-[#2563eb]",
    },
    {
      title: "Total Quizzes",
      value: stats.total_quizzes.count.toString(),
      trend: {
        value: Math.abs(stats.total_quizzes.daily_change_percent).toFixed(1) + "%",
        direction: (
          stats.total_quizzes.daily_change_percent >= 0 ? "up" : "down"
        ) as "up" | "down",
        label: "from yesterday",
      },
      icon: BookOpenCheck,
      iconWrapClassName: "bg-[#ffedd5]",
      iconClassName: "text-[#ea580c]",
    },
    {
      title: "Certificates Issued",
      value: stats.total_certificates.count.toString(),
      trend: {
        value: Math.abs(stats.total_certificates.daily_change_percent).toFixed(1) + "%",
        direction: (
          stats.total_certificates.daily_change_percent >= 0 ? "up" : "down"
        ) as "up" | "down",
        label: "from yesterday",
      },
      icon: Award,
      iconWrapClassName: "bg-[#dcfce7]",
      iconClassName: "text-[#16a34a]",
    },
    {
      title: "Payments Received",
      value: `$${stats.total_payments.total_amount.toLocaleString()}`,
      trend: {
        value: Math.abs(stats.total_payments.daily_change_percent).toFixed(1) + "%",
        direction: (
          stats.total_payments.daily_change_percent >= 0 ? "up" : "down"
        ) as "up" | "down",
        label: "from yesterday",
      },
      icon: Wallet,
      iconWrapClassName: "bg-[#e0f2fe]",
      iconClassName: "text-[#0284c7]",
    },
  ];

  return (
    <div>
      <DashboardToolbar
        onDateChange={(from, to) => {
          setDateFrom(from);
          setDateTo(to);
        }}
        onGenerateReport={handleGenerateReport}
      />

      {loading && (
        <div className="mb-4 flex items-center justify-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-[#6b7280]">
          <Loader2 className="size-4 animate-spin text-[#2563eb]" />
          Refreshing dashboard...
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCardsData.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <UserGrowthChart data={stats.user_growth.data} />
        </div>
        <QuizAttemptChart data={stats.quiz_trend.data} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <TopScorers scorers={stats.top_scorers ?? []} />
        <div className="xl:col-span-2">
          <RecentActivity activities={stats.recent_activity ?? []} />
        </div>
      </div>
    </div>
  );
}
