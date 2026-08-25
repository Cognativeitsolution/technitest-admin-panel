export type MediaItem = {
  id: number;
  name: string;
  alt: string;
  url: string;
  folder: string;
  status: string;
  created_at: string;
  updated_at: string;
  created_by?: number | null;
};

export type MediaListQuery = {
  page?: number;
  per_page?: number;
};

export type UploadMediaInput = {
  file: File;
  name?: string;
  alt?: string;
};

export type UpdateMediaPayload = {
  name?: string | null;
  alt?: string | null;
};
