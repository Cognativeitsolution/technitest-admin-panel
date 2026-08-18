"use client";

import { Star } from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";

import type { StarRule } from "@/data/gamification";

type StarsTableProps = {
  rules: StarRule[];
  onEdit: (s: StarRule) => void;
  onDelete: (s: StarRule) => void;
};

export function StarsTable({ rules, onEdit, onDelete }: StarsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">Star Count</th>
              <th className="px-5 py-3.5">Percentage Range</th>
              <th className="px-5 py-3.5">Preview Icon</th>
              <th className="px-5 py-3.5">Last Updated</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.id} className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]">
                <td className="px-5 py-4 text-sm font-semibold text-[#111827]">
                  {rule.starCount} {rule.starCount === 1 ? "Star" : "Stars"}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">{rule.range}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-5 ${i < rule.starCount ? "fill-[#2563eb] text-[#2563eb]" : "fill-[#d1d5db] text-[#d1d5db]"}`}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-[#6b7280]">{rule.lastUpdated}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <button type="button" aria-label={`Edit ${rule.starCount} stars`} onClick={() => onEdit(rule)} className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]">
                      <Pencil className="size-4" />
                    </button>
                    <button type="button" aria-label={`Delete ${rule.starCount} stars`} onClick={() => onDelete(rule)} className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#fef2f2] hover:text-[#ef4444]">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rules.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-[#6b7280]">No star rules found.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
