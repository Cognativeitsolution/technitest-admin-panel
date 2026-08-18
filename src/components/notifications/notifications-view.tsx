"use client";

import { useMemo, useState } from "react";
import { CheckCheck, Search, Trash2 } from "lucide-react";

import { NotificationItem } from "@/components/notifications/notification-item";
import { Dialog } from "@/components/ui/dialog";
import { notifications as initialNotifications } from "@/data/notifications";

export function NotificationsView() {
  const [items, setItems] = useState(initialNotifications);
  const [query, setQuery] = useState("");
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }, [items, query]);

  function markAllAsRead() {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
  }

  function deleteOne(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function deleteAll() {
    setItems([]);
    setConfirmDeleteAll(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 border-b border-[#eef1f6] pb-5 lg:flex-row lg:items-center lg:gap-6">
        <h1 className="shrink-0 text-[28px] font-bold tracking-tight text-[#111827]">
          Notifications
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
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#22c55e] bg-white px-4 text-sm font-medium text-[#16a34a] transition hover:bg-[#f0fdf4]"
          >
            <CheckCheck className="size-4" />
            Mark all as Read
          </button>
          <button
            type="button"
            onClick={() => setConfirmDeleteAll(true)}
            disabled={items.length === 0}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#ef4444] bg-white px-4 text-sm font-medium text-[#ef4444] transition hover:bg-[#fef2f2] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="size-4" />
            Delete all Notification
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e8ecf2] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
        {filtered.length > 0 ? (
          filtered.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onDelete={deleteOne}
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

      <Dialog
        open={confirmDeleteAll}
        onClose={() => setConfirmDeleteAll(false)}
        title="Delete all Notifications"
        maxWidth="max-w-sm"
      >
        <p className="text-sm text-[#4b5563]">
          Are you sure you want to delete all notifications? This action cannot
          be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setConfirmDeleteAll(false)}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e5e7eb] px-4 text-sm font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={deleteAll}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#ef4444] px-4 text-sm font-semibold text-white transition hover:bg-[#dc2626]"
          >
            Delete all
          </button>
        </div>
      </Dialog>
    </div>
  );
}
