"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import type { GamificationBadge } from "@/data/gamification";

type BadgesTableProps = {
  badges: GamificationBadge[];
  onEdit: (b: GamificationBadge) => void;
  onDelete: (b: GamificationBadge) => void;
  onToggleStatus: (id: string, enabled: boolean) => void;
};

export function BadgesTable({ badges, onEdit, onDelete, onToggleStatus }: BadgesTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">Badge Name</th>
              <th className="px-5 py-3.5">Badge Image</th>
              <th className="px-5 py-3.5">Criteria</th>
              <th className="px-5 py-3.5">Last Updated</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {badges.map((badge) => (
              <tr key={badge.id} className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]">
                <td className="px-5 py-4 text-sm font-semibold text-[#111827]">{badge.name}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-center">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#f3f4f6]">
                      <Image src={badge.iconUrl} alt={badge.name} width={24} height={24} className="size-6 object-contain" />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">{badge.criteria}</td>
                <td className="px-5 py-4 text-sm text-[#6b7280]">{badge.lastUpdated}</td>
                <td className="px-5 py-4">
                  <Switch
                    checked={badge.status === "enabled"}
                    onCheckedChange={(checked) => onToggleStatus(badge.id, checked)}
                  />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <button type="button" aria-label={`Edit ${badge.name}`} onClick={() => onEdit(badge)} className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]">
                      <Pencil className="size-4" />
                    </button>
                    <button type="button" aria-label={`Delete ${badge.name}`} onClick={() => onDelete(badge)} className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#fef2f2] hover:text-[#ef4444]">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {badges.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-[#6b7280]">No badges found.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
