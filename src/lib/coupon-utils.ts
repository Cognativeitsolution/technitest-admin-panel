import type { CouponRecord, CouponStatusLabel } from "@/types/coupon.types";

export const couponStatusOptions = ["Status", "Active", "Deleted", "Expired"];

export const couponDateOptions = [
  "Date",
  "Last 7 Days",
  "Last 30 Days",
  "This Year",
];

export const discountTypeOptions = [
  { label: "Percentage", value: "percentage" },
  { label: "Fixed", value: "fixed" },
] as const;

export const applicableToOptions = [
  { label: "All Quizzes", value: "all" },
  { label: "Specific Quizzes", value: "specific" },
] as const;

export function getCouponStatus(coupon: CouponRecord): CouponStatusLabel {
  if (!coupon.is_active) return "Deleted";
  if (coupon.is_expired) return "Expired";
  return "Active";
}

export function isCouponDeleted(coupon: CouponRecord) {
  return !coupon.is_active;
}

export function formatDiscountType(type: string) {
  if (type === "percentage") return "Percentage";
  if (type === "fixed" || type === "flat") return "Fixed";
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function formatDiscountValue(type: string, value: number) {
  if (type === "percentage") return `${value}%`;
  return `${value} Coins`;
}

export function formatUsageLimit(limit: number | null) {
  if (limit == null || limit <= 0) return "Unlimited";
  return String(limit);
}

function formatShortDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export function formatValidity(
  startDate: string | null,
  endDate: string | null,
) {
  const start = formatShortDate(startDate);
  const end = formatShortDate(endDate);
  if (!start && !end) return "No Expiry";
  if (start && end) return `${start} – ${end}`;
  return start ?? end ?? "No Expiry";
}

export function toDateInputValue(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function dateInputToIso(value: string, endOfDay = false) {
  if (!value) return "";
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return "";
  const date = new Date(
    Date.UTC(
      year,
      month - 1,
      day,
      endOfDay ? 23 : 0,
      endOfDay ? 59 : 0,
      endOfDay ? 59 : 0,
      endOfDay ? 999 : 0,
    ),
  );
  return date.toISOString();
}

export function extractQuizIds(
  quizzes: CouponRecord["quizzes"] | undefined,
): number[] {
  if (!quizzes?.length) return [];
  return quizzes
    .map((item) => (typeof item === "number" ? item : item.id))
    .filter((id) => Number.isFinite(id));
}

export function matchesDateFilter(
  coupon: CouponRecord,
  dateFilter: string,
) {
  if (dateFilter === "Date") return true;
  const raw = coupon.start_date ?? coupon.created_at;
  if (!raw) return false;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  if (dateFilter === "This Year") {
    return date.getFullYear() === now.getFullYear();
  }

  const days = dateFilter === "Last 7 Days" ? 7 : 30;
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);
  return date >= cutoff;
}
