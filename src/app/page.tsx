"use client";

import { useState } from "react";
import { Award, BookOpenCheck, Users, Wallet } from "lucide-react";

import { DashboardToolbar } from "@/components/dashboard/dashboard-toolbar";
import { GenerateReportModal } from "@/components/dashboard/generate-report-modal";
import { QuizAttemptChart } from "@/components/dashboard/quiz-attempt-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatCard } from "@/components/dashboard/stat-card";
import { TopScorers } from "@/components/dashboard/top-scorers";
import { UserGrowthChart } from "@/components/dashboard/user-growth-chart";
import { DateRange } from "@/components/ui/date-range-picker";
import { getFilteredStats } from "@/lib/dashboard-data";

const ICONS = {
  users: Users,
  quizzes: BookOpenCheck,
  certificates: Award,
  payments: Wallet,
};

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [reportModalOpen, setReportModalOpen] = useState(false);

  function handleResetFilters() {
    setDateRange({ start: null, end: null });
  }

  const currentStats = getFilteredStats("all", dateRange);

  return (
    <div>
      <DashboardToolbar
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onOpenReportModal={() => setReportModalOpen(true)}
        onResetFilters={handleResetFilters}
      />

      {/* KPI Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {currentStats.map((stat) => {
          const Icon = ICONS[stat.iconName] || Users;
          return (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              trend={stat.trend}
              icon={Icon}
              iconWrapClassName={stat.iconWrapClassName}
              iconClassName={stat.iconClassName}
            />
          );
        })}
      </div>

      {/* Growth & Quiz Trends Charts */}
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <UserGrowthChart />
        </div>
        <QuizAttemptChart />
      </div>

      {/* Top Scorers & Recent Activity */}
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <TopScorers />
        <div className="xl:col-span-2">
          <RecentActivity />
        </div>
      </div>

      {/* Generate Report Dialog */}
      <GenerateReportModal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
}
