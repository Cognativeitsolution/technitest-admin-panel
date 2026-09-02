"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import { FileUpload } from "@/components/ui/file-upload";
import { TextField } from "@/components/ui/text-field";
import {
  TestReportCertificate,
  SAMPLE_TEST_REPORT,
} from "@/components/certificates/test-report-certificate";
import { resolveCertificateTemplateCopy } from "@/lib/certificate-report";
import {
  useCertificateTemplate,
  type SaveTemplateInput,
} from "@/hooks/certificates/use-certificate-template";
import type {
  CertificateTemplate,
  CertificateTemplatePayload,
} from "@/types/certificate.types";

type TemplateFormProps = {
  template: CertificateTemplate | null;
  saving: boolean;
  onSave: (input: SaveTemplateInput) => Promise<boolean>;
};

function TemplateForm({ template, saving, onSave }: TemplateFormProps) {
  const [heading, setHeading] = useState(template?.heading ?? "");
  const [openingLine, setOpeningLine] = useState(
    template?.opening_line ?? "",
  );
  const [statement, setStatement] = useState(template?.statement ?? "");
  const [description, setDescription] = useState(template?.description ?? "");
  const [signatureText, setSignatureText] = useState(
    template?.signature_text ?? "",
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    template?.logo_url || null,
  );
  const [signaturePreview, setSignaturePreview] = useState<string | null>(
    template?.signature_image_url || null,
  );

  function handleLogoChange(file: File | null) {
    setLogoFile(file);
    setLogoPreview(file ? URL.createObjectURL(file) : template?.logo_url || null);
  }

  function handleSignatureChange(file: File | null) {
    setSignatureFile(file);
    setSignaturePreview(
      file ? URL.createObjectURL(file) : template?.signature_image_url || null,
    );
  }

  async function handleSave() {
    const payload: CertificateTemplatePayload = {
      heading,
      opening_line: openingLine,
      statement,
      description,
      signature_text: signatureText,
    };
    await onSave({ payload, logo: logoFile, signatureImage: signatureFile });
  }

  const previewCopy = resolveCertificateTemplateCopy({
    heading,
    opening_line: openingLine,
    statement,
    description,
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(520px,640px)]">
      <div className="space-y-5 rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)] sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <FileUpload
              label="Upload Logo"
              helperText="PNG or JPG"
              onChange={handleLogoChange}
            />
            {logoPreview ? (
              <div className="mt-3 flex h-20 items-center justify-center rounded-xl border border-[#eef1f6] bg-[#f8fafc] p-2">
                <Image
                  src={logoPreview}
                  alt="Certificate logo preview"
                  width={64}
                  height={64}
                  unoptimized
                  className="max-h-full w-auto object-contain"
                />
              </div>
            ) : null}
          </div>
          <div>
            <FileUpload
              label="Upload Signature Image"
              helperText="PNG with transparent background recommended"
              onChange={handleSignatureChange}
            />
            {signaturePreview ? (
              <div className="mt-3 flex h-20 items-center justify-center rounded-xl border border-[#eef1f6] bg-[#f8fafc] p-2">
                <Image
                  src={signaturePreview}
                  alt="Certificate signature preview"
                  width={120}
                  height={48}
                  unoptimized
                  className="max-h-full w-auto object-contain"
                />
              </div>
            ) : null}
          </div>
        </div>

        <TextField
          label="Certificate Heading"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          inputClassName="text-[#4b5563]"
          placeholder="TEST REPORT"
        />

        <TextField
          label="Opening Line"
          value={openingLine}
          onChange={(e) => setOpeningLine(e.target.value)}
          inputClassName="text-[#4b5563]"
          placeholder="This is to Certify that"
        />

        <TextField
          label="Completion Statement"
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          inputClassName="text-[#4b5563]"
          placeholder="has successfully appeared in the TECH-NI-TEST Trade Test conducted for the post of"
        />

        <div className="flex flex-col gap-2.5">
          <label className="text-[14px] font-medium text-[#111111]">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Recognition text shown on every certificate..."
            className="w-full rounded-[10px] border border-[#ebebeb] bg-white px-5 py-4 text-[15px] text-[#4b5563] shadow-[0_2px_10px_rgba(16,24,40,0.06)] outline-none transition placeholder:text-[#b0b0b0] focus:border-[#dcdcdc] focus:shadow-[0_2px_12px_rgba(16,24,40,0.08)] focus:ring-0"
          />
        </div>

        <TextField
          label="Signature Text"
          value={signatureText}
          onChange={(e) => setSignatureText(e.target.value)}
          inputClassName="text-[#4b5563]"
          placeholder="Authorized Signature"
        />

        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="inline-flex h-12 min-w-40 items-center justify-center rounded-full bg-[#f0a500] px-8 text-sm font-semibold text-white transition hover:bg-[#d99400] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <aside className="space-y-3 xl:sticky xl:top-6 xl:self-start">
        <p className="text-sm font-semibold text-[#374151]">
          Certificate Preview
        </p>
        <TestReportCertificate
          {...SAMPLE_TEST_REPORT}
          heading={previewCopy.heading}
          openingLine={previewCopy.openingLine}
          statement={previewCopy.statement}
          pointsConsidered={previewCopy.description}
          signatureImageUrl={signaturePreview}
          signatureText={signatureText.trim() || "Signature"}
        />
      </aside>
    </div>
  );
}

export function CertificateTemplateEditorView() {
  const { template, notConfigured, loading, error, saving, saveTemplate } =
    useCertificateTemplate();

  return (
    <div className="space-y-6">
      <Link
        href="/certificates"
        className="inline-flex items-center gap-2 text-[22px] font-bold tracking-tight text-[#111827] transition hover:text-[#3b82f6]"
      >
        <ArrowLeft className="size-5" />
        Edit Certificate Template
      </Link>

      {error ? <p className="text-sm text-[#ef4444]">{error}</p> : null}

      {notConfigured && !loading ? (
        <p className="rounded-xl border border-dashed border-[#d1d5db] bg-white p-4 text-sm text-[#6b7280]">
          No certificate template has been configured yet. Fill in the details
          below and save to create one.
        </p>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-[#eef1f6] bg-white p-10 text-center text-sm text-[#6b7280] shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
          Loading certificate template...
        </div>
      ) : (
        <TemplateForm
          key={
            template
              ? `${template.heading}-${template.updated_at ?? ""}`
              : "new-template"
          }
          template={template}
          saving={saving}
          onSave={saveTemplate}
        />
      )}
    </div>
  );
}
