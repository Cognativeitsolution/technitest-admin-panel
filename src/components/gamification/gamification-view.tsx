"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Dialog } from "@/components/ui/dialog";
import { BadgesTable } from "@/components/gamification/badges-table";
import { StarsTable } from "@/components/gamification/stars-table";
import { TopScorersTable } from "@/components/gamification/top-scorers-table";
import { BadgeDialog } from "@/components/gamification/badge-dialog";
import { StarDialog } from "@/components/gamification/star-dialog";
import { TopScorerDialog } from "@/components/gamification/top-scorer-dialog";
import {
  badges as initialBadges,
  starRules as initialStarRules,
  topScorers as initialTopScorers,
} from "@/data/gamification";
import type { GamificationBadge, GamificationTab, StarRule, TopScorer } from "@/data/gamification";

export function GamificationView({ initialTab = "badges" }: { initialTab?: string }) {
  const [activeTab, setActiveTab] = useState<GamificationTab>(
    initialTab === "stars" ? "stars" : initialTab === "top-scorer" ? "top-scorer" : "badges"
  );

  const [badges, setBadges] = useState<GamificationBadge[]>(initialBadges);
  const [starRules, setStarRules] = useState<StarRule[]>(initialStarRules);
  const [topScorers, setTopScorers] = useState<TopScorer[]>(initialTopScorers);

  const [badgeDialogOpen, setBadgeDialogOpen] = useState(false);
  const [badgeDialogMode, setBadgeDialogMode] = useState<"create" | "edit">("edit");
  const [badgeDialogTarget, setBadgeDialogTarget] = useState<GamificationBadge | null>(null);

  const [starDialogOpen, setStarDialogOpen] = useState(false);
  const [starDialogTarget, setStarDialogTarget] = useState<StarRule | null>(null);

  const [scorerDialogOpen, setScorerDialogOpen] = useState(false);
  const [scorerDialogMode, setScorerDialogMode] = useState<"create" | "edit">("edit");
  const [scorerDialogTarget, setScorerDialogTarget] = useState<TopScorer | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{ type: string; item: GamificationBadge | StarRule | TopScorer } | null>(null);

  function openEditBadge(badge: GamificationBadge) {
    setBadgeDialogMode("edit");
    setBadgeDialogTarget(badge);
    setBadgeDialogOpen(true);
  }

  function openCreateBadge() {
    setBadgeDialogMode("create");
    setBadgeDialogTarget(null);
    setBadgeDialogOpen(true);
  }

  function toggleBadgeStatus(id: string, enabled: boolean) {
    setBadges((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: enabled ? "enabled" as const : "disabled" as const } : b
      )
    );
  }

  function openEditStar(rule: StarRule) {
    setStarDialogTarget(rule);
    setStarDialogOpen(true);
  }

  function openEditScorer(ts: TopScorer) {
    setScorerDialogMode("edit");
    setScorerDialogTarget(ts);
    setScorerDialogOpen(true);
  }

  function openCreateScorer() {
    setScorerDialogMode("create");
    setScorerDialogTarget(null);
    setScorerDialogOpen(true);
  }

  function confirmDelete(type: string, item: GamificationBadge | StarRule | TopScorer) {
    setDeleteTarget({ type, item });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    const { type, item } = deleteTarget;
    if (type === "badge") {
      setBadges((prev) => prev.filter((b) => b.id !== item.id));
    } else if (type === "star") {
      setStarRules((prev) => prev.filter((s) => s.id !== item.id));
    } else if (type === "top-scorer") {
      setTopScorers((prev) => prev.filter((ts) => ts.id !== item.id));
    }
    setDeleteTarget(null);
  }

  function deleteItemName() {
    if (!deleteTarget) return "";
    const { type, item } = deleteTarget;
    if (type === "badge") return (item as GamificationBadge).name;
    if (type === "star") return `${(item as StarRule).starCount} Stars`;
    if (type === "top-scorer") return (item as TopScorer).userName;
    return "";
  }

  const tabs = [
    { id: "badges" as const, label: "Badges" },
    { id: "stars" as const, label: "Stars" },
    { id: "top-scorer" as const, label: "Top Scorer" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
          Gamification
        </h1>
        {activeTab === "top-scorer" ? (
          <button
            type="button"
            onClick={openCreateScorer}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d99400]"
          >
            <Plus className="size-4" />
            Create New
          </button>
        ) : null}
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 rounded-xl bg-[#f3f4f6] p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex h-10 items-center justify-center rounded-lg px-6 text-sm font-semibold transition ${
              activeTab === tab.id
                ? "bg-[#111827] text-white shadow-sm"
                : "text-[#6b7280] hover:text-[#374151]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Badges Tab */}
      {activeTab === "badges" ? (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={openCreateBadge}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d99400]"
            >
              <Plus className="size-4" />
              Create New
            </button>
          </div>
          <BadgesTable
            badges={badges}
            onEdit={openEditBadge}
            onDelete={(b) => confirmDelete("badge", b)}
            onToggleStatus={toggleBadgeStatus}
          />
        </div>
      ) : null}

      {/* Stars Tab */}
      {activeTab === "stars" ? (
        <div className="space-y-4">
          <StarsTable
            rules={starRules}
            onEdit={openEditStar}
            onDelete={(s) => confirmDelete("star", s)}
          />
        </div>
      ) : null}

      {/* Top Scorer Tab */}
      {activeTab === "top-scorer" ? (
        <div className="space-y-4">
          <TopScorersTable
            scorers={topScorers}
            onEdit={openEditScorer}
            onDelete={(ts) => confirmDelete("top-scorer", ts)}
          />
        </div>
      ) : null}

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.type === "badge" ? "Badge" : deleteTarget?.type === "star" ? "Star Rule" : "Top Scorer"}`}
      >
        <p className="text-[15px] text-[#4b5563]">
          Are you sure you want to delete <span className="font-semibold text-[#111827]">{deleteItemName()}</span>? This action cannot be undone.
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

      {/* Badge Dialog */}
      <BadgeDialog
        open={badgeDialogOpen}
        onClose={() => setBadgeDialogOpen(false)}
        mode={badgeDialogMode}
        badge={badgeDialogTarget}
      />

      {/* Star Dialog */}
      <StarDialog
        open={starDialogOpen}
        onClose={() => setStarDialogOpen(false)}
        rule={starDialogTarget}
      />

      {/* Top Scorer Dialog */}
      <TopScorerDialog
        open={scorerDialogOpen}
        onClose={() => setScorerDialogOpen(false)}
        mode={scorerDialogMode}
        scorer={scorerDialogTarget}
      />
    </div>
  );
}
