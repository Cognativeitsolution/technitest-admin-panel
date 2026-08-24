"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil } from "lucide-react";

import { CertificatesTable } from "@/components/certificates/certificates-table";
import { Dialog } from "@/components/ui/dialog";
import { Pagination } from "@/components/shared/pagination";
import { useAdminCertificates } from "@/hooks/certificates/use-admin-certificates";
import { useCertificateDetail } from "@/hooks/certificates/use-certificate-detail";
import { useVerifyCertificate } from "@/hooks/certificates/use-verify-certificate";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { UserCertificateItem } from "@/types/certificate.types";

const PAGE_SIZE = 10;

export function CertificatesManagementView() {
  const router = useRouter();
  const [detailTarget, setDetailTarget] =
    useState<UserCertificateItem | null>(null);
  const [verifyTarget, setVerifyTarget] =
    useState<UserCertificateItem | null>(null);

  const { items, pagination, loading, error, goToPage } = useAdminCertificates({
    perPage: PAGE_SIZE,
  });
  const {
    detail,
    loadingId,
    error: detailError,
    loadCertificate,
    clearDetail,
  } = useCertificateDetail();
  const {
    result: verifyResult,
    verifyingNumber,
    error: verifyError,
    verifyCertificate,
    resetVerification,
  } = useVerifyCertificate();

  function openDetail(certificate: UserCertificateItem) {
    setDetailTarget(certificate);
    clearDetail();
    if (certificate.quiz_attempt_id != null) {
      void loadCertificate(certificate.quiz_attempt_id);
    }
  }

  function openVerify(certificate: UserCertificateItem) {
    setVerifyTarget(certificate);
    resetVerification();
    void verifyCertificate(certificate.certificate_number);
  }

  const detailLoading =
    detailTarget?.quiz_attempt_id != null &&
    loadingId === detailTarget.quiz_attempt_id;
  const verifying =
    verifyTarget != null && verifyingNumber === verifyTarget.certificate_number;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
          Certificate Management
        </h1>

        <button
          type="button"
          onClick={() => router.push("/certificates/template")}
          className="inline-flex h-11 w-fit items-center gap-2 rounded-xl bg-[#111827] px-4 text-sm font-semibold text-white transition hover:bg-black"
        >
          <Pencil className="size-4" />
          Modify Certificate Template
        </button>
      </div>

      {error ? <p className="text-sm text-[#ef4444]">{error}</p> : null}

      <CertificatesTable
        certificates={items}
        loading={loading}
        onView={openDetail}
        onVerify={openVerify}
      />

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={goToPage}
      />

      <Dialog
        open={Boolean(detailTarget)}
        onClose={() => setDetailTarget(null)}
        title="Certificate Details"
        maxWidth="max-w-xl"
      >
        {detailLoading ? (
          <p className="py-6 text-center text-sm text-[#6b7280]">
            Loading certificate...
          </p>
        ) : detailError ? (
          <p className="py-6 text-center text-sm text-[#ef4444]">
            {detailError}
          </p>
        ) : detail ? (
          <div className="space-y-5">
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[#9ca3af]">
                  Certificate #
                </dt>
                <dd className="text-sm font-semibold text-[#111827]">
                  {detail.certificate.certificate_number}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[#9ca3af]">
                  User
                </dt>
                <dd className="text-sm text-[#374151]">
                  {detail.certificate.user_name}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[#9ca3af]">
                  Quiz
                </dt>
                <dd className="text-sm text-[#374151]">
                  {detail.certificate.quiz_title}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[#9ca3af]">
                  Category / Level
                </dt>
                <dd className="text-sm text-[#374151]">
                  {detail.certificate.category || "--"} ·{" "}
                  {detail.certificate.level || "--"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[#9ca3af]">
                  Score
                </dt>
                <dd className="text-sm font-semibold text-[#111827]">
                  {detail.certificate.score} ({detail.certificate.percentage}%)
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[#9ca3af]">
                  Badge
                </dt>
                <dd className="text-sm text-[#374151]">
                  {detail.certificate.badge_name || "--"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[#9ca3af]">
                  Issued At
                </dt>
                <dd className="text-sm text-[#374151]">
                  {formatDateTime(detail.certificate.issued_at)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[#9ca3af]">
                  Expires At
                </dt>
                <dd className="text-sm text-[#374151]">
                  {formatDateTime(detail.certificate.expires_at ?? null)}
                </dd>
              </div>
            </dl>

            {detail.template ? (
              <div className="rounded-xl border border-[#eef1f6] bg-[#f8fafc] p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">
                  Applied Template
                </p>
                <p className="text-sm font-bold text-[#111827]">
                  {detail.template.heading}
                </p>
                <p className="mt-1 text-sm italic text-[#6b7280]">
                  {detail.template.opening_line}
                </p>
                <p className="mt-1 text-sm text-[#374151]">
                  {detail.template.statement}
                </p>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#6b7280]">
                  {detail.template.description}
                </p>
                <p className="mt-2 text-xs font-medium text-[#374151]">
                  Signed: {detail.template.signature_text}
                </p>
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-[#d1d5db] p-4 text-sm text-[#6b7280]">
                No certificate template has been configured yet.
              </p>
            )}
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-[#6b7280]">
            No certificate data available.
          </p>
        )}
      </Dialog>

      <Dialog
        open={Boolean(verifyTarget)}
        onClose={() => setVerifyTarget(null)}
        title="Verify Certificate"
        maxWidth="max-w-md"
      >
        <p className="text-sm text-[#4b5563]">
          Certificate{" "}
          <span className="font-semibold text-[#111827]">
            {verifyTarget?.certificate_number}
          </span>
        </p>
        <div className="mt-4">
          {verifying ? (
            <p className="text-sm text-[#6b7280]">Verifying certificate...</p>
          ) : verifyError ? (
            <p className="text-sm text-[#ef4444]">{verifyError}</p>
          ) : verifyResult ? (
            <div className="space-y-3">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                  verifyResult.is_valid
                    ? "bg-[#dcfce7] text-[#16a34a]"
                    : "bg-[#fee2e2] text-[#dc2626]",
                )}
              >
                {verifyResult.is_valid ? "Valid" : "Invalid"}
              </span>
              <p className="text-sm text-[#374151]">{verifyResult.message}</p>
              {verifyResult.certificate ? (
                <p className="text-sm text-[#4b5563]">
                  Issued to{" "}
                  <span className="font-semibold text-[#111827]">
                    {verifyResult.certificate.user_name}
                  </span>{" "}
                  for{" "}
                  <span className="font-semibold text-[#111827]">
                    {verifyResult.certificate.quiz_title}
                  </span>
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => setVerifyTarget(null)}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e5e7eb] px-4 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
          >
            Close
          </button>
        </div>
      </Dialog>
    </div>
  );
}
