"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

import { Can } from "@/components/shared/can";
import { cn } from "@/lib/utils";
import type { QuizInfoListItem } from "@/types/quiz-info.types";

function capitalize(value: string | null | undefined) {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

type QuizTableProps = {
  quizzes: QuizInfoListItem[];
  loading?: boolean;
  onDelete?: (quiz: QuizInfoListItem) => void;
};

export function QuizTable({ quizzes, loading = false, onDelete }: QuizTableProps) {
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
              <th className="px-5 py-3.5">Skill</th>
              <th className="px-5 py-3.5">Questions</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-sm text-[#6b7280]">
                  Loading quizzes...
                </td>
              </tr>
            ) : null}

            {!loading
              ? quizzes.map((quiz) => {
                  const isActive = Boolean(quiz.is_active);
                  return (
                    <tr
                      key={quiz.id}
                      className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]"
                    >
                      <td className="px-5 py-4 text-sm font-medium text-[#374151]">
                        {quiz.id}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-[#111827]">
                        {quiz.name}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#374151]">
                        {quiz.category?.title ?? "—"}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#374151]">
                        {capitalize(quiz.difficulty_level)}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#374151]">
                        {capitalize(quiz.skill_level)}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-[#374151]">
                        {quiz.total_questions ?? 0}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                            isActive
                              ? "bg-[#dcfce7] text-[#16a34a]"
                              : "bg-[#fef3c7] text-[#d97706]",
                          )}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/quizzes/${quiz.id}/preview`}
                            aria-label={`Preview ${quiz.name}`}
                            className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#3b82f6]"
                          >
                            <Eye className="size-4" />
                          </Link>
                          <Can permission="quiz:update">
                            <Link
                              href={`/quizzes/${quiz.id}`}
                              aria-label={`Edit ${quiz.name}`}
                              className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]"
                            >
                              <Pencil className="size-4" />
                            </Link>
                          </Can>
                          <Can permission="quiz:delete">
                            <button
                              type="button"
                              aria-label={`Delete ${quiz.name}`}
                              onClick={() => onDelete?.(quiz)}
                              className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#fef2f2] hover:text-[#ef4444]"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </Can>
                        </div>
                      </td>
                    </tr>
                  );
                })
              : null}

            {!loading && quizzes.length === 0 ? (
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