import apiClient from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/api.types";
import type {
  ProfileDetail,
  ProfileInfo,
  ProfileUpdateData,
  UpdateProfilePayload,
} from "@/types/profile.types";

const BASE = "/api/v1/profile";

/**
 * Normalize profile update payload to ensure proper structure
 * Handles both direct data and wrapped UpdateProfilePayload formats
 */
function normalizeProfilePayload(
  payload: UpdateProfilePayload | ProfileUpdateData,
): UpdateProfilePayload {
  if ("data" in payload && payload.data) {
    return payload as UpdateProfilePayload;
  }
  // If payload is direct data without wrapper, wrap it
  return { data: payload as ProfileUpdateData };
}

function buildProfileFormData(
  payload: UpdateProfilePayload | ProfileUpdateData,
  image?: File | null,
) {
  const normalizedPayload = normalizeProfilePayload(payload);
  const formData = new FormData();
  formData.append("data", JSON.stringify(normalizedPayload.data));
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

  updateProfile: async (
    payload: UpdateProfilePayload | ProfileUpdateData,
    image?: File | null,
  ) => {
    const { data } = await apiClient.patch<ApiEnvelope<ProfileDetail>>(
      BASE,
      buildProfileFormData(payload, image),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data.response.data;
  },
};