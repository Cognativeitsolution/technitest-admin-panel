"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

import type { ApiUser } from "@/types/user.types";
import { formatJoiningDate, formatUserRole } from "@/lib/user-utils";

type UsersTableProps = {
  users: ApiUser[];
  loading?: boolean;
  onEdit?: (user: ApiUser) => void;
  onDelete?: (user: ApiUser) => void;
  onToggleActive?: (user: ApiUser) => void;
  togglingUserId?: number | null;
};

export function UsersTable({ users, loading, onEdit, onDelete, onToggleActive, togglingUserId }: UsersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">Users</th>
              <th className="px-5 py-3.5">Email | Phone</th>
              <th className="px-5 py-3.5">User Role</th>
              <th className="px-5 py-3.5">Joining Date</th>
              <th className="px-5 py-3.5">Country</th>
              <th className="px-5 py-3.5">Quizzes Taken</th>
              <th className="px-5 py-3.5">Certificates</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="h-[720px]">
                <td colSpan={9} className="px-5 py-4 text-center text-sm text-gray-600 text-[18px] font-bold align-middle">
                  <div className="flex flex-col items-center justify-center">
                    <span>Getting users...</span>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr className="h-[720px]">
                <td colSpan={9} className="px-5 py-4 text-center text-sm text-gray-500 align-middle">
                  No users found.
                </td>
              </tr>
            ) : users.map((user) => (
              <tr
                key={user.id}
                className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]"
              >
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
                      <div className="flex size-10 items-center justify-center rounded-full bg-gray-200 text-gray-500 font-semibold text-sm">
                        {user.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#111827]">
                        {user.username}
                      </p>


                      {/* username */}

                      {/* <p className="truncate text-[13px] font-medium text-[#3b82f6]">
                        @{user.username}
                      </p> */}
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm text-[#374151]">{user.email}</p>
                  <p className="mt-0.5 text-[13px] text-[#6b7280]">
                    {user.phone || "-"}
                  </p>
                </td>

                <td className="px-5 py-4 text-sm font-medium text-[#374151]">
                  {formatUserRole(user.roles)}
                </td>

                <td className="px-5 py-4 text-sm text-[#374151]">
                  {formatJoiningDate(user.created_at)}
                </td>

                <td className="px-5 py-4 text-sm text-[#374151]">
                  {user.country?.name || "-"}
                </td>

                <td className="px-5 py-4 text-sm font-medium text-[#374151]">
                  {user.total_quizzes_attempted}
                </td>

                <td className="px-5 py-4 text-sm font-medium text-[#374151]">
                  {String(user.total_certificates_issued).padStart(2, "0")}
                </td>

                <td className="px-5 py-4">
                  <button
                    type="button"
                    disabled={togglingUserId === user.id}
                    onClick={() => onToggleActive?.(user)}
                    aria-label={user.is_active ? `Deactivate ${user.username}` : `Activate ${user.username}`}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                      user.is_active
                        ? "bg-[#22c55e] focus:ring-[#22c55e]"
                        : "bg-[#d1d5db] focus:ring-[#6b7280]"
                    }`}
                  >
                    <span
                      className={`inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        user.is_active ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/users/${user.id}`}
                      aria-label={`View ${user.username}`}
                      className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#3b82f6]"
                    >
                      <Eye className="size-4" />
                    </Link>
                    <Link
                      href={`/users/${user.id}/edit`}
                      aria-label={`Edit ${user.username}`}
                      className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]"
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <button
                      type="button"
                      aria-label={`Delete ${user.username}`}
                      onClick={() => onDelete?.(user)}
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
