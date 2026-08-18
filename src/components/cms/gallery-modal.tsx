"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Search, Upload, X } from "lucide-react";

import { cn } from "@/lib/utils";

const galleryImages = [
  "https://i.pravatar.cc/240?img=1",
  "https://i.pravatar.cc/240?img=5",
  "https://i.pravatar.cc/240?img=8",
  "https://i.pravatar.cc/240?img=11",
  "https://i.pravatar.cc/240?img=12",
  "https://i.pravatar.cc/240?img=15",
  "https://i.pravatar.cc/240?img=20",
  "https://i.pravatar.cc/240?img=32",
  "https://i.pravatar.cc/240?img=47",
];

type GalleryModalProps = {
  open: boolean;
  onClose: () => void;
  onSelect?: (url: string) => void;
};

export function GalleryModal({ open, onClose, onSelect }: GalleryModalProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(galleryImages[0]);
  const overlayRef = useRef<HTMLDivElement>(null);

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

  if (!open) return null;

  const filtered = galleryImages.filter((url) =>
    url.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(16,24,40,0.2)] md:flex-row">
        <div className="flex-1 overflow-y-auto p-5">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold text-[#111827]">Gallery</h3>
            <div className="relative min-w-[180px] flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#9ca3af]" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="h-10 w-full rounded-lg border border-[#e5e7eb] bg-white pr-3 pl-9 text-sm outline-none"
              />
            </div>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#f0a500] px-3 text-sm font-semibold text-white"
            >
              <Upload className="size-4" />
              Upload File
            </button>
            <button
              type="button"
              aria-label="Close gallery"
              onClick={onClose}
              className="rounded-lg p-2 text-[#6b7280] hover:bg-[#f3f4f6] md:hidden"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {filtered.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => setSelected(url)}
                className={cn(
                  "overflow-hidden rounded-xl border-2 transition",
                  selected === url ? "border-[#2563eb]" : "border-transparent"
                )}
              >
                <Image
                  src={url}
                  alt="Gallery item"
                  width={160}
                  height={120}
                  className="h-24 w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="w-full border-t border-[#eef1f6] p-5 md:w-[280px] md:border-t-0 md:border-l">
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
          <Image
            src={selected}
            alt="Selected"
            width={240}
            height={280}
            className="mb-4 h-56 w-full rounded-xl object-cover"
          />
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                onSelect?.(selected);
                onClose();
              }}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#2563eb] text-sm font-semibold text-white"
            >
              Keep Image
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#2563eb] text-sm font-semibold text-[#2563eb]"
            >
              Replace Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
