"use client";

import {
  AlertCircle,
  Clock3,
  Info,
  Lightbulb,
  Star,
  Trash2,
} from "lucide-react";

import type { AppNotification, NotificationIconType } from "@/data/notifications";
import { cn } from "@/lib/utils";

const iconMap: Record<
  NotificationIconType,
  { Icon: typeof Lightbulb; wrap: string; color: string }
> = {
  success: {
    Icon: Lightbulb,
    wrap: "bg-[#dbeafe]",
    color: "text-[#2563eb]",
  },
  alert: {
    Icon: AlertCircle,
    wrap: "bg-[#fee2e2]",
    color: "text-[#dc2626]",
  },
  info: {
    Icon: Info,
    wrap: "bg-[#e0f2fe]",
    color: "text-[#0284c7]",
  },
  award: {
    Icon: Star,
    wrap: "bg-[#fef3c7]",
    color: "text-[#d97706]",
  },
};

type NotificationItemProps = {
  notification: AppNotification;
  onDelete: (id: string) => void;
};

export function NotificationItem({
  notification,
  onDelete,
}: NotificationItemProps) {
  const { Icon, wrap, color } = iconMap[notification.icon];

  return (
    <article
      className={cn(
        "flex items-start gap-4 border-b border-[#eef1f6] px-5 py-5 last:border-b-0",
        !notification.read && "bg-[#f8fbff]"
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
        {!notification.read ? (
          <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-white bg-[#f59e0b]" />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold text-[#111827] sm:text-[15px]">
          {notification.title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-[#6b7280]">
          {notification.description}
        </p>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-[#9ca3af]">
          <Clock3 className="size-3.5" />
          {notification.timeAgo}
        </div>
      </div>

      <button
        type="button"
        aria-label={`Delete notification ${notification.title}`}
        onClick={() => onDelete(notification.id)}
        className="shrink-0 rounded-lg p-2 text-[#ef4444] transition hover:bg-[#fef2f2]"
      >
        <Trash2 className="size-4" />
      </button>
    </article>
  );
}
