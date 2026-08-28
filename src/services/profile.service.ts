import apiClient from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/api.types";
import type {
  ProfileDetail,
  ProfileInfo,
  UpdateProfilePayload,
} from "@/types/profile.types";

const BASE = "/api/v1/profile";

function buildProfileFormData(
  payload: UpdateProfilePayload,
  image?: File | null,
) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  if (image) {
    formData.append("image", image);
  }
  return formData;
}

export const profileService = {
  getInfo: async () => {
    const { data } = await apiClient.get<ApiEnvelope<ProfileInfo>>(
      `${BASE}/info`,
    );
    return data.response.data;
  },

  getDetail: async () => {
    const { data } = await apiClient.get<ApiEnvelope<ProfileDetail>>(
      `${BASE}/detail`,
    );
    return data.response.data;
  },

  updateProfile: async (payload: UpdateProfilePayload, image?: File | null) => {
    const { data } = await apiClient.patch<ApiEnvelope<ProfileDetail>>(
      BASE,
      buildProfileFormData(payload, image),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data.response.data;
  },
};