"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { DropdownMenu } from "@/components/shared/dropdown-menu";
import { Pagination } from "@/components/shared/pagination";
import { DateRangePicker, type DateRange } from "@/components/ui/date-range-picker";
import { UsersTable } from "@/components/users/users-table";
import { useUsers } from "@/hooks/users/use-users";
import { useCountries } from "@/hooks/locations/use-countries";
import { Dialog } from "@/components/ui/dialog";
import type { ApiUser } from "@/types/user.types";
import { userService } from "@/services/user.service";
import { ApiError } from "@/lib/api-error";
import { downloadCsv, downloadPdf } from "@/lib/export-file";
import { formatJoiningDate, formatUserRole } from "@/lib/user-utils";
import { cn } from "@/lib/utils";

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

  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<ApiUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [togglingUserId, setTogglingUserId] = useState<number | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    }
    if (exportOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [exportOpen]);

  const selectedCountryId =
    country === "All Countries"
      ? undefined
      : countryData?.find((c) => c.name === country)?.id;

  const { items, pagination, loading, goToPage, mutateItems } = useUsers({
    perPage: PAGE_SIZE,
    country_id: selectedCountryId ? String(selectedCountryId) : undefined,
    start_date: dateRange.start ? formatDate(dateRange.start) : undefined,
    end_date: dateRange.end ? formatDate(dateRange.end) : undefined,
  });

  function handleDeleteUserClick(user: ApiUser) {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  }

  async function handleConfirmDelete() {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await userService.deleteUser(userToDelete.id);
      toast.success("User deleted successfully");
      setDeleteDialogOpen(false);
      mutateItems((prevItems) => prevItems.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error(ApiError.fromAxiosError(error).message || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggleActive(user: ApiUser) {
    if (togglingUserId === user.id) return;
    setTogglingUserId(user.id);
    try {
      if (user.is_active) {
        // Deactivate: soft-delete via DELETE
        await userService.deleteUser(user.id);
        mutateItems((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, is_active: false } : u))
        );
        toast.success(`${user.username} has been deactivated`);
      } else {
        // Restore: reactivate via POST restore
        await userService.restoreUser(user.id);
        mutateItems((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, is_active: true } : u))
        );
        toast.success(`${user.username} has been activated`);
      }
    } catch (error) {
      console.error(error);
      toast.error(ApiError.fromAxiosError(error).message || "Failed to update user status");
    } finally {
      setTogglingUserId(null);
    }
  }

  async function handleExport(format: "csv" | "pdf") {
    if (exporting) return;
    setExportOpen(false);
    setExporting(true);

    const toastId = toast.loading(`Preparing ${format.toUpperCase()} export...`);

    try {
      let usersToExport: ApiUser[] = [];
      try {
        const result = await userService.getUsers({
          page: 1,
          per_page: 500,
          country_id: selectedCountryId ? String(selectedCountryId) : undefined,
          start_date: dateRange.start ? formatDate(dateRange.start) : undefined,
          end_date: dateRange.end ? formatDate(dateRange.end) : undefined,
        });
        if (Array.isArray(result)) {
          usersToExport = result;
        } else if (result && result.items) {
          usersToExport = result.items;
        } else {
          usersToExport = items;
        }
      } catch {
        usersToExport = items;
      }

      if (usersToExport.length === 0) {
        toast.error("No user data available to export.", { id: toastId });
        return;
      }

      const dateStr = new Date().toISOString().slice(0, 10);
      const filename = `users-report-${dateStr}`;
      const title = "Technitest Users Management Report";
      const headers = [
        "Username",
        "Email",
        "Phone",
        "User Role",
        "Joining Date",
        "Country",
        "Quizzes Taken",
        "Certificates Issued",
      ];
      const rows = usersToExport.map((u) => [
        u.username || "-",
        u.email || "-",
        u.phone || "-",
        formatUserRole(u.roles),
        formatJoiningDate(u.created_at),
        u.country?.name || "-",
        String(u.total_quizzes_attempted || 0),
        String(u.total_certificates_issued || 0),
      ]);

      if (format === "csv") {
        downloadCsv(`${filename}.csv`, headers, rows);
      } else {
        downloadPdf(`${filename}.pdf`, title, headers, rows);
      }

      toast.success(`Exported ${usersToExport.length} users as ${format.toUpperCase()}!`, { id: toastId });
    } catch (err) {
      toast.error(ApiError.fromAxiosError(err).message || "Export failed", { id: toastId });
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
          User Management
        </h1>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export Dropdown */}
          <div className="relative" ref={exportRef}>
            <button
              type="button"
              onClick={() => setExportOpen((prev) => !prev)}
              disabled={exporting}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#f0a500] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d99400] disabled:opacity-60"
            >
              {exporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
              Export Logs (CSV / PDF)
              <ChevronDown className={cn("size-4 transition-transform", exportOpen && "rotate-180")} />
            </button>

            {exportOpen ? (
              <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-44 overflow-hidden rounded-xl border border-[#eef1f6] bg-white py-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => void handleExport("csv")}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-xs font-semibold text-[#374151] transition hover:bg-[#f8fafc]"
                >
                  <FileSpreadsheet className="size-4 text-[#16a34a]" />
                  Export as CSV
                </button>
                <button
                  type="button"
                  onClick={() => void handleExport("pdf")}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-xs font-semibold text-[#374151] transition hover:bg-[#f8fafc]"
                >
                  <FileText className="size-4 text-[#dc2626]" />
                  Export as PDF
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Original Filters: Country and DateRange */}
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

      <UsersTable 
        users={items} 
        loading={loading} 
        onDelete={handleDeleteUserClick}
        onToggleActive={handleToggleActive}
        togglingUserId={togglingUserId}
      />

      <Pagination
        currentPage={pagination.page || 1}
        totalPages={Math.max(1, pagination.totalPages || 1)}
        onPageChange={goToPage}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
        title="Delete User"
      >
        <div className="space-y-5">
          <p className="text-sm text-[#4b5563]">
            Are you sure you want to delete <strong className="font-semibold">{userToDelete?.username}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              disabled={deleting}
              onClick={() => setDeleteDialogOpen(false)}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#f3f4f6] px-5 text-sm font-semibold text-[#111827] transition hover:bg-[#e5e7eb]"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={handleConfirmDelete}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#ef4444] px-5 text-sm font-semibold text-white transition hover:bg-[#dc2626] disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
