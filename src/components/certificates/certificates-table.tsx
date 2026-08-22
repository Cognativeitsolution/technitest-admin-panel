"use client";

import { Eye, ShieldCheck } from "lucide-react";

import type { UserCertificateItem } from "@/types/certificate.types";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

type CertificatesTableProps = {
  certificates: UserCertificateItem[];
  loading?: boolean;
  onView: (certificate: UserCertificateItem) => void;
  onVerify: (certificate: UserCertificateItem) => void;
};

export function CertificatesTable({
  certificates,
  loading = false,
  onView,
  onVerify,
}: CertificatesTableProps) {
  const colCount = 9;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-270 border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">Certificate #</th>
              <th className="px-5 py-3.5">User</th>
              <th className="px-5 py-3.5">Quiz</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Level</th>
              <th className="px-5 py-3.5">Score</th>
              <th className="px-5 py-3.5">Issued</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={colCount}
                  className="px-5 py-10 text-center text-sm text-[#6b7280]"
                >
                  Loading certificates...
                </td>
              </tr>
            ) : (
              <>
                {certificates.map((certificate) => {
                  const statusLabel = certificate.status
                    ? certificate.status.charAt(0).toUpperCase() +
                      certificate.status.slice(1)
                    : "--";
                  return (
                    <tr
                      key={certificate.certificate_number}
                      className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]"
                    >
                      <td className="px-5 py-4 text-sm font-semibold text-[#111827]">
                        {certificate.certificate_number}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#374151]">
                        {certificate.user_name}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#374151]">
                        {certificate.quiz_title}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#374151]">
                        {certificate.category || "--"}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#374151]">
                        {certificate.level || "--"}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-[#111827]">
                        {certificate.score}{" "}
                        <span className="text-xs font-normal text-[#6b7280]">
                          ({certificate.percentage}%)
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#6b7280]">
                        {formatDateTime(certificate.issued_at)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                            certificate.status === "issued"
                              ? "bg-[#dcfce7] text-[#16a34a]"
                              : "bg-[#fef3c7] text-[#d97706]",
                          )}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            aria-label={`View ${certificate.certificate_number}`}
                            onClick={() => onView(certificate)}
                            className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#3b82f6]"
                          >
                            <Eye className="size-4" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Verify ${certificate.certificate_number}`}
                            onClick={() => onVerify(certificate)}
                            className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#16a34a]"
                          >
                            <ShieldCheck className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {certificates.length === 0 ? (
                  <tr>
                    <td
                      colSpan={colCount}
                      className="px-5 py-10 text-center text-sm text-[#6b7280]"
                    >
                      No certificates found.
                    </td>
                  </tr>
                ) : null}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
