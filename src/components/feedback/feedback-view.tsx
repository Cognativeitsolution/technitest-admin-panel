"use client";

import { useState } from "react";
import { Plus, Trash2, CheckCircle } from "lucide-react";

import { Dialog } from "@/components/ui/dialog";
import { CheckboxDropdown } from "@/components/feedback/checkbox-dropdown";
import { WebsiteReviewsTable } from "@/components/feedback/website-reviews-table";
import { UserReviewsTable } from "@/components/feedback/user-reviews-table";
import { FeedbacksTable } from "@/components/feedback/feedbacks-table";
import { AddReviewDialog } from "@/components/feedback/add-review-dialog";
import { ReviewMessageDialog } from "@/components/feedback/review-message-dialog";
import {
  websiteReviews as initialWebsiteReviews,
  userReviews as initialUserReviews,
  feedbackItems as initialFeedbacks,
  ratingOptions,
  statusOptions,
  sentimentOptions,
  quizNameOptions,
  pageOptions,
} from "@/data/feedback";
import type { FeedbackTab, WebsiteReview, UserReview, FeedbackItem } from "@/data/feedback";

export function FeedbackView({ initialTab = "website-reviews" }: { initialTab?: string }) {
  const [activeTab, setActiveTab] = useState<FeedbackTab>(
    initialTab === "user-reviews" ? "user-reviews" : initialTab === "feedbacks" ? "feedbacks" : "website-reviews"
  );

  const [websiteReviews, setWebsiteReviews] = useState<WebsiteReview[]>(initialWebsiteReviews);
  const [userReviews, setUserReviews] = useState<UserReview[]>(initialUserReviews);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(initialFeedbacks);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [sentimentFilter, setSentimentFilter] = useState<string[]>([]);
  const [quizFilter, setQuizFilter] = useState<string[]>([]);
  const [pageFilter, setPageFilter] = useState<string[]>([]);

  const [addReviewOpen, setAddReviewOpen] = useState(false);
  const [messageDialog, setMessageDialog] = useState<{ rating?: number; message: string } | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  function handleSelectAll(checked: boolean) {
    if (checked) {
      const current = activeTab === "website-reviews" ? filteredWebsiteReviews : filteredUserReviews;
      setSelectedIds(current.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  }

  function handleSelectRow(id: string, checked: boolean) {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  }

  function toggleActive(id: string, active: boolean) {
    setWebsiteReviews((prev) => prev.map((r) => r.id === id ? { ...r, active } : r));
    setUserReviews((prev) => prev.map((r) => r.id === id ? { ...r, active } : r));
  }

  function handleMarkResolved(id: string) {
    setFeedbacks((prev) => prev.map((f) => f.id === id ? { ...f, status: "Approved" as const } : f));
  }

  function handleApproveAll() {
    setWebsiteReviews((prev) =>
      prev.map((r) => selectedIds.includes(r.id) ? { ...r, status: "Approved" as const, active: true } : r)
    );
    setUserReviews((prev) =>
      prev.map((r) => selectedIds.includes(r.id) ? { ...r, status: "Approved" as const, active: true } : r)
    );
    setSelectedIds([]);
  }

  function handleDeleteAll() {
    setWebsiteReviews((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
    setUserReviews((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
    setSelectedIds([]);
    setDeleteConfirmOpen(false);
  }

  const filteredWebsiteReviews = websiteReviews.filter((r) => {
    if (ratingFilter.length > 0 && !ratingFilter.includes(`${r.rating} Stars`)) return false;
    if (statusFilter.length > 0 && !statusFilter.includes(r.status === "Approved" ? "Active" : "Inactive")) return false;
    return true;
  });

  const filteredUserReviews = userReviews.filter((r) => {
    if (ratingFilter.length > 0 && !ratingFilter.includes(`${r.rating} Stars`)) return false;
    if (statusFilter.length > 0 && !statusFilter.includes(r.status === "Approved" ? "Active" : "Inactive")) return false;
    return true;
  });

  const filteredFeedbacks = feedbacks.filter((f) => {
    if (quizFilter.length > 0 && !quizFilter.includes(f.pageQuiz)) return false;
    if (sentimentFilter.length > 0 && !sentimentFilter.includes(f.sentiment)) return false;
    if (pageFilter.length > 0 && !pageFilter.includes(f.pageQuiz)) return false;
    return true;
  });

  const tabs = [
    { id: "website-reviews" as const, label: "Website Reviews" },
    { id: "user-reviews" as const, label: "User Reviews" },
    { id: "feedbacks" as const, label: "Feedbacks" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
          Feedback &amp; Reviews
        </h1>
        {activeTab !== "feedbacks" ? (
          <button
            type="button"
            onClick={() => setAddReviewOpen(true)}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d99400]"
          >
            <Plus className="size-4" />
            Add Review
          </button>
        ) : null}
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 rounded-xl bg-[#f3f4f6] p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedIds([]);
            }}
            className={`inline-flex h-10 items-center justify-center rounded-lg px-5 text-sm font-semibold transition ${
              activeTab === tab.id
                ? "bg-[#111827] text-white shadow-sm"
                : "text-[#6b7280] hover:text-[#374151]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Website Reviews Tab */}
      {activeTab === "website-reviews" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <CheckboxDropdown label="By Rating" options={ratingOptions} selected={ratingFilter} onChange={setRatingFilter} />
            <CheckboxDropdown label="By Status" options={statusOptions} selected={statusFilter} onChange={setStatusFilter} />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => { if (selectedIds.length > 0) setDeleteConfirmOpen(true); }}
              disabled={selectedIds.length === 0}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#ef4444] px-4 text-sm font-semibold text-white transition hover:bg-[#dc2626] disabled:pointer-events-none disabled:opacity-40"
            >
              <Trash2 className="size-4" />
              Delete All
            </button>
            <button
              type="button"
              onClick={handleApproveAll}
              disabled={selectedIds.length === 0}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#2563eb] px-4 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:pointer-events-none disabled:opacity-40"
            >
              <CheckCircle className="size-4" />
              Approve All
            </button>
          </div>
          <WebsiteReviewsTable
            reviews={filteredWebsiteReviews}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            onToggleActive={toggleActive}
            onMessageClick={(r) => setMessageDialog({ rating: r.rating, message: r.message })}
          />
        </div>
      ) : null}

      {/* User Reviews Tab */}
      {activeTab === "user-reviews" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <CheckboxDropdown label="By Rating" options={ratingOptions} selected={ratingFilter} onChange={setRatingFilter} />
            <CheckboxDropdown label="By Status" options={statusOptions} selected={statusFilter} onChange={setStatusFilter} />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => { if (selectedIds.length > 0) setDeleteConfirmOpen(true); }}
              disabled={selectedIds.length === 0}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#ef4444] px-4 text-sm font-semibold text-white transition hover:bg-[#dc2626] disabled:pointer-events-none disabled:opacity-40"
            >
              <Trash2 className="size-4" />
              Delete All
            </button>
            <button
              type="button"
              onClick={handleApproveAll}
              disabled={selectedIds.length === 0}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#2563eb] px-4 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:pointer-events-none disabled:opacity-40"
            >
              <CheckCircle className="size-4" />
              Approve All
            </button>
          </div>
          <UserReviewsTable
            reviews={filteredUserReviews}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            onToggleActive={toggleActive}
            onMessageClick={(r) => setMessageDialog({ rating: r.rating, message: r.message })}
          />
        </div>
      ) : null}

      {/* Feedbacks Tab */}
      {activeTab === "feedbacks" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <CheckboxDropdown label="Quiz Name" options={quizNameOptions} selected={quizFilter} onChange={setQuizFilter} />
            <CheckboxDropdown label="Page" options={pageOptions} selected={pageFilter} onChange={setPageFilter} />
            <CheckboxDropdown label="Sentiment" options={sentimentOptions} selected={sentimentFilter} onChange={setSentimentFilter} />
          </div>
          <FeedbacksTable
            items={filteredFeedbacks}
            onMarkResolved={handleMarkResolved}
            onMessageClick={(f) => setMessageDialog({ message: f.message })}
          />
        </div>
      ) : null}

      {/* Delete Confirmation */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete Reviews"
      >
        <p className="text-[15px] text-[#4b5563]">
          Are you sure you want to delete <span className="font-semibold text-[#111827]">{selectedIds.length} selected review{selectedIds.length !== 1 ? "s" : ""}</span>? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeleteConfirmOpen(false)}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteAll}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#ef4444] px-5 text-sm font-semibold text-white transition hover:bg-[#dc2626]"
          >
            Delete
          </button>
        </div>
      </Dialog>

      {/* Add Review Dialog */}
      <AddReviewDialog open={addReviewOpen} onClose={() => setAddReviewOpen(false)} />

      {/* Review Message Dialog */}
      <ReviewMessageDialog
        open={!!messageDialog}
        onClose={() => setMessageDialog(null)}
        rating={messageDialog?.rating}
        message={messageDialog?.message ?? ""}
      />
    </div>
  );
}
