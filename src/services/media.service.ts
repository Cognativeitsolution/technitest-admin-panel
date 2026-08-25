import apiClient from "@/lib/api-client";
import type { ApiEnvelope, PaginatedData } from "@/types/api.types";
import type {
  MediaItem,
  MediaListQuery,
  UpdateMediaPayload,
  UploadMediaInput,
} from "@/types/media.types";

const BASE_PATH = "/api/v1/media";

export const mediaService = {
  listMedia: async (params?: MediaListQuery) => {
    const { data } = await apiClient.get<ApiEnvelope<PaginatedData<MediaItem>>>(
      BASE_PATH,
      { params },
    );
    return data.response.data;
  },

  uploadMedia: async ({ file, name, alt }: UploadMediaInput) => {
    const formData = new FormData();
    formData.append("file", file);
    if (name) formData.append("name", name);
    if (alt) formData.append("alt", alt);
    const { data } = await apiClient.post<ApiEnvelope<MediaItem>>(
      BASE_PATH,
      formData,
    );
    return data.response.data;
  },

  getMedia: async (mediaId: number) => {
    const { data } = await apiClient.get<ApiEnvelope<MediaItem>>(
      `${BASE_PATH}/${mediaId}`,
    );
    return data.response.data;
  },

  updateMedia: async (mediaId: number, payload: UpdateMediaPayload) => {
    const body = new URLSearchParams();
    if (payload.name != null) body.append("name", payload.name);
    if (payload.alt != null) body.append("alt", payload.alt);
    const { data } = await apiClient.put<ApiEnvelope<MediaItem>>(
      `${BASE_PATH}/${mediaId}`,
      body,
    );
    return data.response.data;
  },

  deleteMedia: async (mediaId: number) => {
    await apiClient.delete(`${BASE_PATH}/${mediaId}`);
  },
};
