"use client";

import { useMemo, useState } from "react";
import { CheckCheck, Loader2, Search } from "lucide-react";

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
        item.message.toLowerCase().includes(q)
    );
  }, [items, query]);

  const hasUnread = filtered.some((item) => !item.is_read);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 border-b border-[#eef1f6] pb-5 lg:flex-row lg:items-center lg:gap-6">
        <h1 className="shrink-0 text-[28px] font-bold tracking-tight text-[#111827]">
          Notifications
          {unreadCount > 0 && (
            <span className="ml-3 inline-flex h-6 items-center rounded-full bg-[#fef3c7] px-2.5 text-xs font-semibold text-[#d97706]">
              {unreadCount} unread
            </span>
          )}
        </h1>

        <div className="relative w-full max-w-[320px] lg:ml-2">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#9ca3af]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="h-10 w-full rounded-lg border border-[#e5e7eb] bg-white pr-4 pl-10 text-sm text-[#374151] outline-none transition placeholder:text-[#9ca3af] focus:border-[#d1d5db] focus:ring-0"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:ml-auto">
          <button
            type="button"
            onClick={markAllAsRead}
            disabled={!hasUnread || mutating}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-[#22c55e] bg-white px-4 text-sm font-medium text-[#16a34a] transition hover:bg-[#f0fdf4] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCheck className="size-4" />
            Mark all as Read
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#ef4444]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-[#e8ecf2] bg-white py-16">
          <Loader2 className="size-6 animate-spin text-[#2563eb]" />
          <span className="ml-2 text-sm text-[#6b7280]">
            Loading notifications...
          </span>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
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

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
}