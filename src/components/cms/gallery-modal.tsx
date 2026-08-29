"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Upload, X } from "lucide-react";

import { Pagination } from "@/components/shared/pagination";
import { Can } from "@/components/shared/can";
import { useMedia } from "@/hooks/cms/use-media";
import { mediaNameFromFile } from "@/lib/media";
import { cn } from "@/lib/utils";
import type { MediaItem } from "@/types/media.types";

type GalleryModalProps = {
  open: boolean;
  onClose: () => void;
  onSelect?: (url: string) => void;
  onSelectMedia?: (item: MediaItem) => void;
};

const inputClassName =
  "h-10 w-full rounded-lg border border-[#e5e7eb] bg-white px-3 text-sm text-[#374151] outline-none";

export function GalleryModal({
  open,
  onClose,
  onSelect,
  onSelectMedia,
}: GalleryModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [alt, setAlt] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const {
    items,
    pagination,
    loading,
    error,
    mutating,
    goToPage,
    uploadMedia,
    updateMedia,
    deleteMedia,
  } = useMedia({ perPage: 15, enabled: open });

  useEffect(() => {
    if (!open) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelectedId(null);
      setDeleteConfirm(false);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      [item.name, item.alt, item.folder, item.url].some((value) =>
        value.toLowerCase().includes(q),
      ),
    );
  }, [items, query]);

  const selected =
    filtered.find((item) => item.id === selectedId) ?? filtered[0] ?? null;

  useEffect(() => {
    if (!selected) {
      setName("");
      setAlt("");
      return;
    }
    setSelectedId(selected.id);
    setName(selected.name ?? "");
    setAlt(selected.alt ?? "");
    setDeleteConfirm(false);
  }, [selected?.id, selected?.name, selected?.alt]);

  async function handleUpload(file: File | null) {
    if (!file) return;
    const label = mediaNameFromFile(file);
    const created = await uploadMedia({ file, name: label, alt: label });
    if (created && typeof created !== "boolean") {
      setSelectedId(created.id);
      goToPage(1);
    }
  }

  async function handleSaveDetails() {
    if (!selected) return;
    await updateMedia(selected.id, { name: name.trim(), alt: alt.trim() });
  }

  async function handleDelete() {
    if (!selected) return;
    const deleted = await deleteMedia(selected.id);
    if (deleted) {
      setSelectedId(null);
      setDeleteConfirm(false);
    }
  }

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(16,24,40,0.2)] md:flex-row">
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-5">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold text-[#111827]">Gallery</h3>
            <div className="relative min-w-45 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#9ca3af]" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="h-10 w-full rounded-lg border border-[#e5e7eb] bg-white pr-3 pl-9 text-sm outline-none"
              />
            </div>
            <Can permission="media:create">
              <button
                type="button"
                disabled={mutating}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#f0a500] px-3 text-sm font-semibold text-white disabled:pointer-events-none disabled:opacity-60"
              >
                <Upload className="size-4" />
                {mutating ? "Uploading..." : "Upload File"}
              </button>
            </Can>
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.webp,.gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                e.target.value = "";
                void handleUpload(file);
              }}
            />
            <button
              type="button"
              aria-label="Close gallery"
              onClick={onClose}
              className="rounded-lg p-2 text-[#6b7280] hover:bg-[#f3f4f6] md:hidden"
            >
              <X className="size-5" />
            </button>
          </div>

          {error ? (
            <p className="mb-3 text-sm text-[#ef4444]">{error}</p>
          ) : null}

          {loading ? (
            <p className="py-10 text-center text-sm text-[#6b7280]">
              Loading media...
            </p>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {filtered.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={cn(
                      "overflow-hidden rounded-xl border-2 transition",
                      selected?.id === item.id
                        ? "border-[#2563eb]"
                        : "border-transparent",
                    )}
                  >
                    <Image
                      src={item.url}
                      alt={item.alt || item.name}
                      width={160}
                      height={120}
                      className="h-24 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
              {filtered.length === 0 ? (
                <p className="py-10 text-center text-sm text-[#6b7280]">
                  No media found.
                </p>
              ) : null}
              <div className="mt-4">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={goToPage}
                />
              </div>
            </>
          )}
        </div>

        <PreviewPanel
          selected={selected}
          name={name}
          alt={alt}
          mutating={mutating}
          deleteConfirm={deleteConfirm}
          onNameChange={setName}
          onAltChange={setAlt}
          onSaveDetails={() => void handleSaveDetails()}
          onKeep={() => {
            if (!selected) return;
            onSelectMedia?.(selected);
            onSelect?.(selected.url);
            onClose();
          }}
          onReplace={() => fileInputRef.current?.click()}
          onAskDelete={() => setDeleteConfirm(true)}
          onCancelDelete={() => setDeleteConfirm(false)}
          onConfirmDelete={() => void handleDelete()}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

type PreviewPanelProps = {
  selected: MediaItem | null;
  name: string;
  alt: string;
  mutating: boolean;
  deleteConfirm: boolean;
  onNameChange: (value: string) => void;
  onAltChange: (value: string) => void;
  onSaveDetails: () => void;
  onKeep: () => void;
  onReplace: () => void;
  onAskDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  onClose: () => void;
};

function PreviewPanel({
  selected,
  name,
  alt,
  mutating,
  deleteConfirm,
  onNameChange,
  onAltChange,
  onSaveDetails,
  onKeep,
  onReplace,
  onAskDelete,
  onCancelDelete,
  onConfirmDelete,
  onClose,
}: PreviewPanelProps) {
  return (
    <div className="w-full border-t border-[#eef1f6] p-5 md:w-70 md:border-t-0 md:border-l">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-[#374151]">Preview</p>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="hidden rounded-lg p-1.5 text-[#6b7280] hover:bg-[#f3f4f6] md:inline-flex"
        >
          <X className="size-4" />
        </button>
      </div>
      {selected ? (
        <Image
          src={selected.url}
          alt={selected.alt || selected.name}
          width={240}
          height={280}
          className="mb-4 h-56 w-full rounded-xl object-cover"
        />
      ) : (
        <div className="mb-4 flex h-56 w-full items-center justify-center rounded-xl bg-[#f3f4f6] text-sm text-[#9ca3af]">
          No image selected
        </div>
      )}
      <div className="mb-4 space-y-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#6b7280]">Name</label>
          <input
            type="text"
            maxLength={100}
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            disabled={!selected || mutating}
            className={inputClassName}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#6b7280]">Alt text</label>
          <input
            type="text"
            maxLength={100}
            value={alt}
            onChange={(e) => onAltChange(e.target.value)}
            disabled={!selected || mutating}
            className={inputClassName}
          />
        </div>
        <Can permission="media:update">
          <button
            type="button"
            disabled={!selected || mutating}
            onClick={onSaveDetails}
            className="text-sm font-semibold text-[#2563eb] hover:underline disabled:pointer-events-none disabled:opacity-50"
          >
            Save details
          </button>
        </Can>
      </div>
      <div className="flex flex-col gap-2">
        {deleteConfirm ? (
          <>
            <p className="text-sm text-[#4b5563]">Delete this file?</p>
            <Can permission="media:delete">
            <button
              type="button"
              disabled={mutating}
              onClick={onConfirmDelete}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#ef4444] text-sm font-semibold text-white disabled:pointer-events-none disabled:opacity-60"
            >
              {mutating ? "Deleting..." : "Delete"}
            </button>
          </Can>
            <button
              type="button"
              onClick={onCancelDelete}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e5e7eb] text-sm font-semibold text-[#374151]"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              disabled={!selected}
              onClick={onKeep}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#2563eb] text-sm font-semibold text-white disabled:pointer-events-none disabled:opacity-50"
            >
              Keep Image
            </button>
            <Can permission="media:create">
              <button
                type="button"
                disabled={mutating}
                onClick={onReplace}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-[#2563eb] text-sm font-semibold text-[#2563eb] disabled:pointer-events-none disabled:opacity-60"
              >
                Replace Image
              </button>
            </Can>
            <Can permission="media:delete">
              <button
                type="button"
                disabled={!selected || mutating}
                onClick={onAskDelete}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-[#ef4444] text-sm font-semibold text-[#ef4444] disabled:pointer-events-none disabled:opacity-50"
              >
                Delete
              </button>
            </Can>
          </>
        )}
      </div>
    </div>
  );
}
