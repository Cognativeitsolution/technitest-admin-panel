import apiClient from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/api.types";
import type {
  CouponDetail,
  CouponPayload,
  CouponsListResult,
  CouponsQuery,
  UpdateCouponPayload,
} from "@/types/coupon.types";

export const couponService = {
  getAdminList: async (params?: CouponsQuery) => {
    const { data } = await apiClient.get<ApiEnvelope<CouponsListResult>>(
      "/api/v1/coupons/admin-list",
      { params },
    );
    return data.response.data;
  },

  getById: async (couponId: number) => {
    const { data } = await apiClient.get<ApiEnvelope<CouponDetail>>(
      `/api/v1/coupons/${couponId}`,
    );
    return data.response.data;
  },

  create: async (payload: CouponPayload) => {
    const { data } = await apiClient.post<ApiEnvelope<CouponDetail>>(
      "/api/v1/coupons",
      payload,
    );
    return data.response.data;
  },

  update: async (couponId: number, payload: UpdateCouponPayload) => {
    const { data } = await apiClient.put<ApiEnvelope<CouponDetail>>(
      `/api/v1/coupons/${couponId}`,
      payload,
    );
    return data.response.data;
  },

  remove: async (couponId: number) => {
    const { data } = await apiClient.delete<ApiEnvelope<unknown>>(
      `/api/v1/coupons/${couponId}`,
    );
    return data;
  },

  restore: async (couponId: number) => {
    const { data } = await apiClient.post<ApiEnvelope<CouponDetail>>(
      `/api/v1/coupons/${couponId}/restore`,
    );
    return data.response.data;
  },
};
