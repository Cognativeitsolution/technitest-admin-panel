"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";

import { DropdownMenu } from "@/components/shared/dropdown-menu";
import { Pagination } from "@/components/shared/pagination";
import { DateRangePicker, type DateRange } from "@/components/ui/date-range-picker";
import { UsersTable } from "@/components/users/users-table";
import { useUsers } from "@/hooks/users/use-users";
import { useCountries } from "@/hooks/locations/use-countries";

const PAGE_SIZE = 10;

export function UserManagementView() {
  const { countries, loading: countriesLoading } = useCountries();
  const [country, setCountry] = useState("All Countries");
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });

  const { items, pagination, loading, goToPage } = useUsers({
    perPage: PAGE_SIZE,
    country: country === "All Countries" ? undefined : country,
    dateFrom: dateRange.start ? dateRange.start.toISOString() : undefined,
    dateTo: dateRange.end ? dateRange.end.toISOString() : undefined,
  });

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
          label={countriesLoading ? "Loading..." : "Country"}
          value={country}
          options={countries}
          searchable
          onChange={(value) => setCountry(value)}
        />
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          placeholder="Select dates"
          dualMonth={false}
        />
      </div>

      <UsersTable users={items} loading={loading} />

      <Pagination
        currentPage={pagination.page || 1}
        totalPages={Math.max(1, pagination.totalPages || 1)}
        onPageChange={goToPage}
      />
    </div>
  );
}
