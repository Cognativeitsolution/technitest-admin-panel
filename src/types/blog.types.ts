import type { MediaItem } from "@/types/media.types";
import type { PageActor } from "@/types/page.types";

export type BlogListItem = {
  id: number;
  title: string;
  slug: string;
  image: MediaItem | null;
  short_description: string | null;
  views: number;
  author_name: string | null;
  author_image: MediaItem | null;
  status: string;
  publish_status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type BlogDetail = BlogListItem & {
  long_description: string | null;
  meta_title: string | null;
  meta_keyword: string | null;
  meta_description: string | null;
  created_by?: number | null;
  updated_by?: number | null;
  creator?: PageActor | null;
  updater?: PageActor | null;
};

export type BlogRevision = {
  id: number;
  blog_id?: number;
  title?: string | null;
  slug?: string | null;
  short_description?: string | null;
  long_description?: string | null;
  meta_title?: string | null;
  meta_keyword?: string | null;
  meta_description?: string | null;
  created_at?: string | null;
  created_by?: number | null;
};

export type BlogListQuery = {
  publish_status?: string;
  status?: string;
  page?: number;
  per_page?: number;
};

export type CreateBlogPayload = {
  title: string;
  slug: string;
  short_description?: string;
  long_description?: string;
  author_name?: string;
  meta_title?: string;
  meta_keyword?: string;
  meta_description?: string;
  image_id?: number;
  author_image_id?: number;
};

export type UpdateBlogPayload = CreateBlogPayload & {
  status?: string;
};

export type AutosaveBlogPayload = {
  title?: string;
  slug?: string;
  short_description?: string;
  long_description?: string;
  meta_title?: string;
  meta_keyword?: string;
  meta_description?: string;
};

export const BLOG_STATUS_FILTERS = ["active", "inactive", "archived"] as const;
export const BLOG_PUBLISH_FILTERS = ["published", "draft"] as const;
