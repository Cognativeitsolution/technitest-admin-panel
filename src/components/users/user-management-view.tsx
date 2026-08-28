"use client";

import { useState } from "react";
import { Download, Plus } from "lucide-react";

import { DropdownMenu } from "@/components/shared/dropdown-menu";
import { Pagination } from "@/components/shared/pagination";
import { DateRangePicker, type DateRange } from "@/components/ui/date-range-picker";
import { UsersTable } from "@/components/users/users-table";
import { useUsers } from "@/hooks/users/use-users";
import { useCountries } from "@/hooks/locations/use-countries";
import { UserDialog } from "@/components/roles/user-dialog";
import { roles as initialRoles } from "@/data/roles";
import type { AdminUser } from "@/data/roles";

const PAGE_SIZE = 10;

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export function UserManagementView() {
  const { countries, countryData, loading: countriesLoading } = useCountries();
  const [country, setCountry] = useState("All Countries");
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });

  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [userDialogMode, setUserDialogMode] = useState<"create" | "edit">("create");
  const [userDialogTarget, setUserDialogTarget] = useState<AdminUser | null>(null);

  const selectedCountryId = country === "All Countries" ? undefined : countryData?.find((c) => c.name === country)?.id;

  const { items, pagination, loading, goToPage } = useUsers({
    perPage: PAGE_SIZE,
    country_id: selectedCountryId ? String(selectedCountryId) : undefined,
    start_date: dateRange.start ? formatDate(dateRange.start) : undefined,
    end_date: dateRange.end ? formatDate(dateRange.end) : undefined,
  });

  const roleNames = initialRoles.map((r) => r.name);

  function openCreateUser() {
    setUserDialogMode("create");
    setUserDialogTarget(null);
    setUserDialogOpen(true);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
          User Management
        </h1>

        <div className="flex gap-2">
          <button
            type="button"
            className="inline-flex h-11 w-fit items-center gap-2 rounded-xl bg-[#f0a500] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d99400]"
          >
            <Download className="size-4" />
            Export Logs (CSV / PDF)
          </button>
          <button
            type="button"
            onClick={openCreateUser}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#111827] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f2937]"
          >
            <Plus className="size-4" />
            Add User
          </button>
        </div>
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

      <UserDialog
        open={userDialogOpen}
        onClose={() => setUserDialogOpen(false)}
        mode={userDialogMode}
        user={userDialogTarget}
        roleNames={roleNames}
      />
    </div>
  );
}
