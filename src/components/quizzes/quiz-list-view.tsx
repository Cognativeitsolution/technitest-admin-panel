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
import { tradeService } from "@/services/trade.service";
import { ApiError } from "@/lib/api-error";
import type { CategoryItem } from "@/types/category.types";
import type { QuizInfoListItem } from "@/types/quiz-info.types";
import type { TradeItem } from "@/types/trade.types";

const levelOptions = ["Beginner", "Intermediate", "Advance"];
const skillOptions = ["Student", "Professional"];
const statusOptions = ["Active", "Inactive"];

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

function getQuizCategoryId(quiz: QuizInfoListItem) {
  return quiz.category_id ?? quiz.category?.id ?? null;
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

  const [dbTrades, setDbTrades] = useState<TradeItem[]>([]);
  const [dbCategories, setDbCategories] = useState<CategoryItem[]>([]);
  const [trades, setTrades] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<QuizInfoListItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [previewTarget, setPreviewTarget] = useState<QuizInfoListItem | null>(null);

  useEffect(() => {
    Promise.all([tradeService.getAdminListAll(), categoryService.getAdminListAll()])
      .then(([tradeResult, categoryResult]) => {
        setDbTrades(
          (tradeResult.items ?? []).filter((trade) => trade.is_active !== false),
        );
        setDbCategories(categoryResult.items ?? []);
      })
      .catch(() => {});
  }, []);

  const tradeTitleToId = useMemo(
    () => Object.fromEntries(dbTrades.map((trade) => [trade.title, trade.id])),
    [dbTrades],
  );

  const tradeIdToTitle = useMemo(
    () => Object.fromEntries(dbTrades.map((trade) => [trade.id, trade.title])),
    [dbTrades],
  );

  const tradeNamesByCategoryId = useMemo(
    () =>
      Object.fromEntries(
        dbCategories.map((category) => [
          category.id,
          tradeIdToTitle[category.trade_id] ?? "—",
        ]),
      ),
    [dbCategories, tradeIdToTitle],
  );

  const tradeOptions = useMemo(() => {
    const titles = dbTrades.map((trade) => trade.title);
    return [...new Set(titles)].sort((a, b) => a.localeCompare(b));
  }, [dbTrades]);

  const subcategoryOptions = useMemo(() => {
    let availableCategories = dbCategories;

    if (trades.length > 0) {
      const selectedTradeIds = new Set(
        trades
          .map((title) => tradeTitleToId[title])
          .filter((id): id is number => typeof id === "number"),
      );
      availableCategories = availableCategories.filter((category) =>
        selectedTradeIds.has(category.trade_id),
      );
    }

    const titles = new Set(availableCategories.map((category) => category.title));
    for (const quiz of items) {
      if (quiz.category?.title) titles.add(quiz.category.title);
    }

    return Array.from(titles).sort((a, b) => a.localeCompare(b));
  }, [dbCategories, items, tradeTitleToId, trades]);

  useEffect(() => {
    if (trades.length === 0) return;

    const allowed = new Set(subcategoryOptions.map((title) => title.toLowerCase().trim()));
    setCategories((prev) =>
      prev.filter((title) => allowed.has(title.toLowerCase().trim())),
    );
  }, [subcategoryOptions, trades.length]);

  const filtered = useMemo(() => {
    return items.filter((quiz) => {
      const categoryId = getQuizCategoryId(quiz);
      const tradeTitle = categoryId ? tradeNamesByCategoryId[categoryId] : null;

      if (trades.length > 0) {
        const matchedTrade = tradeTitle
          ? trades.some((title) => title.toLowerCase().trim() === tradeTitle.toLowerCase().trim())
          : false;
        if (!matchedTrade) return false;
      }

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
  }, [items, trades, categories, levels, skills, statuses, tradeNamesByCategoryId]);

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
          label="Trade"
          options={tradeOptions}
          selected={trades}
          onChange={(value) => {
            setTrades(value);
            goToPage(1);
          }}
        />
        <MultiSelectFilter
          label="Subcategory"
          options={subcategoryOptions}
          selected={categories}
          onChange={(value) => {
            setCategories(value);
            goToPage(1);
          }}
        />
        <MultiSelectFilter
          label="Level"
          options={levelOptions}
          selected={levels}
          onChange={(value) => {
            setLevels(value);
            goToPage(1);
          }}
        />
        <MultiSelectFilter
          label="Skill"
          options={skillOptions}
          selected={skills}
          onChange={(value) => {
            setSkills(value);
            goToPage(1);
          }}
        />
        <MultiSelectFilter
          label="Status"
          options={statusOptions}
          selected={statuses}
          onChange={(value) => {
            setStatuses(value);
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
        tradeNamesByCategoryId={tradeNamesByCategoryId}
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
