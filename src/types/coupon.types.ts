import type { PaginatedData } from "@/types/api.types";

export type CouponDiscountType = "percentage" | "fixed";
export type CouponApplicableTo = "all" | "specific";

export type CouponQuizRef = {
  id: number;
  title?: string;
  name?: string;
};

export type CouponRecord = {
  id: number;
  code: string;
  discount_type: string;
  discount_value: number;
  usage_limit: number | null;
  used_count: number;
  applicable_to: string;
  quizzes: CouponQuizRef[] | number[];
  min_purchase_amount: number | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  is_expired: boolean;
  is_usage_exhausted: boolean;
  is_valid: boolean;
  created_at?: string;
  updated_at?: string;
};

export type CouponDetail = CouponRecord & {
  created_by_id?: number;
  updated_by_id?: number;
  creator?: {
    id: number;
    username: string;
    email: string;
  };
  updater?: {
    id: number;
    username: string;
    email?: string;
  };
};

export type CouponPayload = {
  code: string;
  discount_type: string;
  discount_value: number;
  usage_limit: number;
  applicable_to: string;
  quiz_ids: number[];
  min_purchase_amount: number;
  start_date: string;
  end_date: string;
};

export type UpdateCouponPayload = CouponPayload & {
  is_active: boolean;
};

export type CouponsListResult = PaginatedData<CouponRecord>;

export type CouponsQuery = {
  page?: number;
  per_page?: number;
};

export type CouponStatusLabel = "Active" | "Deleted" | "Expired";
