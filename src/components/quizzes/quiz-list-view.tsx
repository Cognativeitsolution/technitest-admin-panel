"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Can } from "@/components/shared/can";
import { Dialog } from "@/components/ui/dialog";
import { MultiSelectFilter } from "@/components/quizzes/multi-select-filter";
import { Pagination } from "@/components/shared/pagination";
import { QuizTable } from "@/components/quizzes/quiz-table";
import { useQuizAdminList } from "@/hooks/quizzes/use-quiz-admin-list";
import type { QuizInfoListItem } from "@/types/quiz-info.types";

const levelOptions = ["beginner", "intermediate", "advanced"];
const skillOptions = ["student", "professional"];
const statusOptions = ["Active", "Inactive"];

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function QuizListView() {
  const {
    items,
    pagination,
    loading,
    error,
    goToPage,
  } = useQuizAdminList({ perPage: 15 });

  const [categories, setCategories] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<QuizInfoListItem | null>(null);

  const categoryOptions = useMemo(() => {
    const titles = new Set<string>();
    for (const quiz of items) {
      if (quiz.category?.title) titles.add(quiz.category.title);
    }
    return Array.from(titles).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((quiz) => {
      if (
        categories.length > 0 &&
        !categories.includes(quiz.category?.title ?? "")
      ) {
        return false;
      }
      if (
        levels.length > 0 &&
        !levels.includes((quiz.difficulty_level ?? "").toLowerCase())
      ) {
        return false;
      }
      if (
        skills.length > 0 &&
        !skills.includes((quiz.skill_level ?? "").toLowerCase())
      ) {
        return false;
      }
      if (statuses.length > 0) {
        const status = quiz.is_active ? "Active" : "Inactive";
        if (!statuses.includes(status)) return false;
      }
      return true;
    });
  }, [items, categories, levels, skills, statuses]);

  function handleDelete() {
    setDeleteTarget(null);
    toast.message("Quiz delete API is not available yet.");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
          Quizzes Management
        </h1>
        <Can permission="quiz:create">
          <Link
            href="/quizzes/new"
            className="inline-flex h-11 w-fit items-center gap-2 rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d99400]"
          >
            <Plus className="size-4" />
            Add New Quiz
          </Link>
        </Can>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <MultiSelectFilter
          label="Category"
          options={categoryOptions}
          selected={categories}
          onChange={(v) => {
            setCategories(v);
            goToPage(1);
          }}
        />
        <MultiSelectFilter
          label="Level"
          options={levelOptions.map(capitalize)}
          selected={levels.map(capitalize)}
          onChange={(v) => {
            setLevels(v.map((item) => item.toLowerCase()));
            goToPage(1);
          }}
        />
        <MultiSelectFilter
          label="Skill"
          options={skillOptions.map(capitalize)}
          selected={skills.map(capitalize)}
          onChange={(v) => {
            setSkills(v.map((item) => item.toLowerCase()));
            goToPage(1);
          }}
        />
        <MultiSelectFilter
          label="Status"
          options={statusOptions}
          selected={statuses}
          onChange={(v) => {
            setStatuses(v);
            goToPage(1);
          }}
        />
      </div>

      {error ? (
        <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
          {error}
        </div>
      ) : null}

      <QuizTable
        quizzes={filtered}
        loading={loading}
        onDelete={setDeleteTarget}
      />

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={goToPage}
      />

      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Quiz"
      >
        <p className="text-[15px] text-[#4b5563]">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[#111827]">
            {deleteTarget?.name}
          </span>
          ? This action cannot be undone.
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