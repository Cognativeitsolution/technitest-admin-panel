"use client";

import {
  AlertCircle,
  Bell,
  CheckCheck,
  Clock3,
  Info,
  Lightbulb,
  XCircle,
} from "lucide-react";

import type { NotificationRecord, NotificationType } from "@/types/notification.types";
import { cn } from "@/lib/utils";

const iconMap: Record<
  NotificationType,
  { Icon: typeof Lightbulb; wrap: string; color: string }
> = {
  success: {
    Icon: Lightbulb,
    wrap: "bg-[#dbeafe]",
    color: "text-[#2563eb]",
  },
  info: {
    Icon: Info,
    wrap: "bg-[#e0f2fe]",
    color: "text-[#0284c7]",
  },
  warning: {
    Icon: AlertCircle,
    wrap: "bg-[#fef3c7]",
    color: "text-[#d97706]",
  },
  error: {
    Icon: XCircle,
    wrap: "bg-[#fee2e2]",
    color: "text-[#dc2626]",
  },
  reminder: {
    Icon: Bell,
    wrap: "bg-[#ede9fe]",
    color: "text-[#7c3aed]",
  },
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

type NotificationItemProps = {
  notification: NotificationRecord;
  onMarkAsRead: (id: number) => void;
};

export function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const { Icon, wrap, color } = iconMap[notification.type] ?? iconMap.info;

  return (
    <article
      className={cn(
        "flex items-start gap-4 border-b border-[#eef1f6] px-5 py-5 last:border-b-0",
        !notification.is_read && "bg-[#f8fbff]"
      )}
    >
      <div className="relative shrink-0">
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-full",
            wrap
          )}
        >
          <Icon className={cn("size-5", color)} />
        </div>
        {!notification.is_read ? (
          <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-white bg-[#f59e0b]" />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold text-[#111827] sm:text-[15px]">
          {notification.title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-[#6b7280]">
          {notification.message}
        </p>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-[#9ca3af]">
          <Clock3 className="size-3.5" />
          {formatTimeAgo(notification.created_at)}
        </div>
      </div>

      {!notification.is_read && (
        <button
          type="button"
          aria-label={`Mark notification ${notification.title} as read`}
          onClick={() => onMarkAsRead(notification.id)}
          className="shrink-0 rounded-lg p-2 text-[#2563eb] transition hover:bg-[#eef5ff]"
        >
          <CheckCheck className="size-4" />
        </button>
      )}
    </article>
  );
}