"use client";

import { Star } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import type { TopScorerEntry } from "@/types/gamification.types";
import { formatDateTime } from "@/lib/utils";

type TopScorersTableProps = {
  scorers: TopScorerEntry[];
  loading?: boolean;
  rankOffset?: number;
  onToggleFeatured: (scorer: TopScorerEntry, isFeatured: boolean) => void;
};

function statusStyle(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "issued") return "bg-[#dcfce7] text-[#16a34a]";
  if (normalized === "pending") return "bg-[#fef3c7] text-[#d97706]";
  return "bg-[#f3f4f6] text-[#6b7280]";
}

export function TopScorersTable({ scorers, loading = false, rankOffset = 0, onToggleFeatured }: TopScorersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">Rank</th>
              <th className="px-5 py-3.5">User</th>
              <th className="px-5 py-3.5">Score</th>
              <th className="px-5 py-3.5">Percentage</th>
              <th className="px-5 py-3.5">Quiz</th>
              <th className="px-5 py-3.5">Level</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Certificate</th>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5">Featured</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={10} className="px-5 py-10 text-center text-sm text-[#6b7280]">Loading top scorers...</td></tr>
            ) : (
              <>
                {scorers.map((ts, index) => (
                  <tr key={`${ts.certificate_id}-${ts.quiz_attempt_id}`} className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]">
                    <td className="px-5 py-4 text-sm font-semibold text-[#111827]">
                      {String(rankOffset + index + 1).padStart(2, "0")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-[#111827]">{ts.username}</span>
                        <span className="text-xs text-[#6b7280]">{ts.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-[#111827]">{ts.score}</td>
                    <td className="px-5 py-4 text-sm text-[#374151]">{ts.percentage}%</td>
                    <td className="px-5 py-4 text-sm text-[#374151]">{ts.quiz_name}</td>
                    <td className="px-5 py-4 text-sm capitalize text-[#374151]">{ts.level}</td>
                    <td className="px-5 py-4 text-sm text-[#374151]">{ts.category_title}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyle(ts.certificate_status)}`}>
                        {ts.certificate_status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#6b7280]">{formatDateTime(ts.date_performed)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={ts.is_featured}
                          onCheckedChange={(checked) => onToggleFeatured(ts, checked)}
                        />
                        {ts.is_featured ? (
                          <Star className="size-4 fill-[#f0a500] text-[#f0a500]" />
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
                {scorers.length === 0 ? (
                  <tr><td colSpan={10} className="px-5 py-10 text-center text-sm text-[#6b7280]">No top scorers found.</td></tr>
                ) : null}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
