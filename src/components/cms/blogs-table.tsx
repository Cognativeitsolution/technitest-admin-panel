"use client";

import Image from "next/image";
import { Eye, Image as ImageIcon, Pencil, RotateCcw, Trash2 } from "lucide-react";

import { blogStatusLabel } from "@/lib/blog";
import { formatDateTime } from "@/lib/utils";
import type { BlogListItem } from "@/types/blog.types";

type BlogsTableProps = {
  blogs: BlogListItem[];
  loading?: boolean;
  onPreview: (blog: BlogListItem) => void;
  onEdit: (blog: BlogListItem) => void;
  onDelete: (blog: BlogListItem) => void;
  onRestore?: (blog: BlogListItem) => void;
};

function StatusBadge({ blog }: { blog: BlogListItem }) {
  const label = blogStatusLabel(blog);
  const tone =
    blog.status === "archived"
      ? "bg-[#f3f4f6] text-[#6b7280]"
      : blog.publish_status === "published"
        ? "bg-[#dcfce7] text-[#16a34a]"
        : "bg-[#fef3c7] text-[#d97706]";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>
      {label}
    </span>
  );
}

export function BlogsTable({
  blogs,
  loading = false,
  onPreview,
  onEdit,
  onDelete,
  onRestore,
}: BlogsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-190 border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">Image</th>
              <th className="px-5 py-3.5">Title</th>
              <th className="px-5 py-3.5">Author</th>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-[#6b7280]">
                  Loading blogs...
                </td>
              </tr>
            ) : (
              <>
                {blogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]"
                  >
                    <td className="px-5 py-4">
                      {blog.image?.url ? (
                        <Image
                          src={blog.image.url}
                          alt={blog.image.alt || blog.title}
                          width={48}
                          height={48}
                          className="size-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex size-12 items-center justify-center rounded-lg bg-[#f3f4f6]">
                          <ImageIcon className="size-5 text-[#9ca3af]" />
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-[#111827]">
                      {blog.title}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#374151]">
                      {blog.author_name || "--"}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#6b7280]">
                      {formatDateTime(blog.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge blog={blog} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          aria-label={`Preview ${blog.title}`}
                          onClick={() => onPreview(blog)}
                          className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#3b82f6]"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Edit ${blog.title}`}
                          onClick={() => onEdit(blog)}
                          className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]"
                        >
                          <Pencil className="size-4" />
                        </button>
                        {blog.status === "archived" && onRestore ? (
                          <button
                            type="button"
                            aria-label={`Restore ${blog.title}`}
                            onClick={() => onRestore(blog)}
                            className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#2563eb]"
                          >
                            <RotateCcw className="size-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            aria-label={`Delete ${blog.title}`}
                            onClick={() => onDelete(blog)}
                            className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#fef2f2] hover:text-[#ef4444]"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {blogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-sm text-[#6b7280]"
                    >
                      No blog posts found.
                    </td>
                  </tr>
                ) : null}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
