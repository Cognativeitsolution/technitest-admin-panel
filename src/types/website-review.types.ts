import type { PaginatedData } from "@/types/api.types";

export type WebsiteReviewRecord = {
  id: number;
  name: string;
  rating: number;
  message: string;
  image_url: string | null;
  video_url: string | null;
  is_featured: boolean;
  created_at: string;
};

export type WebsiteReviewPayload = {
  name: string;
  rating: number;
  message: string;
};

export type CreateWebsiteReviewInput = {
  payload: WebsiteReviewPayload;
  image?: File | null;
  video?: File | null;
};

export type UpdateWebsiteReviewInput = {
  reviewId: number;
  payload: WebsiteReviewPayload;
  image?: File | null;
  video?: File | null;
};

export type WebsiteReviewsListResult = PaginatedData<WebsiteReviewRecord>;

export type WebsiteReviewsQuery = {
  page?: number;
  per_page?: number;
};
