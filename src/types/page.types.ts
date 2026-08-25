export type PageContentBlock = {
  type: string;
  header: string;
  text: string;
  data: Record<string, unknown>;
};

export type PageListItem = {
  id: number;
  title: string;
  slug: string;
  status: string;
  publish_status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PageActor = {
  id: number;
  username: string;
  email: string;
};

export type PageDetail = PageListItem & {
  content: PageContentBlock[];
  meta_title: string | null;
  meta_keyword: string | null;
  meta_description: string | null;
  show_in_nav?: boolean;
  nav_label?: string | null;
  nav_order?: number | null;
  created_by?: number | null;
  updated_by?: number | null;
  creator?: PageActor | null;
  updater?: PageActor | null;
};

export type NavbarItem = {
  id: number;
  label: string;
  slug: string;
  nav_order: number;
};

export type PageDropdownItem = {
  id: number;
  title: string;
  slug: string;
};

export type PageListQuery = {
  publish_status?: string;
  status?: string;
  page?: number;
  per_page?: number;
};

export type CreatePagePayload = {
  title: string;
  slug: string;
  content: PageContentBlock[];
  meta_title?: string;
  meta_keyword?: string;
  meta_description?: string;
  show_in_nav?: boolean;
  nav_label?: string;
  nav_order?: number;
};

export type UpdatePagePayload = {
  title?: string;
  slug?: string;
  content?: PageContentBlock[];
  meta_title?: string;
  meta_keyword?: string;
  meta_description?: string;
  status?: string;
  show_in_nav?: boolean;
  nav_label?: string;
  nav_order?: number;
};

export const PAGE_STATUS_FILTERS = ["active", "inactive"] as const;
export const PAGE_PUBLISH_FILTERS = ["published", "draft"] as const;
