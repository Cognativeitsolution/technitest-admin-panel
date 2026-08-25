"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PageContentEditor } from "@/components/cms/page-content-editor";
import { Switch } from "@/components/ui/switch";
import { TextField } from "@/components/ui/text-field";
import { usePage } from "@/hooks/cms/use-page";
import { emptyPageContent, slugifyPageTitle } from "@/lib/page-content";
import type { PageContentBlock } from "@/types/page.types";

const textareaClassName =
  "w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 py-3 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0";

type PageEditorViewProps = {
  pageId: string;
};

type PageFormState = {
  title: string;
  slug: string;
  content: PageContentBlock[];
  metaTitle: string;
  metaKeyword: string;
  metaDescription: string;
  showInNav: boolean;
  navLabel: string;
  navOrder: string;
};

const emptyForm: PageFormState = {
  title: "",
  slug: "",
  content: emptyPageContent(),
  metaTitle: "",
  metaKeyword: "",
  metaDescription: "",
  showInNav: false,
  navLabel: "",
  navOrder: "0",
};

export function PageEditorView({ pageId }: PageEditorViewProps) {
  const router = useRouter();
  const isNew = pageId === "new";
  const numericId = isNew ? null : Number(pageId);
  const invalidId = !isNew && Number.isNaN(numericId);

  const {
    page,
    loading,
    error,
    saving,
    mutating,
    createPage,
    updatePage,
    publishPage,
    unpublishPage,
    archivePage,
    restorePage,
  } = usePage({ pageId: invalidId ? null : numericId });

  const [form, setForm] = useState<PageFormState>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(!isNew);

  useEffect(() => {
    if (page?.slug === "homepage") {
      router.replace("/cms/homepage");
    }
  }, [page, router]);

  useEffect(() => {
    if (!page || page.slug === "homepage") return;
    setForm({
      title: page.title,
      slug: page.slug,
      content: page.content ?? emptyPageContent(),
      metaTitle: page.meta_title ?? "",
      metaKeyword: page.meta_keyword ?? "",
      metaDescription: page.meta_description ?? "",
      showInNav: page.show_in_nav ?? false,
      navLabel: page.nav_label ?? "",
      navOrder: String(page.nav_order ?? 0),
    });
    setSlugTouched(true);
  }, [page]);

  function update<K extends keyof PageFormState>(key: K, value: PageFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    const title = form.title.trim();
    const slug = (form.slug || slugifyPageTitle(title)).trim();
    if (!title || !slug) return;

    const payload = {
      title,
      slug,
      content: form.content,
      meta_title: form.metaTitle,
      meta_keyword: form.metaKeyword,
      meta_description: form.metaDescription,
      show_in_nav: form.showInNav,
      nav_label: form.navLabel,
      nav_order: Number(form.navOrder) || 0,
    };

    if (isNew) {
      const created = await createPage(payload);
      if (!created) return;
      if (created.slug === "homepage") {
        router.replace("/cms/homepage");
        return;
      }
      router.replace(`/cms/pages/${created.id}`);
      return;
    }

    if (numericId == null) return;
    await updatePage(numericId, {
      ...payload,
      status: page?.status ?? "active",
    });
  }

  const busy = saving || mutating;
  const heading = isNew
    ? "Add New Page"
    : `Edit ${page?.title ?? (form.title || "Page")}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Link
          href="/cms"
          className="inline-flex items-center gap-2 text-[22px] font-bold tracking-tight text-[#111827] transition hover:text-[#3b82f6]"
        >
          <ArrowLeft className="size-5" />
          {heading}
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {!isNew && page?.status === "archived" ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void restorePage()}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:pointer-events-none disabled:opacity-60"
            >
              Restore
            </button>
          ) : null}
          {!isNew && page && page.status !== "archived" ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void archivePage()}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:pointer-events-none disabled:opacity-60"
            >
              Archive
            </button>
          ) : null}
          {!isNew && page?.publish_status === "published" ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void unpublishPage()}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:pointer-events-none disabled:opacity-60"
            >
              Unpublish
            </button>
          ) : null}
          {!isNew && page && page.publish_status !== "published" ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void publishPage()}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#2563eb] px-5 text-sm font-semibold text-[#2563eb] transition hover:bg-[#eff6ff] disabled:pointer-events-none disabled:opacity-60"
            >
              Publish
            </button>
          ) : null}
          <button
            type="button"
            disabled={busy || invalidId}
            onClick={() => void handleSave()}
            className="inline-flex h-11 w-fit items-center justify-center rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:pointer-events-none disabled:opacity-60"
          >
            {saving ? "Saving..." : isNew ? "Create Page" : "Save Changes"}
          </button>
        </div>
      </div>

      {invalidId ? (
        <p className="text-sm text-[#ef4444]">This page id is not valid.</p>
      ) : error ? (
        <p className="text-sm text-[#ef4444]">{error}</p>
      ) : null}

      {invalidId ? null : loading || page?.slug === "homepage" ? (
        <div className="rounded-2xl border border-[#eef1f6] bg-white p-10 text-center text-sm text-[#6b7280] shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
          Loading page...
        </div>
      ) : !isNew && !page ? (
        <div className="rounded-2xl border border-dashed border-[#d1d5db] bg-white p-6 text-sm text-[#6b7280]">
          This page was not found.
        </div>
      ) : (
        <div className="space-y-5">
          <div className="space-y-5 rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)] sm:p-6">
            <TextField
              label="Page Title"
              required
              value={form.title}
              onChange={(event) => {
                const title = event.target.value;
                setForm((prev) => ({
                  ...prev,
                  title,
                  slug: slugTouched ? prev.slug : slugifyPageTitle(title),
                }));
              }}
              inputClassName="text-[#4b5563]"
            />
            <TextField
              label="Page URL"
              required
              value={form.slug}
              onChange={(event) => {
                setSlugTouched(true);
                update("slug", event.target.value);
              }}
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
              <TextField
                label="Nav Order"
                type="number"
                value={form.navOrder}
                onChange={(event) => update("navOrder", event.target.value)}
                inputClassName="text-[#4b5563]"
              />
            </div>
          </div>

          <PageContentEditor
            blocks={form.content}
            onChange={(content) => update("content", content)}
          />
        </div>
      )}
    </div>
  );
}
