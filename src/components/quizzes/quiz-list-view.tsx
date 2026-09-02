"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Can } from "@/components/shared/can";
import { Dialog } from "@/components/ui/dialog";
import { MultiSelectFilter } from "@/components/quizzes/multi-select-filter";
import { Pagination } from "@/components/shared/pagination";
import { QuizTable } from "@/components/quizzes/quiz-table";
import { QuizPreviewDialog } from "@/components/quizzes/quiz-preview-dialog";
import { useQuizAdminList } from "@/hooks/quizzes/use-quiz-admin-list";
import { quizInfoService } from "@/services/quiz-info.service";
import { categoryService } from "@/services/category.service";
import { ApiError } from "@/lib/api-error";
import type { QuizInfoListItem } from "@/types/quiz-info.types";

const levelOptions = ["Beginner", "Intermediate", "Advance"];
const skillOptions = ["Student", "Professional"];
const statusOptions = ["Active", "Inactive"];

function capitalize(value: string) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function normalizeLevel(level?: string | null): string {
  const l = (level || "").toLowerCase().trim();
  if (l === "advance" || l === "advanced") return "advance";
  return l;
}

function normalizeSkill(skill?: string | null): string {
  const s = (skill || "").toLowerCase().trim();
  if (s === "students" || s === "student") return "student";
  if (s === "professionals" || s === "professional") return "professional";
  return s;
}

export function QuizListView() {
  const {
    items,
    pagination,
    loading,
    error,
    goToPage,
    refresh,
  } = useQuizAdminList({ perPage: 15 });

  const [dbCategories, setDbCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<QuizInfoListItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [previewTarget, setPreviewTarget] = useState<QuizInfoListItem | null>(null);

  useEffect(() => {
    categoryService
      .getAdminList({ per_page: 100 })
      .then((res) => {
        const catTitles = (res.items ?? []).map((c) => c.title).filter(Boolean);
        setDbCategories(catTitles);
      })
      .catch(() => {});
  }, []);

  const categoryOptions = useMemo(() => {
    const titles = new Set<string>(dbCategories);
    for (const quiz of items) {
      if (quiz.category?.title) titles.add(quiz.category.title);
    }
    return Array.from(titles).sort((a, b) => a.localeCompare(b));
  }, [items, dbCategories]);

  const filtered = useMemo(() => {
    return items.filter((quiz) => {
      if (categories.length > 0) {
        const quizCat = quiz.category?.title?.toLowerCase().trim() ?? "";
        const matched = categories.some((c) => c.toLowerCase().trim() === quizCat);
        if (!matched) return false;
      }

      if (levels.length > 0) {
        const quizLevel = normalizeLevel(quiz.difficulty_level);
        const matched = levels.some((l) => normalizeLevel(l) === quizLevel);
        if (!matched) return false;
      }

      if (skills.length > 0) {
        const quizSkill = normalizeSkill(quiz.skill_level);
        const matched = skills.some((s) => normalizeSkill(s) === quizSkill);
        if (!matched) return false;
      }

      if (statuses.length > 0) {
        const status = quiz.is_active ? "Active" : "Inactive";
        if (!statuses.includes(status)) return false;
      }

      return true;
    });
  }, [items, categories, levels, skills, statuses]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await quizInfoService.delete(deleteTarget.id);
      toast.success("Quiz deleted successfully");
      setDeleteTarget(null);
      refresh();
      goToPage(1);
    } catch (err) {
      toast.error(ApiError.fromAxiosError(err).message);
    } finally {
      setDeleting(false);
    }
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
          options={levelOptions}
          selected={levels}
          onChange={(v) => {
            setLevels(v);
            goToPage(1);
          }}
        />
        <MultiSelectFilter
          label="Skill"
          options={skillOptions}
          selected={skills}
          onChange={(v) => {
            setSkills(v);
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
        onPreview={setPreviewTarget}
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
            disabled={deleting}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#ef4444] px-5 text-sm font-semibold text-white transition hover:bg-[#dc2626] disabled:pointer-events-none disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Dialog>

      <QuizPreviewDialog
        open={!!previewTarget}
        quizId={previewTarget?.id ?? null}
        onClose={() => setPreviewTarget(null)}
      />
    </div>
  );
}