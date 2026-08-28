"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Pencil } from "lucide-react";

import { CertificatesTable } from "@/components/certificates/certificates-table";
import { Dialog } from "@/components/ui/dialog";
import { Can } from "@/components/shared/can";
import { DateRangePicker, type DateRange } from "@/components/ui/date-range-picker";
import { DropdownMenu } from "@/components/shared/dropdown-menu";
import { Pagination } from "@/components/shared/pagination";
import { useAdminCertificates } from "@/hooks/certificates/use-admin-certificates";
import { useCertificateDetail } from "@/hooks/certificates/use-certificate-detail";
import { useCertificateFilterOptions } from "@/hooks/certificates/use-certificate-filter-options";
import { useVerifyCertificate } from "@/hooks/certificates/use-verify-certificate";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { UserCertificateItem } from "@/types/certificate.types";

const PAGE_SIZE = 10;
const STATUS_PLACEHOLDER = "Status";
const LEVEL_PLACEHOLDER = "Level";
const CATEGORY_PLACEHOLDER = "Category";

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function matchesDateRange(issuedAt: string | null, range: DateRange) {
  if (!range.start && !range.end) return true;
  if (!issuedAt) return false;
  const issued = new Date(issuedAt);
  if (Number.isNaN(issued.getTime())) return false;

  const issuedTime = new Date(
    issued.getFullYear(),
    issued.getMonth(),
    issued.getDate(),
  ).getTime();

  if (range.start) {
    const startTime = new Date(
      range.start.getFullYear(),
      range.start.getMonth(),
      range.start.getDate(),
    ).getTime();
    if (issuedTime < startTime) return false;
  }

  if (range.end) {
    const endTime = new Date(
      range.end.getFullYear(),
      range.end.getMonth(),
      range.end.getDate(),
    ).getTime();
    if (issuedTime > endTime) return false;
  }

  return true;
}

export function CertificatesManagementView() {
  const router = useRouter();
  const [detailTarget, setDetailTarget] =
    useState<UserCertificateItem | null>(null);
  const [verifyTarget, setVerifyTarget] =
    useState<UserCertificateItem | null>(null);
  const [status, setStatus] = useState(STATUS_PLACEHOLDER);
  const [level, setLevel] = useState(LEVEL_PLACEHOLDER);
  const [category, setCategory] = useState(CATEGORY_PLACEHOLDER);
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });

  const filterOptions = useCertificateFilterOptions();
  const dateFrom = dateRange.start && dateRange.end ? toIsoDate(dateRange.start) : undefined;
  const dateTo = dateRange.start && dateRange.end ? toIsoDate(dateRange.end) : undefined;

  const { items, pagination, loading, error, goToPage } = useAdminCertificates({
    perPage: PAGE_SIZE,
    status: status === STATUS_PLACEHOLDER ? undefined : status,
    category: category === CATEGORY_PLACEHOLDER ? undefined : category,
    level: level === LEVEL_PLACEHOLDER ? undefined : level,
    dateFrom,
    dateTo,
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

  const visibleCertificates = useMemo(() => {
    return items.filter((certificate) => {
      if (
        status !== STATUS_PLACEHOLDER &&
        (certificate.status ?? "").toLowerCase() !== status.toLowerCase()
      ) {
        return false;
      }
      if (
        level !== LEVEL_PLACEHOLDER &&
        (certificate.level ?? "").toLowerCase() !== level.toLowerCase()
      ) {
        return false;
      }
      if (
        category !== CATEGORY_PLACEHOLDER &&
        (certificate.category ?? "").toLowerCase() !== category.toLowerCase()
      ) {
        return false;
      }
      if (!matchesDateRange(certificate.issued_at, dateRange)) return false;
      return true;
    });
  }, [items, status, level, category, dateRange]);

  function handleFilterChange(setter: (value: string) => void) {
    return (value: string) => {
      setter(value);
      goToPage(1);
    };
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
          Certificate Management
        </h1>

        <Can permission="certificate:update">
          <button
            type="button"
            onClick={() => router.push("/certificates/template")}
            className="inline-flex h-11 w-fit items-center gap-2 rounded-xl bg-[#f0a500] px-4 text-sm font-semibold text-white transition hover:bg-[#d99400]"
          >
            <Pencil className="size-4" />
            Modify Certificate Template
          </button>
        </Can>
      </div>

      {error ? <p className="text-sm text-[#ef4444]">{error}</p> : null}

      <div className="flex flex-wrap items-center gap-3">
        <DropdownMenu
          label="Status"
          options={[STATUS_PLACEHOLDER, ...filterOptions.statuses]}
          value={status}
          onChange={handleFilterChange(setStatus)}
        />
        <DateRangePicker
          placeholder="Date"
          value={dateRange}
          onChange={(range) => {
            setDateRange(range);
            if ((range.start && range.end) || (!range.start && !range.end)) {
              goToPage(1);
            }
          }}
        />
        <DropdownMenu
          label="Level"
          options={[LEVEL_PLACEHOLDER, ...filterOptions.levels]}
          value={level}
          onChange={handleFilterChange(setLevel)}
        />
        <DropdownMenu
          label="Category"
          options={[CATEGORY_PLACEHOLDER, ...filterOptions.categories]}
          value={category}
          onChange={handleFilterChange(setCategory)}
          searchable
        />
      </div>

      <CertificatesTable
        certificates={visibleCertificates}
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
