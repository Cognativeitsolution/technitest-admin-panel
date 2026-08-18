"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

import type { UserRecord } from "@/data/users";

type UsersTableProps = {
  users: UserRecord[];
  onEdit?: (user: UserRecord) => void;
  onDelete?: (user: UserRecord) => void;
};

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eef5ff] text-[13px] font-semibold text-[#374151]">
              <th className="px-5 py-3.5">Users</th>
              <th className="px-5 py-3.5">Email | Phone</th>
              <th className="px-5 py-3.5">Country</th>
              <th className="px-5 py-3.5">Quizzes Taken</th>
              <th className="px-5 py-3.5">Certificates</th>
              <th className="px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t border-[#eef1f6] transition hover:bg-[#fafbfc]"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="size-10 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#111827]">
                        {user.name}
                      </p>
                      <p className="truncate text-[13px] font-medium text-[#3b82f6]">
                        @{user.username}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm text-[#374151]">{user.email}</p>
                  <p className="mt-0.5 text-[13px] text-[#6b7280]">
                    {user.phone}
                  </p>
                </td>

                <td className="px-5 py-4 text-sm text-[#374151]">
                  {user.country}
                </td>

                <td className="px-5 py-4 text-sm font-medium text-[#374151]">
                  {user.quizzesTaken}
                </td>

                <td className="px-5 py-4 text-sm font-medium text-[#374151]">
                  {String(user.certificates).padStart(2, "0")}
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/users/${user.id}`}
                      aria-label={`View ${user.name}`}
                      className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#3b82f6]"
                    >
                      <Eye className="size-4" />
                    </Link>
                    <button
                      type="button"
                      aria-label={`Edit ${user.name}`}
                      onClick={() => onEdit?.(user)}
                      className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#f0a500]"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${user.name}`}
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
