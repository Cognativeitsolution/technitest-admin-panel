"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { TextField } from "@/components/ui/text-field";
import { cmsPages } from "@/data/cms";

type PageEditorViewProps = {
  pageId: string;
};

export function PageEditorView({ pageId }: PageEditorViewProps) {
  const page = cmsPages.find((item) => item.id === pageId);
  const [title, setTitle] = useState(page?.title ?? "Page");
  const [content, setContent] = useState(
    `<p>Edit content for ${page?.title ?? "this page"}.</p>`
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/cms"
          className="inline-flex items-center gap-2 text-[22px] font-bold tracking-tight text-[#111827] transition hover:text-[#3b82f6]"
        >
          <ArrowLeft className="size-5" />
          Edit {page?.title ?? "Page"}
        </Link>
        <button
          type="button"
          className="inline-flex h-11 w-fit items-center justify-center rounded-xl bg-[#f0a500] px-5 text-sm font-semibold text-white transition hover:bg-[#d99400]"
        >
          Save Changes
        </button>
      </div>

      <div className="space-y-5 rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)] sm:p-6">
        <TextField
          label="Page Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          inputClassName="text-[#4b5563]"
        />
        <TextField
          label="Page URL"
          defaultValue={page?.slug ?? "/"}
          inputClassName="text-[#4b5563]"
        />
        <RichTextEditor
          label="Page Content"
          value={content}
          onChange={setContent}
          placeholder="Write page content..."
        />
      </div>
    </div>
  );
}
