"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import type { CmsPage } from "@/data/cms";

type PagesTableProps = {
  pages: CmsPage[];
  onPreview: (page: CmsPage) => void;
  onEdit: (page: CmsPage) => void;
  onDelete: (page: CmsPage) => void;
};

function StatusDot({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium text-[#374151]">
      <span className={`size-2 rounded-full ${status === "Published" ? "bg-[#16a34a]" : "bg-[#f59e0b]"}`} />
      {status}
    </span>
  );
}

export function PagesTable({ pages, onPreview, onEdit, onDelete }: PagesTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">Page Title</th>
              <th className="px-5 py-3.5">Slug / URL</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Created on</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id} className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]">
                <td className="px-5 py-4 text-sm font-semibold text-[#111827]">{page.title}</td>
                <td className="px-5 py-4 text-sm text-[#6b7280]">{page.slug}</td>
                <td className="px-5 py-4"><StatusDot status={page.status} /></td>
                <td className="px-5 py-4 text-sm text-[#6b7280]">{page.createdOn}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <button type="button" aria-label={`Preview ${page.title}`} onClick={() => onPreview(page)} className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#3b82f6]">
                      <Eye className="size-4" />
                    </button>
                    <button type="button" aria-label={`Edit ${page.title}`} onClick={() => onEdit(page)} className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]">
                      <Pencil className="size-4" />
                    </button>
                    <button type="button" aria-label={`Delete ${page.title}`} onClick={() => onDelete(page)} className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#fef2f2] hover:text-[#ef4444]">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {pages.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-[#6b7280]">No CMS pages found.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
