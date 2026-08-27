"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Cloud,
  Heart,
  Languages,
  Plus,
  Star,
  Trash2,
} from "lucide-react";

import { GalleryModal } from "@/components/cms/gallery-modal";
import { Switch } from "@/components/ui/switch";
import { TextField } from "@/components/ui/text-field";
import { usePage } from "@/hooks/cms/use-page";
import {
  contentFromHomepageForm,
  homepageFormFromPage,
  type HomepageFormValues,
} from "@/lib/page-content";
import type { PageDetail } from "@/types/page.types";

const categories = [
  { label: "Health & Wellness", icon: Heart },
  { label: "Language Study", icon: Languages },
  { label: "Management", icon: BookOpen },
  { label: "Cloud Computing", icon: Cloud },
  { label: "Certification", icon: Award },
];

const trending = [
  { title: "BBA", color: "bg-[#7c3aed]" },
  { title: "Healthy Lifestyle", color: "bg-[#2563eb]" },
  { title: "Basics of Computer Science", color: "bg-[#16a34a]" },
];

const textareaClassName =
  "w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 py-3 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0";

type HomepageFormProps = {
  page: PageDetail;
  saving: boolean;
  mutating: boolean;
  onSave: (values: HomepageFormValues) => Promise<boolean>;
  onPublish: () => Promise<boolean>;
  onUnpublish: () => Promise<boolean>;
};

function HomepageForm({
  page,
  saving,
  mutating,
  onSave,
  onPublish,
  onUnpublish,
}: HomepageFormProps) {
  const [form, setForm] = useState<HomepageFormValues>(() =>
    homepageFormFromPage(page),
  );
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [heroImage, setHeroImage] = useState("https://i.pravatar.cc/420?img=12");
  const busy = saving || mutating;

  function update<K extends keyof HomepageFormValues>(
    key: K,
    value: HomepageFormValues[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    await onSave(form);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/cms"
          className="inline-flex items-center gap-2 text-[22px] font-bold tracking-tight text-[#111827] transition hover:text-[#3b82f6]"
        >
          <ArrowLeft className="size-5" />
          Homepage
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {page.publish_status === "published" ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void onUnpublish()}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:pointer-events-none disabled:opacity-60"
            >
              Unpublish
            </button>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => void onPublish()}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#2563eb] px-5 text-sm font-semibold text-[#2563eb] transition hover:bg-[#eff6ff] disabled:pointer-events-none disabled:opacity-60"
            >
              Publish
            </button>
          )}
          <button
            type="button"
            disabled={busy}
            onClick={() => void handleSave()}
            className="inline-flex h-11 w-fit items-center justify-center rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:pointer-events-none disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="space-y-5 rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)] sm:p-6">
        <TextField
          label="Hero Header"
          value={form.heroHeader}
          onChange={(event) => update("heroHeader", event.target.value)}
          inputClassName="text-[#4b5563]"
        />
        <div className="flex flex-col gap-2.5">
          <label className="text-[14px] leading-none font-medium text-[#111111]">
            Hero Text
          </label>
          <textarea
            rows={3}
            value={form.heroText}
            onChange={(event) => update("heroText", event.target.value)}
            className={textareaClassName}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Hero CTA Label"
            value={form.heroCtaLabel}
            onChange={(event) => update("heroCtaLabel", event.target.value)}
            inputClassName="text-[#4b5563]"
          />
          <TextField
            label="Hero CTA Link"
            value={form.heroCtaLink}
            onChange={(event) => update("heroCtaLink", event.target.value)}
            inputClassName="text-[#4b5563]"
          />
        </div>
        <TextField
          label="Categories Header"
          value={form.categoriesHeader}
          onChange={(event) => update("categoriesHeader", event.target.value)}
          inputClassName="text-[#4b5563]"
        />
        <TextField
          label="Achievement Header"
          value={form.achievementHeader}
          onChange={(event) => update("achievementHeader", event.target.value)}
          inputClassName="text-[#4b5563]"
        />
        <div className="flex flex-col gap-2.5">
          <label className="text-[14px] leading-none font-medium text-[#111111]">
            Achievement Text
          </label>
          <textarea
            rows={3}
            value={form.achievementText}
            onChange={(event) => update("achievementText", event.target.value)}
            className={textareaClassName}
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-[#111827]">Stats</h3>
            <button
              type="button"
              onClick={() =>
                update("stats", [...form.stats, { label: "", value: "" }])
              }
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#2563eb] hover:underline"
            >
              <Plus className="size-3.5" />
              Add
            </button>
          </div>
          {form.stats.map((stat, index) => (
            <div key={`stat-${index}`} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <TextField
                label="Label"
                value={stat.label}
                onChange={(event) => {
                  const next = form.stats.map((item, itemIndex) =>
                    itemIndex === index
                      ? { ...item, label: event.target.value }
                      : item,
                  );
                  update("stats", next);
                }}
                inputClassName="text-[#4b5563]"
              />
              <TextField
                label="Value"
                value={stat.value}
                onChange={(event) => {
                  const next = form.stats.map((item, itemIndex) =>
                    itemIndex === index
                      ? { ...item, value: event.target.value }
                      : item,
                  );
                  update("stats", next);
                }}
                inputClassName="text-[#4b5563]"
              />
              <button
                type="button"
                aria-label={`Remove stat ${index + 1}`}
                onClick={() =>
                  update(
                    "stats",
                    form.stats.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                className="mt-7 rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#fef2f2] hover:text-[#ef4444]"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
        <TextField
          label="Steps Header"
          value={form.stepsHeader}
          onChange={(event) => update("stepsHeader", event.target.value)}
          inputClassName="text-[#4b5563]"
        />
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-[#111827]">Steps</h3>
            <button
              type="button"
              onClick={() =>
                update("steps", [...form.steps, { title: "", text: "" }])
              }
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#2563eb] hover:underline"
            >
              <Plus className="size-3.5" />
              Add
            </button>
          </div>
          {form.steps.map((step, index) => (
            <div
              key={`step-${index}`}
              className="space-y-3 rounded-xl border border-[#eef1f6] bg-[#f8fafc] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold tracking-wide text-[#6b7280] uppercase">
                  Step {index + 1}
                </p>
                <button
                  type="button"
                  aria-label={`Remove step ${index + 1}`}
                  onClick={() =>
                    update(
                      "steps",
                      form.steps.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                  className="rounded-lg p-1.5 text-[#9ca3af] transition hover:bg-white hover:text-[#ef4444]"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <TextField
                label="Title"
                value={step.title}
                onChange={(event) => {
                  const next = form.steps.map((item, itemIndex) =>
                    itemIndex === index
                      ? { ...item, title: event.target.value }
                      : item,
                  );
                  update("steps", next);
                }}
                inputClassName="text-[#4b5563]"
              />
              <TextField
                label="Text"
                value={step.text}
                onChange={(event) => {
                  const next = form.steps.map((item, itemIndex) =>
                    itemIndex === index
                      ? { ...item, text: event.target.value }
                      : item,
                  );
                  update("steps", next);
                }}
                inputClassName="text-[#4b5563]"
              />
            </div>
          ))}
        </div>
        <TextField
          label="CTA Header"
          value={form.ctaHeader}
          onChange={(event) => update("ctaHeader", event.target.value)}
          inputClassName="text-[#4b5563]"
        />
        <div className="flex flex-col gap-2.5">
          <label className="text-[14px] leading-none font-medium text-[#111111]">
            CTA Text
          </label>
          <textarea
            rows={3}
            value={form.ctaText}
            onChange={(event) => update("ctaText", event.target.value)}
            className={textareaClassName}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="CTA Label"
            value={form.ctaLabel}
            onChange={(event) => update("ctaLabel", event.target.value)}
            inputClassName="text-[#4b5563]"
          />
          <TextField
            label="CTA Link"
            value={form.ctaLink}
            onChange={(event) => update("ctaLink", event.target.value)}
            inputClassName="text-[#4b5563]"
          />
        </div>
        <TextField
          label="Trending Header"
          value={form.trendingHeader}
          onChange={(event) => update("trendingHeader", event.target.value)}
          inputClassName="text-[#4b5563]"
        />
        <TextField
          label="Hall of Achievers Header"
          value={form.achieversHeader}
          onChange={(event) => update("achieversHeader", event.target.value)}
          inputClassName="text-[#4b5563]"
        />
        <TextField
          label="Testimonials Header"
          value={form.testimonialsHeader}
          onChange={(event) => update("testimonialsHeader", event.target.value)}
          inputClassName="text-[#4b5563]"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Meta Title"
            value={form.metaTitle}
            onChange={(event) => update("metaTitle", event.target.value)}
            inputClassName="text-[#4b5563]"
          />
          <TextField
            label="Meta Keyword"
            value={form.metaKeyword}
            onChange={(event) => update("metaKeyword", event.target.value)}
            inputClassName="text-[#4b5563]"
          />
        </div>
        <div className="flex flex-col gap-2.5">
          <label className="text-[14px] leading-none font-medium text-[#111111]">
            Meta Description
          </label>
          <textarea
            rows={3}
            value={form.metaDescription}
            onChange={(event) => update("metaDescription", event.target.value)}
            className={textareaClassName}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-[#e5e7eb] px-4 py-3">
            <Switch
              checked={form.showInNav}
              onCheckedChange={(checked) => update("showInNav", checked)}
              label="Show in navbar"
            />
          </div>
          <TextField
            label="Nav Label"
            value={form.navLabel}
            onChange={(event) => update("navLabel", event.target.value)}
            inputClassName="text-[#4b5563]"
          />
        </div>
      </div>

      {/* <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-[#111827]">Live Preview</h2>
          <button
            type="button"
            onClick={() => setGalleryOpen(true)}
            className="text-sm font-semibold text-[#2563eb] hover:underline"
          >
            Change Hero Image
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_8px_24px_rgba(16,24,40,0.06)]">
          <section className="grid gap-6 bg-linear-to-br from-[#eff6ff] via-white to-[#f8fafc] p-6 lg:grid-cols-2 lg:p-10">
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
                {form.heroHeader || "Homepage hero"}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#6b7280]">
                {form.heroText}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex h-10 items-center rounded-lg bg-[#2563eb] px-4 text-sm font-semibold text-white"
                >
                  {form.heroCtaLabel || "Start Quiz"}
                </button>
              </div>
            </div>
            <div className="relative mx-auto aspect-4/3 w-full max-w-md overflow-hidden rounded-2xl">
              <Image
                src={heroImage}
                alt="Homepage hero"
                fill
                className="object-cover"
              />
            </div>
          </section>

          <section className="border-t border-[#eef1f6] px-6 py-8">
            <h4 className="mb-5 text-center text-lg font-bold text-[#111827]">
              {form.categoriesHeader || "Categories"}
            </h4>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {categories.map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 rounded-xl bg-[#f8fafc] p-4 text-center"
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-white shadow-sm">
                    <Icon className="size-5 text-[#2563eb]" />
                  </div>
                  <p className="text-xs font-semibold text-[#374151]">{label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 border-t border-[#eef1f6] bg-[#fafbfc] p-6 lg:grid-cols-2 lg:p-10">
            <div className="relative mx-auto aspect-4/3 w-full max-w-sm overflow-hidden rounded-2xl">
              <Image
                src="https://i.pravatar.cc/420?img=33"
                alt="Achievement"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="text-xl font-bold text-[#111827]">
                {form.achievementHeader}
              </h4>
              <p className="mt-2 text-sm text-[#6b7280]">{form.achievementText}</p>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {form.stats.map((stat) => (
                  <div
                    key={`${stat.label}-${stat.value}`}
                    className="rounded-xl bg-white p-3 text-center shadow-sm"
                  >
                    <p className="text-lg font-bold text-[#f0a500]">{stat.value}</p>
                    <p className="text-[11px] text-[#6b7280]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="border-t border-[#eef1f6] px-6 py-8">
            <h4 className="mb-5 text-center text-lg font-bold text-[#111827]">
              {form.stepsHeader}
            </h4>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {form.steps.map((step, index) => (
                <div
                  key={`${step.title}-${index}`}
                  className="rounded-xl border border-[#eef1f6] bg-white p-4 text-center shadow-sm"
                >
                  <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-[#eff6ff] text-sm font-bold text-[#2563eb]">
                    {index + 1}
                  </div>
                  <p className="text-sm font-semibold text-[#111827]">{step.title}</p>
                  <p className="mt-1 text-xs text-[#6b7280]">{step.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mx-6 mb-6 flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#eef2ff] p-6 sm:flex-row sm:items-center">
            <div>
              <h4 className="text-lg font-bold text-[#111827]">{form.ctaHeader}</h4>
              <p className="mt-1 text-sm text-[#6b7280]">{form.ctaText}</p>
            </div>
            <button
              type="button"
              className="inline-flex h-10 shrink-0 items-center rounded-lg bg-[#f0a500] px-4 text-sm font-semibold text-white"
            >
              {form.ctaLabel || "Explore Quizzes"}
            </button>
          </section>

          <section className="border-t border-[#eef1f6] px-6 py-8">
            <h4 className="mb-5 text-lg font-bold text-[#111827]">
              {form.trendingHeader}
            </h4>
            <div className="grid gap-4 sm:grid-cols-3">
              {trending.map((item) => (
                <div
                  key={item.title}
                  className="overflow-hidden rounded-xl border border-[#eef1f6] bg-white shadow-sm"
                >
                  <div className={`${item.color} px-4 py-6 text-center text-sm font-bold text-white`}>
                    {item.title}
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-semibold text-[#111827]">
                      {item.title} Quiz
                    </p>
                    <p className="mt-1 text-xs text-[#6b7280]">
                      Practice questions with instant feedback.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-[#eef1f6] bg-[#fafbfc] px-6 py-8">
            <h4 className="mb-5 text-center text-lg font-bold text-[#111827]">
              {form.achieversHeader}
            </h4>
            <div className="grid gap-4 sm:grid-cols-3">
              {[5, 9, 20].map((img, i) => (
                <div
                  key={img}
                  className="rounded-xl border border-[#eef1f6] bg-white p-4 text-center shadow-sm"
                >
                  <Image
                    src={`https://i.pravatar.cc/120?img=${img}`}
                    alt="Achiever"
                    width={64}
                    height={64}
                    className="mx-auto size-16 rounded-full object-cover"
                  />
                  <p className="mt-3 text-sm font-semibold text-[#111827]">
                    Top Learner {i + 1}
                  </p>
                  <p className="text-xs text-[#6b7280]">Certified Professional</p>
                  <div className="mt-2 flex justify-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, star) => (
                      <Star
                        key={star}
                        className="size-3.5 fill-[#fbbf24] text-[#fbbf24]"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="border-t border-[#eef1f6] px-6 py-8">
            <h4 className="mb-4 text-center text-lg font-bold text-[#111827]">
              {form.testimonialsHeader}
            </h4>
            <div className="mx-auto max-w-2xl rounded-2xl border border-[#eef1f6] bg-white p-6 text-center shadow-sm">
              <CheckCircle2 className="mx-auto size-8 text-[#22c55e]" />
              <p className="mt-3 text-sm leading-relaxed text-[#4b5563]">
                “Technitest helped me prepare faster and earn certificates that
                actually boosted my profile.”
              </p>
              <p className="mt-3 text-sm font-semibold text-[#111827]">
                Amina Khan
              </p>
            </div>
          </section>
        </div>
      </div> */}

      <GalleryModal
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        onSelect={setHeroImage}
      />
    </div>
  );
}

export function HomepageEditorView() {
  const {
    page,
    loading,
    error,
    saving,
    mutating,
    updatePage,
    publishPage,
    unpublishPage,
  } = usePage({ slug: "homepage" });

  async function handleSave(values: HomepageFormValues) {
    if (!page) return false;
    const updated = await updatePage(page.id, {
      title: values.title,
      slug: values.slug,
      content: contentFromHomepageForm(page.content ?? [], values),
      meta_title: values.metaTitle,
      meta_keyword: values.metaKeyword,
      meta_description: values.metaDescription,
      status: page.status,
      show_in_nav: values.showInNav,
      nav_label: values.navLabel,
      nav_order: values.navOrder,
    });
    return Boolean(updated);
  }

  return (
    <div className="space-y-6">
      {loading || !page ? (
        <Link
          href="/cms"
          className="inline-flex items-center gap-2 text-[22px] font-bold tracking-tight text-[#111827] transition hover:text-[#3b82f6]"
        >
          <ArrowLeft className="size-5" />
          Homepage
        </Link>
      ) : null}
      {error ? <p className="text-sm text-[#ef4444]">{error}</p> : null}
      {loading ? (
        <div className="rounded-2xl border border-[#eef1f6] bg-white p-10 text-center text-sm text-[#6b7280] shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
          Loading homepage...
        </div>
      ) : page ? (
        <HomepageForm
          key={`${page.id}-${page.updated_at}`}
          page={page}
          saving={saving}
          mutating={mutating}
          onSave={handleSave}
          onPublish={publishPage}
          onUnpublish={unpublishPage}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-[#d1d5db] bg-white p-6 text-sm text-[#6b7280]">
          Homepage page was not found. Create a page with slug{" "}
          <span className="font-semibold text-[#111827]">homepage</span> first.
        </div>
      )}
    </div>
  );
}
