"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";

import { DropdownMenu } from "@/components/shared/dropdown-menu";
import { Pagination } from "@/components/shared/pagination";
import { UsersTable } from "@/components/users/users-table";
import { countryOptions, users as allUsers } from "@/data/users";

const PAGE_SIZE = 8;
const dateOptions = ["Date", "Last 7 Days", "Last 30 Days", "This Year"];

export function UserManagementView() {
  const [country, setCountry] = useState(countryOptions[0]);
  const [dateFilter, setDateFilter] = useState(dateOptions[0]);
  const [page, setPage] = useState(1);

  const filteredUsers = useMemo(() => {
    if (country === "All Countries") return allUsers;
    return allUsers.filter((user) => user.country === country);
  }, [country]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
          User Management
        </h1>

        <button
          type="button"
          className="inline-flex h-11 w-fit items-center gap-2 rounded-xl bg-[#f0a500] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d99400]"
        >
          <Download className="size-4" />
          Export Logs (CSV / PDF)
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <DropdownMenu
          label="Country"
          value={country}
          options={countryOptions}
          onChange={(value) => {
            setCountry(value);
            setPage(1);
          }}
        />
        <DropdownMenu
          label="Date"
          value={dateFilter}
          options={dateOptions}
          onChange={setDateFilter}
        />
      </div>

      <UsersTable users={pageUsers} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
