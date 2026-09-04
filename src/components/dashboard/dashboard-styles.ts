export const dashboardCardClass =
  "rounded-2xl border border-[#eef1f6] bg-white p-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)] sm:p-5";

export const dashboardEmptyStateClass =
  "flex items-center justify-center rounded-xl border border-dashed border-[#e5e7eb] bg-[#fafbfc] text-sm font-medium text-[#6b7280]";

export const dashboardScrollListClass =
  "flex h-[340px] flex-col gap-2.5 overflow-y-auto pr-1 sm:h-[420px]";

export const dashboardScrollListHeightClass = "h-[340px] sm:h-[420px]";

export const dashboardChartShellClass =
  "rounded-xl border border-[#eef1f6] bg-linear-to-b from-[#fafbfc] to-white p-3";

export const RANK_THEMES = [
  {
    card: "border-[#fde68a] bg-white",
    icon: "bg-[#fef3c7] text-[#d97706]",
    bar: "bg-[#f59e0b]",
    pill: "border border-[#fde68a] bg-white text-[#b45309]",
    accent: "text-[#b45309]",
  },
  {
    card: "border-[#cbd5e1] bg-white",
    icon: "bg-[#e2e8f0] text-[#475569]",
    bar: "bg-[#64748b]",
    pill: "border border-[#cbd5e1] bg-white text-[#475569]",
    accent: "text-[#475569]",
  },
  {
    card: "border-[#fed7aa] bg-white",
    icon: "bg-[#ffedd5] text-[#c2410c]",
    bar: "bg-[#ea580c]",
    pill: "border border-[#fed7aa] bg-white text-[#c2410c]",
    accent: "text-[#c2410c]",
  },
  {
    card: "border-[#bfdbfe] bg-white",
    icon: "bg-[#dbeafe] text-[#1d4ed8]",
    bar: "bg-[#3b82f6]",
    pill: "border border-[#bfdbfe] bg-white text-[#1d4ed8]",
    accent: "text-[#1d4ed8]",
  },
] as const;

export const RANK_COLORS = ["#f59e0b", "#475569", "#ea580c", "#2563eb"] as const;

export const ACTIVITY_THEMES = {
  quizzes: {
    card: "border-[#fed7aa] bg-white",
    icon: "bg-[#ffedd5] text-[#c2410c]",
  },
  certificates: {
    card: "border-[#bbf7d0] bg-white",
    icon: "bg-[#dcfce7] text-[#16a34a]",
  },
  referrals: {
    card: "border-[#bfdbfe] bg-white",
    icon: "bg-[#dbeafe] text-[#2563eb]",
  },
  reviews: {
    card: "border-[#ddd6fe] bg-white",
    icon: "bg-[#ede9fe] text-[#7c3aed]",
  },
  other: {
    card: "border-[#e5e7eb] bg-white",
    icon: "bg-[#f3f4f6] text-[#6b7280]",
  },
} as const;

export function getRankTheme(index: number) {
  return RANK_THEMES[Math.min(index, RANK_THEMES.length - 1)];
}
