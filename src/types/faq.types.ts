import type { PaginatedData } from "@/types/api.types";

export const FAQ_CATEGORIES = [
  "basic",
  "quiz",
  "certificate",
  "transaction",
  "others",
] as const;

export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

export type FaqUserRef = {
  id: number;
  username: string;
  email?: string;
};

export type FaqRecord = {
  id: number;
  question: string;
  answer: string;
  faq_category: FaqCategory | string;
  display_order: number | null;
  is_active: boolean;
  created_by_id?: number | null;
  updated_by_id?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  creator?: FaqUserRef | null;
  updator?: FaqUserRef | null;
};

export type FaqPayload = {
  question: string;
  answer: string;
  faq_category: FaqCategory;
  display_order?: number | null;
};

export type FaqUpdatePayload = {
  question?: string;
  answer?: string;
  faq_category?: FaqCategory;
  display_order?: number | null;
};

export type FaqsListResult = PaginatedData<FaqRecord>;

export type FaqsQuery = {
  category?: string | null;
  page?: number;
  per_page?: number;
};

export type FaqStatusFilter = "All" | "Active" | "Inactive";
