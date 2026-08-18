"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Pencil } from "lucide-react";

import { CertificatesTable } from "@/components/certificates/certificates-table";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Dialog } from "@/components/ui/dialog";
import { DropdownMenu } from "@/components/shared/dropdown-menu";
import { MultiSelectFilter } from "@/components/quizzes/multi-select-filter";
import { Pagination } from "@/components/shared/pagination";
import {
  certificateCategoryOptions,
  certificateLevelOptions,
  certificates as initialCertificates,
  certificateStatusOptions,
  type Certificate,
} from "@/data/certificates";

const PAGE_SIZE = 8;

export function CertificatesManagementView() {
  const router = useRouter();
  const [certificates, setCertificates] = useState(initialCertificates);
  const [statusFilter, setStatusFilter] = useState(certificateStatusOptions[0]);
  const [levelFilter, setLevelFilter] = useState(certificateLevelOptions[0]);
  const [categories, setCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Certificate | null>(null);

  const filtered = useMemo(() => {
    return certificates.filter((item) => {
      if (statusFilter !== "Status" && item.status !== statusFilter) return false;
      if (levelFilter !== "Level" && item.level !== levelFilter) return false;
      if (categories.length > 0 && !categories.includes(item.category)) {
        return false;
      }
      return true;
    });
  }, [certificates, statusFilter, levelFilter, categories]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function confirmDelete() {
    if (!deleteTarget) return;
    setCertificates((prev) =>
      prev.filter((item) => item.id !== deleteTarget.id)
    );
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
          Certificate Management
        </h1>

        <button
          type="button"
          onClick={() => router.push(`/certificates/${certificates[0]?.id ?? "CERT-1001"}`)}
          className="inline-flex h-11 w-fit items-center gap-2 rounded-xl bg-[#111827] px-4 text-sm font-semibold text-white transition hover:bg-black"
        >
          <Pencil className="size-4" />
          Modify Certificate
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <DropdownMenu
          label="Status"
          value={statusFilter}
          options={certificateStatusOptions}
          onChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
        />
        <DateRangePicker dualMonth={false} />
        <DropdownMenu
          label="Level"
          value={levelFilter}
          options={certificateLevelOptions}
          onChange={(value) => {
            setLevelFilter(value);
            setPage(1);
          }}
        />
        <MultiSelectFilter
          label="Category"
          options={certificateCategoryOptions}
          selected={categories}
          onChange={(values) => {
            setCategories(values);
            setPage(1);
          }}
        />
      </div>

      <CertificatesTable
        certificates={pageItems}
        onEdit={(certificate) =>
          router.push(`/certificates/${certificate.id}`)
        }
        onDelete={setDeleteTarget}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete Certificate"
        maxWidth="max-w-sm"
      >
        <p className="text-sm text-[#4b5563]">
          Are you sure you want to delete certificate{" "}
          <span className="font-semibold text-[#111827]">
            {deleteTarget?.id}
          </span>
          ?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e5e7eb] px-4 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#ef4444] px-4 text-sm font-semibold text-white transition hover:bg-[#dc2626]"
          >
            Delete
          </button>
        </div>
      </Dialog>
    </div>
  );
}
