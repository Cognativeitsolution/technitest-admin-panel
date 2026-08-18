"use client";

import { Pencil, Trash2 } from "lucide-react";

import type { Certificate } from "@/data/certificates";
import { cn } from "@/lib/utils";

type CertificatesTableProps = {
  certificates: Certificate[];
  onEdit: (certificate: Certificate) => void;
  onDelete: (certificate: Certificate) => void;
};

export function CertificatesTable({
  certificates,
  onEdit,
  onDelete,
}: CertificatesTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">ID</th>
              <th className="px-5 py-3.5">User</th>
              <th className="px-5 py-3.5">Title</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Level</th>
              <th className="px-5 py-3.5">Issue Date</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((certificate) => (
              <tr
                key={certificate.id}
                className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]"
              >
                <td className="px-5 py-4 text-sm font-semibold text-[#111827]">
                  {certificate.id}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {certificate.user}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {certificate.title}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {certificate.category}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {certificate.level}
                </td>
                <td className="px-5 py-4 text-sm text-[#374151]">
                  {certificate.issueDate}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                      certificate.status === "Issued" &&
                        "bg-[#dcfce7] text-[#16a34a]",
                      certificate.status === "Pending" &&
                        "bg-[#fef3c7] text-[#d97706]",
                      certificate.status === "Rejected" &&
                        "bg-[#fee2e2] text-[#dc2626]"
                    )}
                  >
                    {certificate.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      aria-label={`Edit ${certificate.id}`}
                      onClick={() => onEdit(certificate)}
                      className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${certificate.id}`}
                      onClick={() => onDelete(certificate)}
                      className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#fef2f2] hover:text-[#ef4444]"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
