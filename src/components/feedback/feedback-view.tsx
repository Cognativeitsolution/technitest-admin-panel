"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { Pagination } from "@/components/shared/pagination";
import { CheckboxDropdown } from "@/components/feedback/checkbox-dropdown";
import { WebsiteReviewsTable } from "@/components/feedback/website-reviews-table";
import { UserReviewsTable } from "@/components/feedback/user-reviews-table";
import { FeedbacksTable } from "@/components/feedback/feedbacks-table";
import { AddReviewDialog } from "@/components/feedback/add-review-dialog";
import { SubmitUserFeedbackDialog } from "@/components/feedback/submit-user-feedback-dialog";
import { ReviewMessageDialog } from "@/components/feedback/review-message-dialog";
import { FeedbackAnalysisDialog } from "@/components/feedback/feedback-analysis-dialog";
import { useWebsiteReviews } from "@/hooks/feedback/use-website-reviews";
import { useUserReviews } from "@/hooks/feedback/use-user-reviews";
import { useFeedbackAnalysis } from "@/hooks/feedback/use-feedback-analysis";
import { ratingOptions, sentimentOptions } from "@/data/feedback";
import type { FeedbackTab } from "@/data/feedback";
import type { WebsiteReviewRecord } from "@/types/website-review.types";
import type { FeedbackAnalysisRecord } from "@/types/user-feedback.types";

const featuredOptions = ["Featured", "Not Featured"];
const targetOptions = ["quiz", "question"];
const analysisStatusOptions = ["pending", "completed"];

export function FeedbackView({
  initialTab = "website-reviews",
}: {
  initialTab?: string;
}) {
  const [activeTab, setActiveTab] = useState<FeedbackTab>(
    initialTab === "user-reviews"
      ? "user-reviews"
      : initialTab === "feedbacks"
        ? "feedbacks"
        : "website-reviews",
  );

  const {
    items: websiteReviews,
    pagination: websitePagination,
    loading: websiteLoading,
    error: websiteError,
    mutating: websiteMutating,
    goToPage: goToWebsitePage,
    createReview,
    updateReview,
    toggleFeatured,
  } = useWebsiteReviews({ perPage: 15 });

  const {
    items: userReviews,
    pagination: userPagination,
    loading: userLoading,
    error: userError,
    mutating: userMutating,
    goToPage: goToUserPage,
    submitFeedback,
  } = useUserReviews({ perPage: 15 });

  const {
    items: feedbackItems,
    pagination: feedbackPagination,
    loading: feedbackLoading,
    error: feedbackError,
    goToPage: goToFeedbackPage,
  } = useFeedbackAnalysis({ perPage: 15 });

  const [ratingFilter, setRatingFilter] = useState<string[]>([]);
  const [featuredFilter, setFeaturedFilter] = useState<string[]>([]);
  const [targetFilter, setTargetFilter] = useState<string[]>([]);
  const [sentimentFilter, setSentimentFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [feedbackTargetFilter, setFeedbackTargetFilter] = useState<string[]>([]);

  const [addReviewOpen, setAddReviewOpen] = useState(false);
  const [submitFeedbackOpen, setSubmitFeedbackOpen] = useState(false);
  const [editingReview, setEditingReview] =
    useState<WebsiteReviewRecord | null>(null);
  const [messageDialog, setMessageDialog] = useState<{
    rating?: number;
    message: string;
  } | null>(null);
  const [analysisDialog, setAnalysisDialog] =
    useState<FeedbackAnalysisRecord | null>(null);

  const filteredWebsiteReviews = useMemo(() => {
    return websiteReviews.filter((r) => {
      if (
        ratingFilter.length > 0 &&
        !ratingFilter.includes(`${r.rating} Stars`)
      ) {
        return false;
      }
      if (featuredFilter.includes("Featured") && !featuredFilter.includes("Not Featured")) {
        return r.is_featured;
      }
      if (featuredFilter.includes("Not Featured") && !featuredFilter.includes("Featured")) {
        return !r.is_featured;
      }
      return true;
    });
  }, [websiteReviews, ratingFilter, featuredFilter]);

  const filteredUserReviews = useMemo(() => {
    return userReviews.filter((r) => {
      if (
        ratingFilter.length > 0 &&
        !ratingFilter.includes(`${r.rating} Stars`)
      ) {
        return false;
      }
      if (
        targetFilter.length > 0 &&
        !targetFilter.includes(r.target.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [userReviews, ratingFilter, targetFilter]);

  const filteredFeedbacks = useMemo(() => {
    return feedbackItems.filter((item) => {
      const sentiment = (
        item.sentiment_label ||
        item.sentiment_summary ||
        ""
      ).toLowerCase();
      const status = (item.sentiment_status || "").toLowerCase();

      if (
        sentimentFilter.length > 0 &&
        !sentimentFilter.some((s) => s.toLowerCase() === sentiment)
      ) {
        return false;
      }
      if (
        statusFilter.length > 0 &&
        !statusFilter.some((s) => s.toLowerCase() === status)
      ) {
        return false;
      }
      if (
        feedbackTargetFilter.length > 0 &&
        !feedbackTargetFilter.includes(item.target.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [feedbackItems, sentimentFilter, statusFilter, feedbackTargetFilter]);

  const tabs = [
    { id: "website-reviews" as const, label: "Website Reviews" },
    { id: "user-reviews" as const, label: "User Reviews" },
    { id: "feedbacks" as const, label: "Feedbacks" },
  ];

  async function handleReviewSubmit(input: {
    name: string;
    rating: number;
    message: string;
    image?: File | null;
    video?: File | null;
    isFeatured?: boolean;
  }) {
    if (editingReview) {
      return updateReview({
        reviewId: editingReview.id,
        payload: {
          name: input.name,
          rating: input.rating,
          message: input.message,
        },
        image: input.image,
        video: input.video,
      });
    }

    return createReview({
      payload: {
        name: input.name,
        rating: input.rating,
        message: input.message,
      },
      image: input.image,
      video: input.video,
      isFeatured: input.isFeatured,
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
          Feedback &amp; Reviews
        </h1>
        {activeTab === "website-reviews" ? (
          <button
            type="button"
            onClick={() => {
              setEditingReview(null);
              setAddReviewOpen(true);
            }}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d99400]"
          >
            <Plus className="size-4" />
            Add Review
          </button>
        ) : null}
        {activeTab === "user-reviews" ? (
          <button
            type="button"
            onClick={() => setSubmitFeedbackOpen(true)}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d99400]"
          >
            <Plus className="size-4" />
            Submit Feedback
          </button>
        ) : null}
      </div>

      <div className="flex w-fit items-center gap-1 rounded-xl bg-[#f3f4f6] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              setRatingFilter([]);
              setFeaturedFilter([]);
              setTargetFilter([]);
              setSentimentFilter([]);
              setStatusFilter([]);
              setFeedbackTargetFilter([]);
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

      {activeTab === "website-reviews" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <CheckboxDropdown
              label="By Rating"
              options={ratingOptions}
              selected={ratingFilter}
              onChange={setRatingFilter}
            />
            <CheckboxDropdown
              label="By Featured"
              options={featuredOptions}
              selected={featuredFilter}
              onChange={setFeaturedFilter}
            />
          </div>

          {websiteError ? (
            <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
              {websiteError}
            </div>
          ) : null}

          <WebsiteReviewsTable
            reviews={filteredWebsiteReviews}
            loading={websiteLoading}
            onToggleFeatured={toggleFeatured}
            onEdit={(review) => {
              setEditingReview(review);
              setAddReviewOpen(true);
            }}
            onMessageClick={(r) =>
              setMessageDialog({ rating: r.rating, message: r.message })
            }
          />

          <Pagination
            currentPage={websitePagination.page}
            totalPages={websitePagination.totalPages}
            onPageChange={goToWebsitePage}
          />
        </div>
      ) : null}

      {activeTab === "user-reviews" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <CheckboxDropdown
              label="By Rating"
              options={ratingOptions}
              selected={ratingFilter}
              onChange={setRatingFilter}
            />
            <CheckboxDropdown
              label="By Target"
              options={targetOptions}
              selected={targetFilter}
              onChange={setTargetFilter}
            />
          </div>

          {userError ? (
            <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
              {userError}
            </div>
          ) : null}

          <UserReviewsTable
            reviews={filteredUserReviews}
            loading={userLoading}
            onMessageClick={(r) =>
              setMessageDialog({
                rating: r.rating,
                message: r.content?.trim() || "No message",
              })
            }
          />

          <Pagination
            currentPage={userPagination.page}
            totalPages={userPagination.totalPages}
            onPageChange={goToUserPage}
          />
        </div>
      ) : null}

      {activeTab === "feedbacks" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <CheckboxDropdown
              label="By Target"
              options={targetOptions}
              selected={feedbackTargetFilter}
              onChange={setFeedbackTargetFilter}
            />
            <CheckboxDropdown
              label="Sentiment"
              options={sentimentOptions}
              selected={sentimentFilter}
              onChange={setSentimentFilter}
            />
            <CheckboxDropdown
              label="Status"
              options={analysisStatusOptions}
              selected={statusFilter}
              onChange={setStatusFilter}
            />
          </div>

          {feedbackError ? (
            <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
              {feedbackError}
            </div>
          ) : null}

          <FeedbacksTable
            items={filteredFeedbacks}
            loading={feedbackLoading}
            onMessageClick={setAnalysisDialog}
          />

          <Pagination
            currentPage={feedbackPagination.page}
            totalPages={feedbackPagination.totalPages}
            onPageChange={goToFeedbackPage}
          />
        </div>
      ) : null}

      <AddReviewDialog
        open={addReviewOpen}
        onClose={() => {
          setAddReviewOpen(false);
          setEditingReview(null);
        }}
        review={editingReview}
        submitting={websiteMutating}
        onSubmit={handleReviewSubmit}
      />

      <SubmitUserFeedbackDialog
        open={submitFeedbackOpen}
        onClose={() => setSubmitFeedbackOpen(false)}
        submitting={userMutating}
        onSubmit={submitFeedback}
      />

      <ReviewMessageDialog
        open={!!messageDialog}
        onClose={() => setMessageDialog(null)}
        rating={messageDialog?.rating}
        message={messageDialog?.message ?? ""}
      />

      <FeedbackAnalysisDialog
        open={!!analysisDialog}
        onClose={() => setAnalysisDialog(null)}
        item={analysisDialog}
      />
    </div>
  );
}
