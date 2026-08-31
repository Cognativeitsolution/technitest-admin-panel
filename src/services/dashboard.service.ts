import apiClient from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/api.types";

export interface VerifiedUsers {
  count: number;
  daily_change_percent: number;
}

export interface TotalQuizzes {
  count: number;
  daily_change_percent: number;
}

export interface TotalCertificates {
  count: number;
  daily_change_percent: number;
}

export interface TotalPayments {
  count: number;
  total_amount: number;
  daily_change_percent: number;
}

export interface UserGrowthItem {
  month: number;
  year: number;
  month_name: string;
  students: number;
  professionals: number;
}

export interface UserGrowth {
  data: UserGrowthItem[];
}

export interface QuizTrendItem {
  date: string;
  count: number;
}

export interface QuizTrend {
  data: QuizTrendItem[];
}

export interface TopScorerItem {
  certificate_id: number;
  user_id: number;
  username: string;
  email: string;
  avatar_url: string | null;
  quiz_name: string;
  score: number;
  percentage: number;
  stars: number | null;
  issued_at: string;
}

export interface RecentActivityItem {
  type: string;
  reference_id: number;
  user_id: number;
  username: string;
  avatar_url: string | null;
  description: string;
  subject: string;
  detail: string;
  created_at: string;
}

export interface DashboardStats {
  verified_users: VerifiedUsers;
  total_quizzes: TotalQuizzes;
  total_certificates: TotalCertificates;
  total_payments: TotalPayments;
  user_growth: UserGrowth;
  quiz_trend: QuizTrend;
  top_scorers: TopScorerItem[];
  recent_activity: RecentActivityItem[];
  applied_filter: string | null;
}

const BASE = "/api/v1/dashboard";

export const dashboardService = {
  getStats: async (dateFrom?: string | null, dateTo?: string | null) => {
    const params = new URLSearchParams();
    if (dateFrom) params.append("date_from", dateFrom);
    if (dateTo) params.append("date_to", dateTo);

    const queryString = params.toString();
    const url = queryString ? `${BASE}/stats?${queryString}` : `${BASE}/stats`;

    const { data } = await apiClient.get<ApiEnvelope<DashboardStats>>(url);
    return data.response.data;
  },
};
