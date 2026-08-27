import type { PaginatedData } from "@/types/api.types";

export type TransactionProvider = "stripe" | string;

export type TransactionStatus = "completed" | "pending" | "failed" | "refunded";

export type TransactionRecord = {
  id: number;
  user_id: number;
  quiz_attempt_id: number | null;
  certificate_id: number | null;
  coupon_id: number | null;
  provider: TransactionProvider;
  status: TransactionStatus;
  amount: number;
  discount_amount: number | null;
  coins_spent: number | null;
  coins_discount_amount: number | null;
  currency: string;
  provider_reference: string | null;
  failure_reason: string | null;
  completed_at: string | null;
  created_at: string;
};

export type TransactionStatusResponse = {
  id: number;
  status: TransactionStatus;
};

export type TransactionReceipt = {
  transaction_id: number;
  user_id: number;
  user_email: string;
  quiz_attempt_id: number | null;
  certificate_number: string | null;
  amount: number;
  currency: string;
  provider: TransactionProvider;
  provider_reference: string | null;
  receipt_url: string | null;
  completed_at: string | null;
};

export type TransactionsListResult = PaginatedData<TransactionRecord>;

export type TransactionsQuery = {
  page?: number;
  per_page?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
};

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  completed: "Completed",
  pending: "Pending",
  failed: "Failed",
  refunded: "Refunded",
};

export const TRANSACTION_STATUS_OPTIONS: TransactionStatus[] = [
  "completed",
  "pending",
  "failed",
  "refunded",
];
