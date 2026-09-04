export type CategoryUserRef = {
  id: number;
  username: string;
  email?: string;
};

export type CategoryItem = {
  id: number;
  title: string;
  detail: string;
  image_url: string | null;
  quiz_count: number;
  is_active?: boolean;
  created_by_id?: number | null;
  updated_by_id?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  creator?: CategoryUserRef | null;
  updator?: CategoryUserRef | null;
};

export type CategoryPayload = {
  title: string;
  detail: string;
};

export type CategoryListQuery = {
  page?: number;
  per_page?: number;
};

export type CategoryStatusFilter = "All" | "Active" | "Inactive";
