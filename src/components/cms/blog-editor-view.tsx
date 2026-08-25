"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera } from "lucide-react";

import { GalleryModal } from "@/components/cms/gallery-modal";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { TagsInput } from "@/components/ui/tags-input";
import { useBlog } from "@/hooks/cms/use-blog";
import { keywordsToList, keywordsToString } from "@/lib/blog";
import { slugifyPageTitle } from "@/lib/page-content";
import { formatDateTime } from "@/lib/utils";
import type { CreateBlogPayload } from "@/types/blog.types";
import type { MediaItem } from "@/types/media.types";

const textareaClassName =
  "w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 py-3 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0";

const inputClassName =
  "h-[54px] w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0";

type BlogEditorViewProps = {
  blogId: string;
};

type BlogFormState = {
  title: string;
  slug: string;
  authorName: string;
  shortDescription: string;
  longDescription: string;
  metaTitle: string;
  keywords: string[];
  metaDescription: string;
  imageId: number | null;
  imageUrl: string | null;
  authorImageId: number | null;
  authorImageUrl: string | null;
};

const emptyForm: BlogFormState = {
  title: "",
  slug: "",
  authorName: "",
  shortDescription: "",
  longDescription: "",
  metaTitle: "",
  keywords: [],
  metaDescription: "",
  imageId: null,
  imageUrl: null,
  authorImageId: null,
  authorImageUrl: null,
};

type GalleryTarget = "cover" | "author";

function buildCreatePayload(form: BlogFormState): CreateBlogPayload | null {
  const title = form.title.trim();
  const slug = (form.slug || slugifyPageTitle(title)).trim();
  if (!title || !slug) return null;

  const payload: CreateBlogPayload = {
    title,
    slug,
    short_description: form.shortDescription,
    long_description: form.longDescription,
    author_name: form.authorName,
    meta_title: form.metaTitle,
    meta_keyword: keywordsToString(form.keywords),
    meta_description: form.metaDescription,
  };
  if (form.imageId) payload.image_id = form.imageId;
  if (form.authorImageId) payload.author_image_id = form.authorImageId;
  return payload;
}

export function BlogEditorView({ blogId }: BlogEditorViewProps) {
  const router = useRouter();
  const isNew = blogId === "new";
  const numericId = isNew ? null : Number(blogId);
  const invalidId = !isNew && Number.isNaN(numericId);

  const {
    blog,
    revisions,
    loading,
    error,
    saving,
    autosaving,
    mutating,
    createBlog,
    updateBlog,
    autosaveBlog,
    restoreRevision,
    publishBlog,
    unpublishBlog,
    archiveBlog,
    restoreBlog,
  } = useBlog({ blogId: invalidId ? null : numericId });

  const [form, setForm] = useState<BlogFormState>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryTarget, setGalleryTarget] = useState<GalleryTarget>("cover");
  const lastAutosaveKey = useRef<string | null>(null);

  const blogLoaded = useRef(false);

  useEffect(() => {
    if (!blog) return;

    if (!blogLoaded.current) {
      blogLoaded.current = true;
      const nextForm: BlogFormState = {
        title: blog.title ?? "",
        slug: blog.slug ?? "",
        authorName: blog.author_name ?? "",
        shortDescription: blog.short_description ?? "",
        longDescription: blog.long_description ?? "",
        metaTitle: blog.meta_title ?? "",
        keywords: keywordsToList(blog.meta_keyword),
        metaDescription: blog.meta_description ?? "",
        imageId: blog.image?.id ?? null,
        imageUrl: blog.image?.url ?? null,
        authorImageId: blog.author_image?.id ?? null,
        authorImageUrl: blog.author_image?.url ?? null,
      };
      setForm(nextForm);
      setSlugTouched(true);
      lastAutosaveKey.current = JSON.stringify({
        title: nextForm.title,
        slug: nextForm.slug,
        short_description: nextForm.shortDescription,
        long_description: nextForm.longDescription,
        meta_title: nextForm.metaTitle,
        meta_keyword: keywordsToString(nextForm.keywords),
        meta_description: nextForm.metaDescription,
      });
      return;
    }

    setForm((prev) => ({
      ...prev,
      title: blog.title ?? prev.title,
      slug: blog.slug ?? prev.slug,
      authorName: blog.author_name ?? prev.authorName,
      shortDescription: blog.short_description ?? prev.shortDescription,
      longDescription: blog.long_description ?? prev.longDescription,
      metaTitle: blog.meta_title ?? prev.metaTitle,
      keywords: blog.meta_keyword != null ? keywordsToList(blog.meta_keyword) : prev.keywords,
      metaDescription: blog.meta_description ?? prev.metaDescription,
      imageId: blog.image?.id ?? prev.imageId,
      imageUrl: blog.image?.url ?? prev.imageUrl,
      authorImageId: blog.author_image?.id ?? prev.authorImageId,
      authorImageUrl: blog.author_image?.url ?? prev.authorImageUrl,
    }));
  }, [blog]);

  useEffect(() => {
    if (isNew || numericId == null || !blog) return;
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      short_description: form.shortDescription,
      long_description: form.longDescription,
      meta_title: form.metaTitle,
      meta_keyword: keywordsToString(form.keywords),
      meta_description: form.metaDescription,
    };
    if (!payload.title || !payload.slug) return;
    const key = JSON.stringify(payload);
    if (key === lastAutosaveKey.current) return;

    const timer = window.setTimeout(() => {
      void autosaveBlog(numericId, payload).then((ok) => {
        if (ok) lastAutosaveKey.current = key;
      });
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [autosaveBlog, blog, form, isNew, numericId]);

  function update<K extends keyof BlogFormState>(key: K, value: BlogFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function openGallery(target: GalleryTarget) {
    setGalleryTarget(target);
    setGalleryOpen(true);
  }

  function handleSelectMedia(item: MediaItem) {
    if (galleryTarget === "author") {
      setForm((prev) => ({
        ...prev,
        authorImageId: item.id,
        authorImageUrl: item.url,
      }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      imageId: item.id,
      imageUrl: item.url,
    }));
  }

  async function handleSave() {
    const payload = buildCreatePayload(form);
    if (!payload) return;

    if (isNew) {
      const created = await createBlog(payload);
      if (!created) return;
      router.replace(`/blogs/${created.id}`);
      return;
    }

    if (numericId == null) return;
    await updateBlog(numericId, {
      ...payload,
      status: blog?.status ?? "active",
    });
  }

  const busy = saving || mutating;
  const heading = isNew
    ? "Add Blog"
    : `Edit ${blog?.title ?? (form.title || "Blog")}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <button
          type="button"
          onClick={() => router.push("/cms?tab=blogs")}
          className="inline-flex items-center gap-2 text-[22px] font-bold tracking-tight text-[#111827] transition hover:text-[#3b82f6]"
        >
          <ArrowLeft className="size-5" />
          {heading}
        </button>
        <div className="flex flex-wrap items-center gap-2">
          {autosaving ? (
            <span className="text-sm text-[#6b7280]">Saving draft...</span>
          ) : null}
          {!isNew && blog?.status === "archived" ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void restoreBlog()}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:pointer-events-none disabled:opacity-60"
            >
              Restore
            </button>
          ) : null}
          {!isNew && blog && blog.status !== "archived" ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void archiveBlog()}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:pointer-events-none disabled:opacity-60"
            >
              Archive
            </button>
          ) : null}
          {!isNew && blog?.publish_status === "published" ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void unpublishBlog()}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:pointer-events-none disabled:opacity-60"
            >
              Unpublish
            </button>
          ) : null}
          {!isNew && blog && blog.publish_status !== "published" ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void publishBlog()}
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
            {saving ? "Saving..." : isNew ? "Create Blog" : "Save Changes"}
          </button>
        </div>
      </div>

      {invalidId ? (
        <p className="text-sm text-[#ef4444]">This blog id is not valid.</p>
      ) : error ? (
        <p className="text-sm text-[#ef4444]">{error}</p>
      ) : null}

      {invalidId ? null : loading ? (
        <div className="rounded-2xl border border-[#eef1f6] bg-white p-10 text-center text-sm text-[#6b7280] shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
          Loading blog...
        </div>
      ) : !isNew && !blog ? (
        <div className="rounded-2xl border border-dashed border-[#d1d5db] bg-white p-6 text-sm text-[#6b7280]">
          This blog was not found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[30%_70%]">
          <div className="space-y-5">
            <div className="space-y-3">
              <h3 className="text-[16px] font-bold text-[#111827]">Cover Image</h3>
              <div className="relative overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white">
                <div className="relative aspect-1180/600 w-full bg-[#eff6ff]">
                  {form.imageUrl ? (
                    <Image
                      src={form.imageUrl}
                      alt={form.title || "Cover image"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full flex-col items-center justify-center gap-2 text-[#9ca3af]">
                      <Camera className="size-10" />
                      <span className="text-sm">No image selected</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => openGallery("cover")}
                  className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full bg-[#2563eb] text-white shadow-lg transition hover:bg-[#1d4ed8]"
                  aria-label="Choose cover image"
                >
                  <Camera className="size-4" />
                </button>
              </div>
              <p className="text-[12px] text-[#6b7280]">
                Choose an image from the gallery. Recommended size 1180x600px.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-[16px] font-bold text-[#111827]">Author Image</h3>
              <div className="relative w-28 overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white">
                <div className="relative aspect-square w-full bg-[#eff6ff]">
                  {form.authorImageUrl ? (
                    <Image
                      src={form.authorImageUrl}
                      alt={form.authorName || "Author image"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-[#9ca3af]">
                      <Camera className="size-6" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => openGallery("author")}
                  className="absolute bottom-2 right-2 flex size-8 items-center justify-center rounded-full bg-[#2563eb] text-white shadow-lg transition hover:bg-[#1d4ed8]"
                  aria-label="Choose author image"
                >
                  <Camera className="size-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[14px] font-medium text-[#111111]">
                  Title<span className="ml-0.5 text-[#ff0000]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setSlugTouched(true);
                    update("slug", slugifyPageTitle(form.title));
                  }}
                  className="text-[13px] font-semibold text-[#2563eb] transition hover:text-[#1d4ed8]"
                >
                  Make Slug
                </button>
              </div>
              <input
                type="text"
                value={form.title}
                onChange={(event) => {
                  const title = event.target.value;
                  setForm((prev) => ({
                    ...prev,
                    title,
                    slug: slugTouched ? prev.slug : slugifyPageTitle(title),
                  }));
                }}
                className={inputClassName}
                placeholder="Enter blog title"
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <label className="text-[14px] font-medium text-[#111111]">
                Slug<span className="ml-0.5 text-[#ff0000]">*</span>
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  update("slug", event.target.value);
                }}
                className={inputClassName}
                placeholder="Enter slug"
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <label className="text-[14px] font-medium text-[#111111]">
                Author name
              </label>
              <input
                type="text"
                value={form.authorName}
                onChange={(event) => update("authorName", event.target.value)}
                className={inputClassName}
                placeholder="Enter author name"
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <label className="text-[14px] font-medium text-[#111111]">
                Short description
              </label>
              <textarea
                rows={3}
                value={form.shortDescription}
                onChange={(event) => update("shortDescription", event.target.value)}
                className={textareaClassName}
                placeholder="Short summary shown in listings"
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <label className="text-[14px] font-medium text-[#111111]">
                Meta Title
              </label>
              <input
                type="text"
                value={form.metaTitle}
                onChange={(event) => update("metaTitle", event.target.value)}
                className={inputClassName}
                placeholder="Enter meta title"
              />
            </div>

            <TagsInput
              label="Meta Keywords"
              tags={form.keywords}
              onChange={(keywords) => update("keywords", keywords)}
              placeholder="Type keyword and press Enter"
            />

            <div className="flex flex-col gap-2.5">
              <label className="text-[14px] font-medium text-[#111111]">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={form.metaDescription}
                onChange={(event) => update("metaDescription", event.target.value)}
                className={textareaClassName}
                placeholder="Enter meta description"
              />
            </div>

            <RichTextEditor
              label="Long description"
              required
              value={form.longDescription}
              onChange={(value) => update("longDescription", value)}
              placeholder="Start writing your blog..."
            />

            {/* {revisions.length > 0 ? (
              <div className="space-y-3 rounded-xl border border-[#e5e7eb] p-4 max-h-64 overflow-y-auto">
                <h3 className="text-[16px] font-bold text-[#111827]">Revisions</h3>
                <ul className="space-y-2">
                  {revisions.map((revision) => (
                    <li
                      key={revision.id}
                      className="flex items-center justify-between gap-3 rounded-lg bg-[#f9fafb] px-3 py-2"
                    >
                      <span className="text-sm text-[#4b5563]">
                        {revision.title || form.title || "Untitled"} ·{" "}
                        {formatDateTime(revision.created_at)}
                      </span>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void restoreRevision(revision.id)}
                        className="text-[13px] font-semibold text-[#2563eb] transition hover:text-[#1d4ed8] disabled:opacity-60"
                      >
                        Restore
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null} */}
          </div>
        </div>
      )}

      <GalleryModal
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        onSelectMedia={handleSelectMedia}
      />
    </div>
  );
}
