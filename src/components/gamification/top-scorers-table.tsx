"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";

import type { TopScorer } from "@/data/gamification";

type TopScorersTableProps = {
  scorers: TopScorer[];
  onEdit: (ts: TopScorer) => void;
  onDelete: (ts: TopScorer) => void;
};

export function TopScorersTable({ scorers, onEdit, onDelete }: TopScorersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">Rank</th>
              <th className="px-5 py-3.5">User</th>
              <th className="px-5 py-3.5">Score</th>
              <th className="px-5 py-3.5">Quiz Name</th>
              <th className="px-5 py-3.5">Level</th>
              <th className="px-5 py-3.5">Certificate</th>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {scorers.map((ts) => (
              <tr key={ts.id} className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]">
                <td className="px-5 py-4 text-sm font-semibold text-[#111827]">
                  {String(ts.rank).padStart(2, "0")}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Image src={ts.userAvatar} alt={ts.userName} width={36} height={36} className="size-9 rounded-full object-cover" />
                    <span className="text-sm font-medium text-[#111827]">{ts.userName}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-[#111827]">{ts.score}</td>
                <td className="px-5 py-4 text-sm text-[#374151]">{ts.quizName}</td>
                <td className="px-5 py-4 text-sm text-[#374151]">{ts.level}</td>
                <td className="px-5 py-4 text-sm text-[#374151]">{ts.certificate}</td>
                <td className="px-5 py-4 text-sm text-[#6b7280]">{ts.date}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <button type="button" aria-label={`Edit ${ts.userName}`} onClick={() => onEdit(ts)} className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]">
                      <Pencil className="size-4" />
                    </button>
                    <button type="button" aria-label={`Delete ${ts.userName}`} onClick={() => onDelete(ts)} className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#fef2f2] hover:text-[#ef4444]">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {scorers.length === 0 ? (
              <tr><td colSpan={8} className="px-5 py-10 text-center text-sm text-[#6b7280]">No top scorers found.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
