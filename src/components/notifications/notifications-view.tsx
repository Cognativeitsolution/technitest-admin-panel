"use client";

import { useMemo, useState } from "react";
import { Bell, CheckCheck, Loader2, Search } from "lucide-react";

import { NotificationItem } from "@/components/notifications/notification-item";
import { Pagination } from "@/components/shared/pagination";
import { useNotifications } from "@/hooks/notifications/use-notifications";

export function NotificationsView() {
  const {
    items,
    pagination,
    unreadCount,
    loading,
    error,
    mutating,
    goToPage,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q),
    );
  }, [items, query]);

  const hasUnread = filtered.some((item) => !item.is_read);

  return (
    <div className="space-y-5">
      <div className="rounded-[10px] border border-[#e5eaf2] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#dbeafe]">
              <Bell className="size-5 text-[#2563eb]" />
            </div>
            <div>
              <h1 className="flex flex-wrap items-center gap-2 text-[22px] font-bold tracking-tight text-[#1e293b] sm:text-[24px]">
                Notifications
                {unreadCount > 0 ? (
                  <span className="inline-flex h-6 items-center rounded-full bg-[#fef3c7] px-2.5 text-xs font-semibold text-[#d97706]">
                    {unreadCount} unread
                  </span>
                ) : null}
              </h1>
              <p className="mt-0.5 text-sm text-[#64748b]">
                Stay updated on quizzes, certificates, payments, and system alerts.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative w-full max-w-[280px] sm:w-[240px]">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#9ca3af]" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-white pr-4 pl-10 text-sm text-[#374151] outline-none transition placeholder:text-[#9ca3af] focus:border-[#93c5fd] focus:ring-2 focus:ring-[#3b82f6]/15"
              />
            </div>

            <button
              type="button"
              onClick={markAllAsRead}
              disabled={!hasUnread || mutating}
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-[#2563eb] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCheck className="size-4" />
              Mark all as Read
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#ef4444]">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center rounded-[10px] border border-[#e5eaf2] bg-white py-16 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <Loader2 className="size-6 animate-spin text-[#2563eb]" />
          <span className="ml-2 text-sm text-[#6b7280]">Loading notifications...</span>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[10px] border border-[#e5eaf2] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          {filtered.length > 0 ? (
            filtered.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
              />
            ))
          ) : (
            <div className="px-5 py-16 text-center">
              <p className="text-sm font-medium text-[#6b7280]">
                {query
                  ? "No notifications match your search."
                  : "No notifications yet."}
              </p>
            </div>
          )}
        </div>
      )}

      {pagination.totalPages > 1 ? (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={goToPage}
        />
      ) : null}
    </div>
  );
}
