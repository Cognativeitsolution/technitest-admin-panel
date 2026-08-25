import apiClient from "@/lib/api-client";
import type { ApiEnvelope, PaginatedData } from "@/types/api.types";
import type {
  Banner,
  BannerListQuery,
  BannerPayload,
} from "@/types/banner.types";

const BASE_PATH = "/api/v1/banners";

function buildBannerFormData(payload?: BannerPayload | null, image?: File | null) {
  const formData = new FormData();
  if (payload) {
    formData.append("data", JSON.stringify(payload));
  }
  if (image) {
    formData.append("image", image);
  }
  return formData;
}

export const bannerService = {
  getPublicForPage: async (pageId: number) => {
    const { data } = await apiClient.get<ApiEnvelope<Banner[]>>(
      `${BASE_PATH}/public/for-page/${pageId}`,
      { skipAuth: true },
    );
    return data.response.data;
  },

  listBanners: async (params?: BannerListQuery) => {
    const { data } = await apiClient.get<ApiEnvelope<PaginatedData<Banner>>>(
      BASE_PATH,
      { params },
    );
    return data.response.data;
  },

  createBanner: async (payload: BannerPayload, image?: File | null) => {
    const { data } = await apiClient.post<ApiEnvelope<Banner>>(
      BASE_PATH,
      buildBannerFormData(payload, image),
    );
    return data.response.data;
  },

  getBanner: async (bannerId: number) => {
    const { data } = await apiClient.get<ApiEnvelope<Banner>>(
      `${BASE_PATH}/${bannerId}`,
    );
    return data.response.data;
  },

  updateBanner: async (
    bannerId: number,
    payload?: BannerPayload | null,
    image?: File | null,
  ) => {
    const { data } = await apiClient.put<ApiEnvelope<Banner>>(
      `${BASE_PATH}/${bannerId}`,
      buildBannerFormData(payload, image),
    );
    return data.response.data;
  },

  deleteBanner: async (bannerId: number) => {
    await apiClient.delete(`${BASE_PATH}/${bannerId}`);
  },

  restoreBanner: async (bannerId: number) => {
    const { data } = await apiClient.post<ApiEnvelope<Banner>>(
      `${BASE_PATH}/${bannerId}/restore`,
    );
    return data.response.data;
  },
};
