"use client";

import Image from "next/image";
import { Pencil } from "lucide-react";

import type { BadgeRule } from "@/types/gamification.types";
import { formatDateTime } from "@/lib/utils";

type BadgesTableProps = {
  badges: BadgeRule[];
  loading?: boolean;
  onEdit: (b: BadgeRule) => void;
};

function typeBadgeStyle(type: string) {
  return type.toLowerCase() === "paid"
    ? "bg-[#fef3c7] text-[#d97706]"
    : "bg-[#dcfce7] text-[#16a34a]";
}

export function BadgesTable({ badges, loading = false, onEdit }: BadgesTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">Badge Name</th>
              <th className="px-5 py-3.5">Image</th>
              <th className="px-5 py-3.5">Difficulty Level</th>
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Price</th>
              <th className="px-5 py-3.5">Validity</th>
              <th className="px-5 py-3.5">Last Updated</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-5 py-10 text-center text-sm text-[#6b7280]">Loading badges...</td></tr>
            ) : (
              <>
                {badges.map((badge) => (
                  <tr key={badge.id} className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]">
                    <td className="px-5 py-4 text-sm font-semibold text-[#111827]">{badge.badge_name || "--"}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center">
                        {badge.image_url ? (
                          <Image
                            src={badge.image_url}
                            alt={badge.badge_name || "Badge"}
                            width={40}
                            height={40}
                            className="size-10 rounded-full object-contain"
                          />
                        ) : (
                          <div className="flex size-10 items-center justify-center rounded-full bg-[#f3f4f6] text-sm font-semibold text-[#9ca3af]">
                            {(badge.badge_name || "?").charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm capitalize text-[#374151]">{badge.difficulty_level}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${typeBadgeStyle(badge.type)}`}>
                        {badge.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-[#111827]">${badge.price}</td>
                    <td className="px-5 py-4 text-sm text-[#374151]">{badge.validity_years} year{badge.validity_years === 1 ? "" : "s"}</td>
                    <td className="px-5 py-4 text-sm text-[#6b7280]">{formatDateTime(badge.updated_at)}</td>
                    <td className="px-5 py-4">
                      <button type="button" aria-label={`Edit ${badge.badge_name || "badge"}`} onClick={() => onEdit(badge)} className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]">
                        <Pencil className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {badges.length === 0 ? (
                  <tr><td colSpan={8} className="px-5 py-10 text-center text-sm text-[#6b7280]">No badges found.</td></tr>
                ) : null}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
