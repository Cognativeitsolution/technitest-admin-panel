"use client";

import { Image, Pencil, Trash2 } from "lucide-react";
import type { AdvertisementBanner } from "@/data/cms";

type AdvertisementsTableProps = {
  banners: AdvertisementBanner[];
  onEdit: (banner: AdvertisementBanner) => void;
  onDelete: (banner: AdvertisementBanner) => void;
};

export function AdvertisementsTable({ banners, onEdit, onDelete }: AdvertisementsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">Banner Title</th>
              <th className="px-5 py-3.5">Page / Placement</th>
              <th className="px-5 py-3.5">Preview</th>
              <th className="px-5 py-3.5">Created on</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner.id} className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]">
                <td className="px-5 py-4 text-sm font-semibold text-[#111827]">{banner.title}</td>
                <td className="px-5 py-4 text-sm text-[#374151]">{banner.placement}</td>
                <td className="px-5 py-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-[#f3f4f6]">
                    <Image className="size-5 text-[#9ca3af]" />
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-[#6b7280]">{banner.createdOn}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold ${
                    banner.status === "Active" ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#f3f4f6] text-[#6b7280]"
                  }`}>
                    {banner.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <button type="button" aria-label={`Edit ${banner.title}`} onClick={() => onEdit(banner)} className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]">
                      <Pencil className="size-4" />
                    </button>
                    <button type="button" aria-label={`Delete ${banner.title}`} onClick={() => onDelete(banner)} className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#fef2f2] hover:text-[#ef4444]">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {banners.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-[#6b7280]">No advertisements found.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
