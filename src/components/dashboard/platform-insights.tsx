"use client";

import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Award,
  BookOpenCheck,
  FolderKanban,
  Globe2,
  LineChart,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";

import type { DashboardStats } from "@/services/dashboard.service";
import { cn } from "@/lib/utils";

type PlatformInsightsProps = {
  stats: DashboardStats;
  className?: string;
};

type InsightItem = {
  id: string;
  text: string;
  icon: LucideIcon;
};

function formatChange(percent: number) {
  const abs = Math.abs(percent).toFixed(1);
  return percent >= 0 ? `up ${abs}%` : `down ${abs}%`;
}

function buildInsights(stats: DashboardStats): InsightItem[] {
  const insights: InsightItem[] = [];

  const topCategory = [...(stats.top_categories ?? [])].sort(
    (a, b) => (b.attempt_count || 0) - (a.attempt_count || 0),
  )[0];
  if (topCategory) {
    insights.push({
      id: "top-category",
      icon: FolderKanban,
      text: `${topCategory.title} leads attempts with ${topCategory.attempt_count.toLocaleString()} tries across ${topCategory.quiz_count} quiz${topCategory.quiz_count === 1 ? "" : "zes"}.`,
    });
  }

  const quizTrend = stats.quiz_trend?.data ?? [];
  const peakDay = [...quizTrend].sort((a, b) => (b.count || 0) - (a.count || 0))[0];
  const weekTotal = quizTrend.reduce((sum, item) => sum + (item.count || 0), 0);
  if (peakDay && peakDay.count > 0) {
    const label = new Date(peakDay.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    insights.push({
      id: "peak-quiz-day",
      icon: BookOpenCheck,
      text: `Peak quiz activity on ${label} (${peakDay.count} attempts). ${weekTotal.toLocaleString()} attempts in the recent window.`,
    });
  }

  const countryTotals = new Map<string, number>();
  for (const item of stats.quiz_trend_by_country?.data ?? []) {
    const key = item.country?.trim() || "Unknown";
    countryTotals.set(key, (countryTotals.get(key) ?? 0) + (item.count || 0));
  }
  const topCountry = [...countryTotals.entries()].sort((a, b) => b[1] - a[1])[0];
  if (topCountry) {
    insights.push({
      id: "top-country",
      icon: Globe2,
      text: `${topCountry[0]} accounts for the most quiz attempts (${topCountry[1].toLocaleString()}).`,
    });
  }

  const users = stats.verified_users?.count ?? 0;
  const certificates = stats.total_certificates?.count ?? 0;
  if (users > 0) {
    const rate = Math.round((certificates / users) * 100);
    insights.push({
      id: "certificates",
      icon: Award,
      text: `${certificates.toLocaleString()} certificates issued for ${users.toLocaleString()} verified users (${rate}% certification rate). Users are ${formatChange(stats.verified_users.daily_change_percent)} vs yesterday.`,
    });
  }

  const payments = stats.total_payments;
  if (payments) {
    insights.push({
      id: "payments",
      icon: Wallet,
      text: `Payments total $${Number(payments.total_amount || 0).toLocaleString()} across ${payments.count.toLocaleString()} transaction${payments.count === 1 ? "" : "s"} (${formatChange(payments.daily_change_percent)} vs yesterday).`,
    });
  }

  const topScorer = stats.top_scorers?.[0];
  if (topScorer && insights.length < 5) {
    insights.push({
      id: "top-scorer",
      icon: Trophy,
      text: `${topScorer.username} tops the board on "${topScorer.quiz_name}" at ${topScorer.percentage}%.`,
    });
  }

  const growth = stats.user_growth?.data ?? [];
  const latestGrowth = growth[growth.length - 1];
  if (latestGrowth && insights.length < 5) {
    const students = latestGrowth.students || 0;
    const professionals = latestGrowth.professionals || 0;
    insights.push({
      id: "growth",
      icon: Users,
      text: `${latestGrowth.month_name} growth: ${students} student${students === 1 ? "" : "s"} and ${professionals} professional${professionals === 1 ? "" : "s"} added.`,
    });
  }

  return insights.slice(0, 5);
}

export function PlatformInsights({ stats, className }: PlatformInsightsProps) {
  const insights = useMemo(() => buildInsights(stats), [stats]);

  return (
    <section
      className={cn(
        "flex h-full min-w-0 flex-col rounded-[10px] border border-[#e5eaf2] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]",
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-[#dbeafe] text-[#2563eb]">
          <LineChart className="size-4" />
        </span>
        <h2 className="text-[18px] font-bold text-[#1e3a5f]">Platform Insights</h2>
      </div>

      {insights.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-[#e5e7eb] bg-[#fafbfc] py-10 text-sm font-medium text-[#64748b]">
          No insights available yet
        </div>
      ) : (
        <ul className="divide-y divide-[#e8eef5]">
          {insights.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e8f1ff] text-[#1e40af]">
                  <Icon className="size-4" />
                </span>
                <p className="text-[14px] leading-snug font-medium text-[#1e3a5f]">
                  {item.text}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
