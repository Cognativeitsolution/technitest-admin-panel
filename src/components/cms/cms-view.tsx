"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Dialog } from "@/components/ui/dialog";
import { PagesTable } from "@/components/cms/pages-table";
import { AdvertisementsTable } from "@/components/cms/advertisements-table";
import { BlogsTable } from "@/components/cms/blogs-table";
import { AdvertisementDialog } from "@/components/cms/advertisement-dialog";
import {
  cmsPages as initialPages,
  advertisementBanners as initialBanners,
  blogPosts as initialBlogs,
} from "@/data/cms";
import type { CmsTab, CmsPage, AdvertisementBanner, BlogPost } from "@/data/cms";

export function CmsView({ initialTab = "pages" }: { initialTab?: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CmsTab>(
    initialTab === "advertisements"
      ? "advertisements"
      : initialTab === "blogs"
        ? "blogs"
        : "pages"
  );

  const [pages] = useState<CmsPage[]>(initialPages);
  const [banners, setBanners] = useState<AdvertisementBanner[]>(initialBanners);
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);

  const [adDialogOpen, setAdDialogOpen] = useState(false);
  const [adDialogMode, setAdDialogMode] = useState<"create" | "edit">("edit");
  const [adDialogTarget, setAdDialogTarget] = useState<AdvertisementBanner | null>(
    null
  );

  const [deleteTarget, setDeleteTarget] = useState<{
    type: string;
    item: CmsPage | AdvertisementBanner | BlogPost;
  } | null>(null);

  function openCreateBanner() {
    setAdDialogMode("create");
    setAdDialogTarget(null);
    setAdDialogOpen(true);
  }

  function openEditBanner(banner: AdvertisementBanner) {
    setAdDialogMode("edit");
    setAdDialogTarget(banner);
    setAdDialogOpen(true);
  }

  function handleEditPage(page: CmsPage) {
    if (page.slug === "/homepage" || page.title === "Homepage") {
      router.push("/cms/homepage");
      return;
    }
    router.push(`/cms/pages/${page.id}`);
  }

  function confirmDelete(
    type: string,
    item: CmsPage | AdvertisementBanner | BlogPost
  ) {
    setDeleteTarget({ type, item });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    const { type, item } = deleteTarget;
    if (type === "banner") {
      setBanners((prev) => prev.filter((b) => b.id !== item.id));
    } else if (type === "blog") {
      setBlogs((prev) => prev.filter((b) => b.id !== item.id));
    }
    setDeleteTarget(null);
  }

  function deleteItemName() {
    if (!deleteTarget) return "";
    const { type, item } = deleteTarget;
    if (type === "page") return (item as CmsPage).title;
    if (type === "banner") return (item as AdvertisementBanner).title;
    if (type === "blog") return (item as BlogPost).title;
    return "";
  }

  const tabs = [
    { id: "pages" as const, label: "Pages" },
    { id: "advertisements" as const, label: "Advertisements" },
    { id: "blogs" as const, label: "Blogs" },
  ];

  const addButtonLabel =
    activeTab === "pages"
      ? "Add New Page"
      : activeTab === "advertisements"
        ? "Add New Banner"
        : "Add Blog";

  function handleAdd() {
    if (activeTab === "pages") {
      router.push("/cms/homepage");
      return;
    }
    if (activeTab === "advertisements") {
      openCreateBanner();
      return;
    }
    router.push("/blogs/new");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
          Content Management CMS
        </h1>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex h-11 w-fit items-center gap-2 rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d99400]"
        >
          <Plus className="size-4" />
          {addButtonLabel}
        </button>
      </div>

      <div className="flex w-fit items-center gap-1 rounded-xl bg-[#f3f4f6] p-1">
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

      {activeTab === "pages" ? (
        <PagesTable
          pages={pages}
          onPreview={handleEditPage}
          onEdit={handleEditPage}
          onDelete={(p) => confirmDelete("page", p)}
        />
      ) : null}

      {activeTab === "advertisements" ? (
        <AdvertisementsTable
          banners={banners}
          onEdit={openEditBanner}
          onDelete={(b) => confirmDelete("banner", b)}
        />
      ) : null}

      {activeTab === "blogs" ? (
        <BlogsTable
          blogs={blogs}
          onPreview={(b) => router.push(`/blogs/${b.id}`)}
          onDelete={(b) => confirmDelete("blog", b)}
        />
      ) : null}

      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={`Delete ${
          deleteTarget?.type === "page"
            ? "Page"
            : deleteTarget?.type === "banner"
              ? "Banner"
              : "Blog"
        }`}
      >
        <p className="text-[15px] text-[#4b5563]">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[#111827]">{deleteItemName()}</span>
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

      <AdvertisementDialog
        open={adDialogOpen}
        onClose={() => setAdDialogOpen(false)}
        mode={adDialogMode}
        banner={adDialogTarget}
      />
    </div>
  );
}
