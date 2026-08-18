"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

import { Dialog } from "@/components/ui/dialog";
import { MultiSelectFilter } from "@/components/quizzes/multi-select-filter";
import { Pagination } from "@/components/shared/pagination";
import { QuizTable } from "@/components/quizzes/quiz-table";
import { quizzes as allQuizzes, categoryOptions, levelOptions, typeOptions } from "@/data/quizzes";
import type { Quiz } from "@/data/quizzes";

const PAGE_SIZE = 5;

export function QuizListView() {
  const [categories, setCategories] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Quiz | null>(null);

  const filtered = useMemo(() => {
    return allQuizzes.filter((q) => {
      if (categories.length > 0 && !categories.includes(q.category)) return false;
      if (levels.length > 0 && !levels.includes(q.level)) return false;
      if (types.length > 0 && !types.includes(q.type)) return false;
      return true;
    });
  }, [categories, levels, types]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageQuizzes = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleDelete() {
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
          Quizzes Management
        </h1>
        <Link
          href="/quizzes/new"
          className="inline-flex h-11 w-fit items-center gap-2 rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d99400]"
        >
          <Plus className="size-4" />
          Add New Quiz
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <MultiSelectFilter
          label="Category"
          options={categoryOptions}
          selected={categories}
          onChange={(v) => { setCategories(v); setPage(1); }}
        />
        <MultiSelectFilter
          label="Level"
          options={levelOptions}
          selected={levels}
          onChange={(v) => { setLevels(v); setPage(1); }}
        />
        <MultiSelectFilter
          label="Type"
          options={typeOptions}
          selected={types}
          onChange={(v) => { setTypes(v); setPage(1); }}
        />
      </div>

      <QuizTable quizzes={pageQuizzes} onDelete={setDeleteTarget} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Quiz"
      >
        <p className="text-[15px] text-[#4b5563]">
          Are you sure you want to delete <span className="font-semibold text-[#111827]">{deleteTarget?.title}</span>? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#ef4444] px-5 text-sm font-semibold text-white transition hover:bg-[#dc2626]"
          >
            Delete
          </button>
        </div>
      </Dialog>
    </div>
  );
}
