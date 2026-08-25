export type BannerActor = {
  id: number;
  username: string;
  email: string;
};

export type BannerPage = {
  id: number;
  title: string;
  slug: string;
};

export type Banner = {
  id: number;
  title: string;
  page_id: number;
  page: BannerPage | null;
  image_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  created_by?: number | null;
  updated_by?: number | null;
  creator?: BannerActor | null;
  updater?: BannerActor | null;
};

export type BannerPayload = {
  title: string;
  page_id: number;
  status: string;
};

export type BannerListQuery = {
  status?: string;
  page_id?: number;
  page?: number;
  per_page?: number;
};

export const BANNER_STATUS_FILTERS = ["active", "inactive"] as const;
