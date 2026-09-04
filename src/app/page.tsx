"use client";

import { useState } from "react";
import { Award, BookOpenCheck, Users, Wallet, Loader2 } from "lucide-react";

import { DashboardToolbar } from "@/components/dashboard/dashboard-toolbar";
import { GenerateReportModal } from "@/components/dashboard/generate-report-modal";
import { QuizAttemptChart } from "@/components/dashboard/quiz-attempt-chart";
import { QuizTrendByCountryChart } from "@/components/dashboard/quiz-trend-by-country-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatCard } from "@/components/dashboard/stat-card";
import { TopCategories } from "@/components/dashboard/top-categories";
import { TopScorers } from "@/components/dashboard/top-scorers";
import { UserGrowthChart } from "@/components/dashboard/user-growth-chart";
import { DateRange } from "@/components/ui/date-range-picker";
import { useDashboardStats } from "@/hooks/dashboard/use-dashboard-stats";

function formatLocalIsoDate(date: Date | null): string | null {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const hasCompleteRange = Boolean(dateRange.start && dateRange.end);
  const dateFrom = hasCompleteRange ? formatLocalIsoDate(dateRange.start) : null;
  const dateTo = hasCompleteRange ? formatLocalIsoDate(dateRange.end) : null;

  const { stats, loading } = useDashboardStats({ dateFrom, dateTo });

  function handleResetFilters() {
    setDateRange({ start: null, end: null });
  }

  if (!stats) {
    return (
      <div className="space-y-5">
        <DashboardToolbar
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onOpenReportModal={() => setReportModalOpen(true)}
          onResetFilters={handleResetFilters}
        />

        <div className="flex items-center justify-center rounded-2xl border border-[#eef1f6] bg-white p-12 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
          <Loader2 className="size-8 animate-spin text-[#2563eb]" />
          <span className="ml-3 text-lg text-[#6b7280]">Loading dashboard...</span>
        </div>

        <GenerateReportModal
          open={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          dateFrom={dateFrom}
          dateTo={dateTo}
        />
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
      cardClassName: "border-[#bfdbfe] bg-white",
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
      cardClassName: "border-[#fed7aa] bg-white",
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
      cardClassName: "border-[#bbf7d0] bg-white",
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
      cardClassName: "border-[#bae6fd] bg-white",
    },
  ];

  return (
    <div className="space-y-5">
      <DashboardToolbar
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onOpenReportModal={() => setReportModalOpen(true)}
        onResetFilters={handleResetFilters}
      />

      {loading && (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-[#bfdbfe] bg-linear-to-r from-[#eff6ff] to-[#f0f9ff] px-4 py-3 text-sm font-medium text-[#2563eb]">
          <Loader2 className="size-4 animate-spin" />
          Refreshing dashboard...
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCardsData.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3 xl:items-stretch">
        <div className="xl:col-span-2">
          <UserGrowthChart data={stats.user_growth.data} />
        </div>
        <QuizAttemptChart data={stats.quiz_trend.data} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3 xl:items-stretch">
        <div className="flex xl:col-span-2">
          <QuizTrendByCountryChart
            className="w-full"
            data={stats.quiz_trend_by_country?.data ?? []}
          />
        </div>
        <TopCategories className="w-full" categories={stats.top_categories ?? []} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3 xl:items-stretch">
        <div className="flex">
          <TopScorers className="w-full" scorers={stats.top_scorers ?? []} />
        </div>
        <div className="flex xl:col-span-2">
          <RecentActivity className="w-full" activities={stats.recent_activity ?? []} />
        </div>
      </div>

      <GenerateReportModal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        dateFrom={dateFrom}
        dateTo={dateTo}
      />
    </div>
  );
}
