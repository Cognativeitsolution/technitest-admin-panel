"use client";

import { useState } from "react";
import { Download } from "lucide-react";

import { DropdownMenu } from "@/components/shared/dropdown-menu";
import type { CertificateRecord } from "@/data/users";

const filterOptions = [
  "This Week",
  "Last 14 Days",
  "Last 20 Days",
  "Last 30 Days",
];

type UserCertificatesTableProps = {
  certificates: CertificateRecord[];
};

export function UserCertificatesTable({
  certificates,
}: UserCertificatesTableProps) {
  const [filter, setFilter] = useState("Last 30 Days");

  return (
    <section className="rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)] sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[#111827]">Certificates Earned</h2>

        <DropdownMenu
          label="Filter"
          value={filter}
          options={filterOptions}
          onChange={setFilter}
        />
      </div>

      {certificates.length === 0 ? (
        <div className="rounded-xl border border-[#e8ecf2] py-10 text-center">
          <p className="text-sm text-[#6b7280]">No certificates earned yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#e8ecf2]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
                  <th className="px-4 py-3">Certificate</th>
                  <th className="px-4 py-3">Issued For</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Issued On</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-[#eef1f6] text-sm text-[#374151]"
                  >
                    <td className="px-4 py-3.5 font-medium">{item.certificate}</td>
                    <td className="px-4 py-3.5">{item.issuedFor}</td>
                    <td className="px-4 py-3.5 font-semibold">{item.score}</td>
                    <td className="px-4 py-3.5">{item.issuedOn}</td>
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        aria-label={`Download ${item.certificate}`}
                        className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#3b82f6]"
                      >
                        <Download className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
