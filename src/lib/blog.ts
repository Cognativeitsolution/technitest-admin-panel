import type { BlogDetail } from "@/types/blog.types";

export function isBlogDetail(value: unknown): value is BlogDetail {
  return (
    !!value &&
    typeof value === "object" &&
    "id" in value &&
    "slug" in value &&
    "title" in value
  );
}

export function blogStatusLabel(blog: {
  status: string;
  publish_status: string;
}) {
  if (blog.status === "archived") return "Archived";
  return blog.publish_status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function keywordsToList(value: string | null | undefined) {
  if (!value) return [];
  return value
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

export function keywordsToString(tags: string[]) {
  return tags
    .map((tag) => tag.trim())
    .filter(Boolean)
    .join(", ");
}
