"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

import { DropdownMenu } from "@/components/shared/dropdown-menu";
import { Pagination } from "@/components/shared/pagination";
import { DateRangePicker, type DateRange } from "@/components/ui/date-range-picker";
import { Dialog } from "@/components/ui/dialog";
import { useUsers } from "@/hooks/users/use-users";
import { useCountries } from "@/hooks/locations/use-countries";
import { userService } from "@/services/user.service";
import { ApiError } from "@/lib/api-error";
import { downloadCsv, downloadPdf } from "@/lib/export-file";
import { formatJoiningDate, formatUserRole } from "@/lib/user-utils";
import { cn } from "@/lib/utils";
import type { ApiUser } from "@/types/user.types";

const PAGE_SIZE = 10;

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/** Convert slug like "super-admin" → "Super Admin" */
function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

type RoleUsersViewProps = {
  roleSlug: string;
};

export function RoleUsersView({ roleSlug }: RoleUsersViewProps) {
  const router = useRouter();

  // Redirect "student" slug straight to /users
  useEffect(() => {
    if (roleSlug === "student") router.replace("/users");
  }, [roleSlug, router]);

  // Derive display title immediately from slug (no loading wait needed)
  const roleTitle = slugToTitle(roleSlug);

  // ── Filters ───────────────────────────────────────────────────────────────
  const { countries, countryData, loading: countriesLoading } = useCountries();
  const [country, setCountry] = useState("All Countries");
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });

  // ── Export dropdown ───────────────────────────────────────────────────────
  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    }
    if (exportOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [exportOpen]);

  // ── Delete dialog ─────────────────────────────────────────────────────────
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<ApiUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Toggle active ─────────────────────────────────────────────────────────
  const [togglingUserId, setTogglingUserId] = useState<number | null>(null);

  // ── Users data ────────────────────────────────────────────────────────────
  const selectedCountryId =
    country === "All Countries"
      ? undefined
      : countryData?.find((c) => c.name === country)?.id;

  const { items, pagination, loading, goToPage, mutateItems, refresh } = useUsers({
    perPage: PAGE_SIZE,
    role_slug: roleSlug,
    country_id: selectedCountryId ? String(selectedCountryId) : undefined,
    start_date: dateRange.start ? formatDate(dateRange.start) : undefined,
    end_date: dateRange.end ? formatDate(dateRange.end) : undefined,
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
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
      mutateItems((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
    } catch (error) {
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
        await userService.deleteUser(user.id);
        mutateItems((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, is_active: false } : u))
        );
        toast.success(`${user.username} has been deactivated`);
      } else {
        await userService.restoreUser(user.id);
        mutateItems((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, is_active: true } : u))
        );
        toast.success(`${user.username} has been activated`);
      }
    } catch (error) {
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
          role_slug: roleSlug,
          country_id: selectedCountryId ? String(selectedCountryId) : undefined,
          start_date: dateRange.start ? formatDate(dateRange.start) : undefined,
          end_date: dateRange.end ? formatDate(dateRange.end) : undefined,
        });
        usersToExport = Array.isArray(result) ? result : (result?.items ?? items);
      } catch {
        usersToExport = items;
      }

      if (usersToExport.length === 0) {
        toast.error("No user data available to export.", { id: toastId });
        return;
      }

      const dateStr = new Date().toISOString().slice(0, 10);
      const filename = `${roleSlug}-users-${dateStr}`;
      const title = `${roleTitle} — Users Report`;
      const headers = [
        "Username", "Email", "Phone", "User Role",
        "Joining Date", "Country", "Quizzes Taken", "Certificates Issued",
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

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/roles"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6b7280] transition hover:text-[#111827]"
          >
            <ArrowLeft className="size-4" />
            Roles
          </Link>
          <span className="h-5 w-px bg-[#d1d5db]" />
          <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
            {roleTitle}
          </h1>
          <span className="rounded-full bg-[#111827] px-3.5 py-1.5 text-sm font-semibold text-white">
            Users
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative" ref={exportRef}>
            <button
              type="button"
              onClick={() => setExportOpen((prev) => !prev)}
              disabled={exporting}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#f0a500] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d99400] disabled:opacity-60"
            >
              {exporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
              Export
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

      {/* Filters */}
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

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left">
            <thead>
              <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
                <th className="px-5 py-3.5">Users</th>
                <th className="px-5 py-3.5">Email | Phone</th>
                <th className="px-5 py-3.5">User Role</th>
                <th className="px-5 py-3.5">Joining Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="h-[400px]">
                  <td colSpan={6} className="px-5 py-4 text-center align-middle text-[18px] font-bold text-gray-600">
                    Getting users...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr className="h-[400px]">
                  <td colSpan={6} className="px-5 py-4 text-center align-middle text-sm text-gray-500">
                    No users found for this role.
                  </td>
                </tr>
              ) : (
                items.map((user) => (
                  <tr key={user.id} className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]">
                    {/* Avatar + name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar_url ? (
                          <Image
                            src={user.avatar_url}
                            alt={user.username || "User avatar"}
                            width={40}
                            height={40}
                            className="size-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex size-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-500">
                            {user.username?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                        <p className="truncate text-sm font-semibold text-[#111827]">
                          {user.username}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-[#374151]">{user.email}</p>
                      <p className="mt-0.5 text-[13px] text-[#6b7280]">{user.phone || "-"}</p>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-[#374151]">
                      {formatUserRole(user.roles)}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#374151]">
                      {formatJoiningDate(user.created_at)}
                    </td>

                    {/* Active toggle */}
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        disabled={togglingUserId === user.id}
                        onClick={() => handleToggleActive(user)}
                        aria-label={user.is_active ? `Deactivate ${user.username}` : `Activate ${user.username}`}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                          user.is_active
                            ? "bg-[#22c55e] focus:ring-[#22c55e]"
                            : "bg-[#d1d5db] focus:ring-[#6b7280]"
                        }`}
                      >
                        <span className={`inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${user.is_active ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        {user.is_active ? (
                          <Link
                            href={`/roles/${roleSlug}/view-user/${user.id}`}
                            aria-label={`View ${user.username}`}
                            className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#3b82f6]"
                          >
                            <Eye className="size-4" />
                          </Link>
                        ) : (
                          <span className="rounded-lg p-2 text-[#d1d5db] cursor-not-allowed">
                            <Eye className="size-4" />
                          </span>
                        )}
                        {user.is_active ? (
                          <Link
                            href={`/roles/${roleSlug}/edit-user/${user.id}`}
                            aria-label={`Edit ${user.username}`}
                            className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]"
                          >
                            <Pencil className="size-4" />
                          </Link>
                        ) : (
                          <span className="rounded-lg p-2 text-[#d1d5db] cursor-not-allowed">
                            <Pencil className="size-4" />
                          </span>
                        )}
                        <button
                          type="button"
                          aria-label={`Delete ${user.username}`}
                          onClick={() => handleDeleteUserClick(user)}
                          className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#fef2f2] hover:text-[#ef4444]"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={pagination.page || 1}
        totalPages={Math.max(1, pagination.totalPages || 1)}
        onPageChange={goToPage}
      />

      {/* Delete confirmation */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
        title="Delete User"
      >
        <div className="space-y-5">
          <p className="text-sm text-[#4b5563]">
            Are you sure you want to delete{" "}
            <strong className="font-semibold">{userToDelete?.username}</strong>?
            This action cannot be undone.
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
