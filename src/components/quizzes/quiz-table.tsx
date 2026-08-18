"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

import type { Quiz } from "@/data/quizzes";

type QuizTableProps = {
  quizzes: Quiz[];
  onDelete?: (quiz: Quiz) => void;
};

export function QuizTable({ quizzes, onDelete }: QuizTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">ID</th>
              <th className="px-5 py-3.5">Quiz Title</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Level</th>
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Questions</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr
                key={quiz.id}
                className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]"
              >
                <td className="px-5 py-4 text-sm font-medium text-[#374151]">{quiz.id}</td>
                <td className="px-5 py-4 text-sm font-semibold text-[#111827]">{quiz.title}</td>
                <td className="px-5 py-4 text-sm text-[#374151]">{quiz.category}</td>
                <td className="px-5 py-4 text-sm text-[#374151]">{quiz.level}</td>
                <td className="px-5 py-4 text-sm text-[#374151]">{quiz.type}</td>
                <td className="px-5 py-4 text-sm font-medium text-[#374151]">{quiz.questionsCount}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      quiz.status === "Active"
                        ? "bg-[#dcfce7] text-[#16a34a]"
                        : "bg-[#fef3c7] text-[#d97706]"
                    }`}
                  >
                    {quiz.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/quizzes/${quiz.id}/preview`}
                      aria-label={`Preview ${quiz.title}`}
                      className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#3b82f6]"
                    >
                      <Eye className="size-4" />
                    </Link>
                    <Link
                      href={`/quizzes/${quiz.id}`}
                      aria-label={`Edit ${quiz.title}`}
                      className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]"
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <button
                      type="button"
                      aria-label={`Delete ${quiz.title}`}
                      onClick={() => onDelete?.(quiz)}
                      className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#fef2f2] hover:text-[#ef4444]"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {quizzes.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-sm text-[#6b7280]">
                  No quizzes found matching your filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
