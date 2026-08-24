export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data: T;
};

export type ApiEnvelope<T = unknown> = {
  statusCode: number;
  message: string;
  status: boolean;
  response: {
    data: T;
  };
};

export type PaginatedData<T> = {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
};

export type PaginationMeta = {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
};
