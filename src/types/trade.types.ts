export type TradeUserRef = {
  id: number;
  username: string;
  email?: string;
};

export type TradeItem = {
  id: number;
  title: string;
  detail: string;
  image_url: string | null;
  category_count: number;
  is_active?: boolean;
  created_by_id?: number | null;
  updated_by_id?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  creator?: TradeUserRef | null;
  updator?: TradeUserRef | null;
};

export type TradePayload = {
  title: string;
  detail: string;
  is_active?: boolean;
};

export type TradeListQuery = {
  page?: number;
  per_page?: number;
};

export type TradeStatusFilter = "All" | "Active" | "Inactive";
