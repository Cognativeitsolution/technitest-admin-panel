import apiClient from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/api.types";
import type {
  CreateWebsiteReviewInput,
  UpdateWebsiteReviewInput,
  WebsiteReviewPayload,
  WebsiteReviewsListResult,
  WebsiteReviewsQuery,
} from "@/types/website-review.types";

function buildReviewFormData(
  payload: WebsiteReviewPayload,
  image?: File | null,
  video?: File | null,
) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  if (image) {
    formData.append("image", image);
  }
  if (video) {
    formData.append("video", video);
  }
  return formData;
}

export const websiteReviewService = {
  getAdminList: async (params?: WebsiteReviewsQuery) => {
    const { data } = await apiClient.get<ApiEnvelope<WebsiteReviewsListResult>>(
      "/api/v1/website-reviews/admin-list",
      { params },
    );
    return data.response.data;
  },

  create: async ({ payload, image, video }: CreateWebsiteReviewInput) => {
    const { data } = await apiClient.post<ApiEnvelope<unknown>>(
      "/api/v1/website-reviews",
      buildReviewFormData(payload, image, video),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data;
  },

  update: async ({ reviewId, payload, image, video }: UpdateWebsiteReviewInput) => {
    const { data } = await apiClient.put<ApiEnvelope<unknown>>(
      `/api/v1/website-reviews/${reviewId}`,
      buildReviewFormData(payload, image, video),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data;
  },

  toggleFeatured: async (reviewId: number, isFeatured: boolean) => {
    const { data } = await apiClient.patch<ApiEnvelope<unknown>>(
      `/api/v1/website-reviews/${reviewId}/feature`,
      { is_featured: isFeatured },
    );
    return data;
  },
};
