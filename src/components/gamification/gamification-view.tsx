"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Dialog } from "@/components/ui/dialog";
import { Pagination } from "@/components/shared/pagination";
import { BadgesTable } from "@/components/gamification/badges-table";
import { StarsTable } from "@/components/gamification/stars-table";
import { TopScorersTable } from "@/components/gamification/top-scorers-table";
import { BadgeDialog } from "@/components/gamification/badge-dialog";
import { StarDialog } from "@/components/gamification/star-dialog";
import { Can } from "@/components/shared/can";
import { usePermissions } from "@/hooks/use-permissions";
import { useBadges } from "@/hooks/gamification/use-badges";
import { useStars } from "@/hooks/gamification/use-stars";
import { useTopScorers } from "@/hooks/gamification/use-top-scorers";
import type {
  BadgePayload,
  BadgeRule,
  StarPayload,
  StarRuleRecord,
  TopScorerEntry,
} from "@/types/gamification.types";
import { difficultyLevelOptions } from "@/types/gamification.types";

const PAGE_SIZE = 10;

export function GamificationView({ initialTab = "badges" }: { initialTab?: string }) {
  const [activeTab, setActiveTab] = useState<"badges" | "stars" | "top-scorer">(
    initialTab === "stars" ? "stars" : initialTab === "top-scorer" ? "top-scorer" : "badges"
  );
  const { hasModule } = usePermissions();

  const badgesQuery = useBadges();
  const starsQuery = useStars({ perPage: PAGE_SIZE });
  const topScorersQuery = useTopScorers({ perPage: PAGE_SIZE });

  const takenBadgeLevels = new Set(badgesQuery.items.map((badge) => badge.difficulty_level));
  const allBadgeLevelsTaken =
    difficultyLevelOptions.every((level) => takenBadgeLevels.has(level));

  const [badgeDialogOpen, setBadgeDialogOpen] = useState(false);
  const [badgeDialogMode, setBadgeDialogMode] = useState<"create" | "edit">("create");
  const [badgeDialogTarget, setBadgeDialogTarget] = useState<BadgeRule | null>(null);

  const [starDialogOpen, setStarDialogOpen] = useState(false);
  const [starDialogTarget, setStarDialogTarget] = useState<StarRuleRecord | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<StarRuleRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openCreateBadge() {
    setBadgeDialogMode("create");
    setBadgeDialogTarget(null);
    setBadgeDialogOpen(true);
  }

  function openEditBadge(badge: BadgeRule) {
    setBadgeDialogMode("edit");
    setBadgeDialogTarget(badge);
    setBadgeDialogOpen(true);
  }

  function openCreateStar() {
    setStarDialogTarget(null);
    setStarDialogOpen(true);
  }

  function handleBadgeSubmit(payload: BadgePayload, image: File | null) {
    if (badgeDialogMode === "create") {
      return badgesQuery.createBadge({ payload, image });
    }
    return badgesQuery.updateBadge({ ruleId: badgeDialogTarget?.id as number, payload, image });
  }

  function handleStarSubmit(payload: StarPayload) {
    return starDialogTarget
      ? starsQuery.updateStar(starDialogTarget.id, payload)
      : starsQuery.createStar(payload);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await starsQuery.deleteStar(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
  }

  function handleToggleFeatured(scorer: TopScorerEntry, isFeatured: boolean) {
    void topScorersQuery.toggleFeatured(scorer.certificate_id, isFeatured);
  }

  const tabs = [
    { id: "badges" as const, label: "Badges", module: "badges" },
    { id: "stars" as const, label: "Stars", module: "stars" },
    { id: "top-scorer" as const, label: "Top Scorer", module: "certificate" },
  ];

  const visibleTabs = tabs.filter((tab) => hasModule(tab.module));
  const currentTab = visibleTabs.some((tab) => tab.id === activeTab)
    ? activeTab
    : (visibleTabs[0]?.id ?? "badges");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
          Gamification
        </h1>
        {currentTab === "badges" && allBadgeLevelsTaken ? null : currentTab !== "top-scorer" ? (
          currentTab === "badges" ? (
            <Can permission="badges:create">
              <button
                type="button"
                onClick={openCreateBadge}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d99400]"
              >
                <Plus className="size-4" />
                Create New
              </button>
            </Can>
          ) : (
            <Can permission="stars:create">
              <button
                type="button"
                onClick={openCreateStar}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d99400]"
              >
                <Plus className="size-4" />
                Create New
              </button>
            </Can>
          )
        ) : null}
      </div>

      {/* Tab Switcher */}
      {visibleTabs.length > 1 ? (
        <div className="flex items-center gap-1 rounded-xl bg-[#f3f4f6] p-1 w-fit">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex h-10 items-center justify-center rounded-lg px-6 text-sm font-semibold transition ${
                currentTab === tab.id
                  ? "bg-[#111827] text-white shadow-sm"
                  : "text-[#6b7280] hover:text-[#374151]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      ) : null}

      {/* Badges Tab */}
      {currentTab === "badges" ? (
        <div className="space-y-4">
          {badgesQuery.error ? (
            <p className="text-sm text-[#ef4444]">{badgesQuery.error}</p>
          ) : null}

          <BadgesTable badges={badgesQuery.items} loading={badgesQuery.loading} onEdit={openEditBadge} />
        </div>
      ) : null}

      {/* Stars Tab */}
      {currentTab === "stars" ? (
        <div className="space-y-4">
          {starsQuery.error ? (
            <p className="text-sm text-[#ef4444]">{starsQuery.error}</p>
          ) : null}

          <StarsTable
            rules={starsQuery.items}
            loading={starsQuery.loading}
            onEdit={(s) => { setStarDialogTarget(s); setStarDialogOpen(true); }}
            onDelete={setDeleteTarget}
          />

          <Pagination
            currentPage={starsQuery.pagination.page}
            totalPages={starsQuery.pagination.totalPages}
            onPageChange={starsQuery.goToPage}
          />
        </div>
      ) : null}

      {/* Top Scorer Tab */}
      {currentTab === "top-scorer" ? (
        <div className="space-y-4">
          {topScorersQuery.error ? (
            <p className="text-sm text-[#ef4444]">{topScorersQuery.error}</p>
          ) : null}

          <TopScorersTable
            scorers={topScorersQuery.items}
            loading={topScorersQuery.loading}
            rankOffset={(topScorersQuery.pagination.page - 1) * PAGE_SIZE}
            onToggleFeatured={handleToggleFeatured}
          />

          <Pagination
            currentPage={topScorersQuery.pagination.page}
            totalPages={topScorersQuery.pagination.totalPages}
            onPageChange={topScorersQuery.goToPage}
          />
        </div>
      ) : null}

      {/* Delete Star Confirmation */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Star Rule"
      >
        <p className="text-[15px] text-[#4b5563]">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[#111827]">
            {deleteTarget ? `${deleteTarget.stars_count} Stars (${deleteTarget.criteria})` : ""}
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
            onClick={confirmDelete}
            disabled={deleting}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#ef4444] px-5 text-sm font-semibold text-white transition hover:bg-[#dc2626] disabled:pointer-events-none disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Dialog>

      {/* Badge Dialog */}
      <BadgeDialog
        key={`badge-${badgeDialogMode}-${badgeDialogTarget?.id ?? "new"}-${badgeDialogOpen}`}
        open={badgeDialogOpen}
        onClose={() => setBadgeDialogOpen(false)}
        mode={badgeDialogMode}
        badge={badgeDialogTarget}
        submitting={badgesQuery.mutating}
        onSubmit={handleBadgeSubmit}
      />

      {/* Star Dialog */}
      <StarDialog
        key={`star-${starDialogTarget?.id ?? "new"}-${starDialogOpen}`}
        open={starDialogOpen}
        onClose={() => setStarDialogOpen(false)}
        rule={starDialogTarget}
        submitting={starsQuery.mutating}
        onSubmit={handleStarSubmit}
      />
    </div>
  );
}
