"use client";

import Image from "next/image";
import { CheckCircle } from "lucide-react";

import type { FeedbackItem } from "@/data/feedback";

type FeedbacksTableProps = {
  items: FeedbackItem[];
  onMarkResolved: (id: string) => void;
  onMessageClick: (item: FeedbackItem) => void;
};

function sentimentColor(s: string) {
  if (s === "Positive") return "bg-[#dcfce7] text-[#16a34a]";
  if (s === "Negative") return "bg-[#fef2f2] text-[#ef4444]";
  return "bg-[#f3f4f6] text-[#6b7280]";
}

function typeColor(t: string) {
  if (t === "Bug Report") return "bg-[#fef2f2] text-[#ef4444]";
  if (t === "Suggestion") return "bg-[#eff6ff] text-[#2563eb]";
  return "bg-[#fef9c3] text-[#ca8a04]";
}

export function FeedbacksTable({ items, onMarkResolved, onMessageClick }: FeedbacksTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">User</th>
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Review Message</th>
              <th className="px-5 py-3.5">Page / Quiz</th>
              <th className="px-5 py-3.5">Sentiment</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Image src={item.userAvatar} alt={item.userName} width={36} height={36} className="size-9 rounded-full object-cover" />
                    <span className="text-sm font-medium text-[#111827]">{item.userName}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold ${typeColor(item.type)}`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => onMessageClick(item)}
                    className="max-w-[200px] truncate text-sm text-[#374151] underline decoration-[#d1d5db] underline-offset-2 transition hover:text-[#2563eb] hover:decoration-[#2563eb]"
                  >
                    &quot;{item.message}&quot;
                  </button>
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">{item.pageQuiz}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold ${sentimentColor(item.sentiment)}`}>
                    {item.sentiment}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold ${
                      item.status === "Approved"
                        ? "bg-[#dcfce7] text-[#16a34a]"
                        : "bg-[#fef9c3] text-[#ca8a04]"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-[#6b7280]">{item.date}</td>
                <td className="px-5 py-4">
                  {item.status === "Approved" ? (
                    <div className="flex items-center gap-1.5 text-[#16a34a]">
                      <CheckCircle className="size-4" />
                      <span className="text-sm font-semibold">Resolved</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onMarkResolved(item.id)}
                      className="text-sm font-semibold text-[#2563eb] transition hover:text-[#1d4ed8]"
                    >
                      Mark as Resolved
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr><td colSpan={8} className="px-5 py-10 text-center text-sm text-[#6b7280]">No feedback found.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
