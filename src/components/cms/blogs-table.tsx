"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

import type { BlogPost } from "@/data/cms";

type BlogsTableProps = {
  blogs: BlogPost[];
  onPreview: (blog: BlogPost) => void;
  onDelete: (blog: BlogPost) => void;
};

const thumbMap: Record<string, string> = {
  b1: "https://i.pravatar.cc/80?img=5",
  b2: "https://i.pravatar.cc/80?img=9",
  b3: "https://i.pravatar.cc/80?img=20",
};

export function BlogsTable({ blogs, onPreview, onDelete }: BlogsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">Image</th>
              <th className="px-5 py-3.5">Title</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr
                key={blog.id}
                className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]"
              >
                <td className="px-5 py-4">
                  <Image
                    src={thumbMap[blog.id] ?? "https://i.pravatar.cc/80?img=1"}
                    alt={blog.title}
                    width={48}
                    height={48}
                    className="size-12 rounded-lg object-cover"
                  />
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-[#111827]">
                  {blog.title}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {blog.category}
                </td>
                <td className="px-5 py-4 text-sm text-[#6b7280]">
                  {blog.createdOn}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      blog.status === "Published"
                        ? "bg-[#dcfce7] text-[#16a34a]"
                        : "bg-[#fef3c7] text-[#d97706]"
                    }`}
                  >
                    {blog.status}
                  </span>
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
                    <Link
                      href={`/blogs/${blog.id}`}
                      aria-label={`Edit ${blog.title}`}
                      className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]"
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <button
                      type="button"
                      aria-label={`Delete ${blog.title}`}
                      onClick={() => onDelete(blog)}
                      className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#fef2f2] hover:text-[#ef4444]"
                    >
                      <Trash2 className="size-4" />
                    </button>
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
