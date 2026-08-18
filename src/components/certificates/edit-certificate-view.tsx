"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Eraser, Upload } from "lucide-react";

import { FileUpload } from "@/components/ui/file-upload";
import { TextField } from "@/components/ui/text-field";
import type { Certificate } from "@/data/certificates";

type EditCertificateViewProps = {
  certificate: Certificate;
};

export function EditCertificateView({ certificate }: EditCertificateViewProps) {
  const [heading, setHeading] = useState(certificate.certificateHeading);
  const [openingLine, setOpeningLine] = useState(certificate.openingLine);
  const [completionStatement, setCompletionStatement] = useState(
    certificate.completionStatement
  );
  const [description, setDescription] = useState(certificate.description);
  const [recipientName] = useState(certificate.recipientName);
  const [title] = useState(certificate.title);

  return (
    <div className="space-y-6">
      <Link
        href="/certificates"
        className="inline-flex items-center gap-2 text-[22px] font-bold tracking-tight text-[#111827] transition hover:text-[#3b82f6]"
      >
        <ArrowLeft className="size-5" />
        Edit Certificate
      </Link>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-5 rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)] sm:p-6">
          <FileUpload label="Upload Logo" helperText="Choose File" />

          <TextField
            label="Certificate Heading"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            inputClassName="text-[#4b5563]"
          />

          <TextField
            label="Opening Line"
            value={openingLine}
            onChange={(e) => setOpeningLine(e.target.value)}
            inputClassName="text-[#4b5563]"
          />

          <TextField
            label="Completion Statement"
            value={completionStatement}
            onChange={(e) => setCompletionStatement(e.target.value)}
            inputClassName="text-[#4b5563]"
          />

          <div className="flex flex-col gap-[10px]">
            <label className="text-[14px] font-medium text-[#111111]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 py-4 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
            />
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[14px] font-medium text-[#111111]">
                Draw Signature
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-white px-3 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb]"
                >
                  <Eraser className="size-3.5" />
                  Clear
                </button>
                <button
                  type="button"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-white px-3 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb]"
                >
                  <Upload className="size-3.5" />
                  Upload
                </button>
                <button
                  type="button"
                  className="inline-flex h-9 items-center rounded-lg border border-[#e5e7eb] bg-white px-3 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb]"
                >
                  Save
                </button>
              </div>
            </div>
            <div className="flex h-28 items-end rounded-[10px] border border-dashed border-[#d1d5db] bg-[#fafbfc] px-4 pb-4">
              <svg
                viewBox="0 0 220 60"
                className="h-12 w-44 text-[#111827]"
                fill="none"
                aria-hidden
              >
                <path
                  d="M4 38c18-24 28-2 42-10 12-7 18 16 34 8 14-7 20-22 34-16 12 5 14 20 28 14 10-4 18-18 30-12 8 4 12 14 22 10"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-full bg-[#f0a500] px-8 text-sm font-semibold text-white transition hover:bg-[#d99400]"
          >
            Save Changes
          </button>
        </div>

        <aside className="space-y-3">
          <p className="text-sm font-semibold text-[#374151]">
            Certificate Preview
          </p>
          <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_8px_24px_rgba(16,24,40,0.08)]">
            <div className="relative aspect-[4/3] bg-gradient-to-br from-[#f8fafc] via-white to-[#eff6ff] p-6">
              <div className="absolute inset-4 rounded-xl border border-[#e5e7eb] bg-white/90 p-5 text-center shadow-sm">
                <div className="mb-3 flex items-center justify-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-[#1a73e8] text-[10px] font-bold text-white">
                    TT
                  </div>
                  <span className="text-xs font-extrabold tracking-wide text-[#111827]">
                    TECHNITEST
                  </span>
                </div>

                <p className="text-[11px] font-semibold tracking-[0.2em] text-[#6b7280]">
                  {heading || "CERTIFICATE"}
                </p>
                <p className="mt-2 text-[10px] text-[#9ca3af]">{openingLine}</p>
                <p className="mt-2 text-lg font-bold text-[#1d4ed8]">
                  {recipientName}
                </p>
                <p className="mt-1 text-[10px] text-[#9ca3af]">
                  {completionStatement}
                </p>
                <p className="mt-2 text-sm font-semibold text-[#111827]">
                  {title}
                </p>
                <p className="mx-auto mt-3 line-clamp-3 max-w-[260px] text-[9px] leading-relaxed text-[#6b7280]">
                  {description}
                </p>

                <div className="mt-5 flex items-end justify-between px-2">
                  <div className="text-left">
                    <div className="mb-1 h-6 w-16 border-b border-[#111827]" />
                    <p className="text-[8px] text-[#9ca3af]">Signature</p>
                  </div>
                  <div className="size-10 rounded bg-[repeating-linear-gradient(45deg,#111827_0,#111827_1px,transparent_1px,transparent_3px)] opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
