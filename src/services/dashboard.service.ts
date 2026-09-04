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

export interface QuizTrendByCountryItem {
  date: string;
  country: string;
  count: number;
}

export interface QuizTrendByCountry {
  data: QuizTrendByCountryItem[];
}

export interface TopCategoryItem {
  category_id: number;
  title: string;
  image_url: string | null;
  attempt_count: number;
  quiz_count: number;
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
  quiz_trend_by_country: QuizTrendByCountry;
  top_categories: TopCategoryItem[];
  top_scorers: TopScorerItem[];
  recent_activity: RecentActivityItem[];
  applied_filter: string | null;
}

const BASE = "/api/v1/dashboard";

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function parseFilenameFromHeader(contentDisposition?: string | null) {
  if (!contentDisposition) return "dashboard-report";

  const match = contentDisposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  if (match?.[1]) {
    return decodeURIComponent(match[1].replace(/['"]/g, ""));
  }

  return "dashboard-report";
}

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

  generateReport: async (dateFrom?: string | null, dateTo?: string | null) => {
    const params = new URLSearchParams();
    if (dateFrom) params.append("date_from", dateFrom);
    if (dateTo) params.append("date_to", dateTo);

    const queryString = params.toString();
    const url = queryString ? `${BASE}/report?${queryString}` : `${BASE}/report`;

    const response = await apiClient.get(url, { responseType: "blob" });

    const payload = response.data as Blob | { download_url?: string; url?: string } | null;

    if (payload && typeof payload === "object" && !(payload instanceof Blob)) {
      const urlFromPayload = payload.download_url ?? payload.url;
      if (typeof urlFromPayload === "string" && urlFromPayload) {
        if (typeof window !== "undefined") {
          window.open(urlFromPayload, "_blank", "noopener,noreferrer");
        }
        return urlFromPayload;
      }
    }

    if (payload instanceof Blob) {
      const filename = parseFilenameFromHeader(response.headers["content-disposition"]);
      triggerDownload(payload, filename);
      return filename;
    }

    if (typeof payload === "string" && payload) {
      if (typeof window !== "undefined") {
        window.open(payload, "_blank", "noopener,noreferrer");
      }
      return payload;
    }

    return null;
  },
};
