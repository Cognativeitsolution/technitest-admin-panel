"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Dialog } from "@/components/ui/dialog";
import { PagesTable } from "@/components/cms/pages-table";
import { AdvertisementsTable } from "@/components/cms/advertisements-table";
import { BlogsTable } from "@/components/cms/blogs-table";
import { AdvertisementDialog } from "@/components/cms/advertisement-dialog";
import { Can } from "@/components/shared/can";
import { Pagination } from "@/components/shared/pagination";
import { DropdownMenu } from "@/components/shared/dropdown-menu";
import { usePermissions } from "@/hooks/use-permissions";
import type { CmsTab } from "@/data/cms";
import { useBanners } from "@/hooks/cms/use-banners";
import { useBlogs } from "@/hooks/cms/use-blogs";
import { usePages } from "@/hooks/cms/use-pages";
import { usePagesDropdown } from "@/hooks/cms/use-pages-dropdown";
import type { Banner, BannerPayload } from "@/types/banner.types";
import { BANNER_STATUS_FILTERS } from "@/types/banner.types";
import type { BlogListItem } from "@/types/blog.types";
import { BLOG_PUBLISH_FILTERS, BLOG_STATUS_FILTERS } from "@/types/blog.types";
import type { PageListItem } from "@/types/page.types";
import { PAGE_PUBLISH_FILTERS, PAGE_STATUS_FILTERS } from "@/types/page.types";

const PAGE_SIZE = 15;
const PUBLISH_PLACEHOLDER = "Publish status";
const STATUS_PLACEHOLDER = "Status";
const PAGE_FILTER_PLACEHOLDER = "Page";

type DeleteTarget =
  | { type: "page"; item: PageListItem }
  | { type: "banner"; item: Banner }
  | { type: "blog"; item: BlogListItem };

function pageEditorPath(page: PageListItem) {
  if (page.slug === "homepage") return "/cms/homepage";
  return `/cms/pages/${page.id}`;
}

export function CmsView({ initialTab = "pages" }: { initialTab?: string }) {
  const router = useRouter();
  const { hasModule } = usePermissions();
  const [activeTab, setActiveTab] = useState<CmsTab>(
    initialTab === "advertisements"
      ? "advertisements"
      : initialTab === "blogs"
        ? "blogs"
        : "pages"
  );

  const tabs: { id: CmsTab; label: string; module: string }[] = [
    { id: "pages" as const, label: "Pages", module: "page" },
    { id: "advertisements" as const, label: "Advertisements", module: "banner" },
    { id: "blogs" as const, label: "Blogs", module: "blog" },
  ];

  const visibleTabs = tabs.filter((tab) => hasModule(tab.module));
  const currentTab: CmsTab | undefined = visibleTabs.some(
    (tab) => tab.id === activeTab,
  )
    ? activeTab
    : (visibleTabs[0]?.id ?? undefined);

  const [publishStatus, setPublishStatus] = useState(PUBLISH_PLACEHOLDER);
  const [status, setStatus] = useState(STATUS_PLACEHOLDER);
  const pagesQuery = usePages({
    perPage: PAGE_SIZE,
    publishStatus:
      publishStatus === PUBLISH_PLACEHOLDER ? undefined : publishStatus,
    status: status === STATUS_PLACEHOLDER ? undefined : status,
    enabled: currentTab === "pages",
  });

  const [bannerStatus, setBannerStatus] = useState(STATUS_PLACEHOLDER);
  const [bannerPageFilter, setBannerPageFilter] = useState(PAGE_FILTER_PLACEHOLDER);
  const pagesDropdown = usePagesDropdown({ enabled: activeTab === "advertisements" });
  const selectedBannerPage = pagesDropdown.items.find(
    (item) => item.title === bannerPageFilter,
  );
  const bannersQuery = useBanners({
    perPage: PAGE_SIZE,
    status: bannerStatus === STATUS_PLACEHOLDER ? undefined : bannerStatus,
    pageId: selectedBannerPage?.id,
    enabled: currentTab === "advertisements",
  });

  const [blogPublishStatus, setBlogPublishStatus] = useState(PUBLISH_PLACEHOLDER);
  const [blogStatus, setBlogStatus] = useState(STATUS_PLACEHOLDER);
  const blogsQuery = useBlogs({
    perPage: PAGE_SIZE,
    publishStatus:
      blogPublishStatus === PUBLISH_PLACEHOLDER ? undefined : blogPublishStatus,
    status: blogStatus === STATUS_PLACEHOLDER ? undefined : blogStatus,
    enabled: currentTab === "blogs",
  });

  const [adDialogOpen, setAdDialogOpen] = useState(false);
  const [adDialogMode, setAdDialogMode] = useState<"create" | "edit">("edit");
  const [adDialogTarget, setAdDialogTarget] = useState<Banner | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  function openCreateBanner() {
    setAdDialogMode("create");
    setAdDialogTarget(null);
    setAdDialogOpen(true);
  }

  function openEditBanner(banner: Banner) {
    setAdDialogMode("edit");
    setAdDialogTarget(banner);
    setAdDialogOpen(true);
  }

  function handleEditPage(page: PageListItem) {
    router.push(pageEditorPath(page));
  }

  function confirmDelete(target: DeleteTarget) {
    setDeleteTarget(target);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    if (deleteTarget.type === "page") {
      const deleted = await pagesQuery.deletePage(deleteTarget.item.id);
      if (deleted) setDeleteTarget(null);
      return;
    }
    if (deleteTarget.type === "banner") {
      const deleted = await bannersQuery.deleteBanner(deleteTarget.item.id);
      if (deleted) setDeleteTarget(null);
      return;
    }
    const deleted = await blogsQuery.deleteBlog(deleteTarget.item.id);
    if (deleted) setDeleteTarget(null);
  }

  async function handleBannerSubmit(payload: BannerPayload, image: File | null) {
    if (adDialogMode === "create") {
      return bannersQuery.createBanner(payload, image);
    }
    if (!adDialogTarget) return false;
    return bannersQuery.updateBanner(adDialogTarget.id, payload, image);
  }

  function deleteItemName() {
    if (!deleteTarget) return "";
    return deleteTarget.item.title;
  }

  const addButtonLabel =
    currentTab === "pages"
      ? "Add New Page"
      : currentTab === "advertisements"
        ? "Add New Banner"
        : currentTab === "blogs"
          ? "Add Blog"
          : "";

  function handleAdd() {
    if (currentTab === "pages") {
      router.push("/cms/pages/new");
      return;
    }
    if (currentTab === "advertisements") {
      openCreateBanner();
      return;
    }
    if (currentTab === "blogs") {
      router.push("/blogs/new");
    }
  }

  const deleting =
    deleteTarget?.type === "page"
      ? pagesQuery.mutating
      : deleteTarget?.type === "banner"
        ? bannersQuery.mutating
        : deleteTarget?.type === "blog"
          ? blogsQuery.mutating
          : false;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
          Content Management CMS
        </h1>
        <Can
          permission={
            currentTab === "pages"
              ? "page:create"
              : currentTab === "advertisements"
                ? "banner:create"
                : "blog:create"
          }
        >
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex h-11 w-fit items-center gap-2 rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d99400]"
          >
            <Plus className="size-4" />
            {addButtonLabel}
          </button>
        </Can>
      </div>

      {visibleTabs.length > 1 ? (
        <div className="flex w-fit items-center gap-1 rounded-xl bg-[#f3f4f6] p-1">
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

      {currentTab ? null : (
        <p className="rounded-2xl border border-[#e8ecf2] bg-white p-6 text-sm text-[#6b7280]">
          You do not have access to any content section.
        </p>
      )}

      {currentTab === "pages" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <DropdownMenu
              label="Publish status"
              value={publishStatus}
              onChange={(value) => {
                setPublishStatus(value);
                pagesQuery.goToPage(1);
              }}
              options={[PUBLISH_PLACEHOLDER, ...PAGE_PUBLISH_FILTERS]}
            />
            <DropdownMenu
              label="Status"
              value={status}
              onChange={(value) => {
                setStatus(value);
                pagesQuery.goToPage(1);
              }}
              options={[STATUS_PLACEHOLDER, ...PAGE_STATUS_FILTERS]}
            />
          </div>
          {pagesQuery.error ? (
            <p className="text-sm text-[#ef4444]">{pagesQuery.error}</p>
          ) : null}
          <PagesTable
            pages={pagesQuery.items}
            loading={pagesQuery.loading}
            onPreview={handleEditPage}
            onEdit={handleEditPage}
            onDelete={(page) => confirmDelete({ type: "page", item: page })}
          />
          <Pagination
            currentPage={pagesQuery.pagination.page}
            totalPages={pagesQuery.pagination.totalPages}
            onPageChange={pagesQuery.goToPage}
          />
        </div>
      ) : null}

      {currentTab === "advertisements" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <DropdownMenu
              label="Status"
              value={bannerStatus}
              onChange={(value) => {
                setBannerStatus(value);
                bannersQuery.goToPage(1);
              }}
              options={[STATUS_PLACEHOLDER, ...BANNER_STATUS_FILTERS]}
            />
            <DropdownMenu
              label="Page"
              value={bannerPageFilter}
              onChange={(value) => {
                setBannerPageFilter(value);
                bannersQuery.goToPage(1);
              }}
              options={[
                PAGE_FILTER_PLACEHOLDER,
                ...pagesDropdown.items.map((item) => item.title),
              ]}
              searchable
            />
          </div>
          {bannersQuery.error ? (
            <p className="text-sm text-[#ef4444]">{bannersQuery.error}</p>
          ) : null}
          <AdvertisementsTable
            banners={bannersQuery.items}
            loading={bannersQuery.loading}
            onEdit={openEditBanner}
            onDelete={(banner) => confirmDelete({ type: "banner", item: banner })}
            onRestore={(banner) => void bannersQuery.restoreBanner(banner.id)}
          />
          <Pagination
            currentPage={bannersQuery.pagination.page}
            totalPages={bannersQuery.pagination.totalPages}
            onPageChange={bannersQuery.goToPage}
          />
        </div>
      ) : null}

      {currentTab === "blogs" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <DropdownMenu
              label="Publish status"
              value={blogPublishStatus}
              onChange={(value) => {
                setBlogPublishStatus(value);
                blogsQuery.goToPage(1);
              }}
              options={[PUBLISH_PLACEHOLDER, ...BLOG_PUBLISH_FILTERS]}
            />
            <DropdownMenu
              label="Status"
              value={blogStatus}
              onChange={(value) => {
                setBlogStatus(value);
                blogsQuery.goToPage(1);
              }}
              options={[STATUS_PLACEHOLDER, ...BLOG_STATUS_FILTERS]}
            />
          </div>
          {blogsQuery.error ? (
            <p className="text-sm text-[#ef4444]">{blogsQuery.error}</p>
          ) : null}
          <BlogsTable
            blogs={blogsQuery.items}
            loading={blogsQuery.loading}
            onPreview={(blog) => router.push(`/blogs/${blog.id}`)}
            onEdit={(blog) => router.push(`/blogs/${blog.id}`)}
            onDelete={(blog) => confirmDelete({ type: "blog", item: blog })}
            onRestore={(blog) => void blogsQuery.restoreBlog(blog.id)}
          />
          <Pagination
            currentPage={blogsQuery.pagination.page}
            totalPages={blogsQuery.pagination.totalPages}
            onPageChange={blogsQuery.goToPage}
          />
        </div>
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
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleDelete()}
            disabled={deleting}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#ef4444] px-5 text-sm font-semibold text-white transition hover:bg-[#dc2626] disabled:pointer-events-none disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Dialog>

      <AdvertisementDialog
        key={`banner-${adDialogMode}-${adDialogTarget?.id ?? "new"}-${adDialogOpen}`}
        open={adDialogOpen}
        onClose={() => setAdDialogOpen(false)}
        mode={adDialogMode}
        banner={adDialogTarget}
        submitting={bannersQuery.mutating}
        onSubmit={handleBannerSubmit}
      />
    </div>
  );
}
