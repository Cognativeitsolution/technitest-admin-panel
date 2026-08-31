import { ChevronDown } from "lucide-react";

import type { RecentActivityItem } from "@/services/dashboard.service";

type RecentActivityProps = {
  activities?: RecentActivityItem[];
};

const fallbackActivities: RecentActivityItem[] = [
  {
    type: "quiz_completed",
    reference_id: 1,
    user_id: 1,
    username: "Amina Khan",
    avatar_url: null,
    description: "Amina Khan completed 'Advanced SEO Quiz' — scored 94% 🏆",
    subject: "Advanced SEO Quiz",
    detail: "scored 94%",
    created_at: "2025-11-12T14:14:00",
  },
  {
    type: "certificate_earned",
    reference_id: 2,
    user_id: 2,
    username: "John Smith",
    avatar_url: null,
    description: "John Smith earned a Certificate in Digital Marketing",
    subject: "Digital Marketing",
    detail: "certificate earned",
    created_at: "2025-11-12T13:02:00",
  },
  {
    type: "coins_earned",
    reference_id: 3,
    user_id: 3,
    username: "Sara Ali",
    avatar_url: null,
    description: "Sara Ali referred 3 new users and earned 150 coins",
    subject: "Referral bonus",
    detail: "+150 coins",
    created_at: "2025-11-11T20:45:00",
  },
];

function formatActivityTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function RecentActivity({ activities = fallbackActivities }: RecentActivityProps) {
  return (
    <section className="rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[#111827]">
          Recent User Activity
        </h2>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 text-sm font-medium text-[#374151]"
        >
          Last 30 Days
          <ChevronDown className="size-3.5 text-[#9ca3af]" />
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-[#e5e7eb] bg-[#fafbfc] text-sm font-medium text-[#6b7280]">
          No data found
        </div>
      ) : (
        <ul className="divide-y divide-[#eef1f6]">
          {activities.map((activity) => (
            <li
              key={`${activity.type}-${activity.reference_id}`}
              className="flex flex-col gap-1 py-3.5 first:pt-1 last:pb-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <p className="text-sm font-medium text-[#374151]">{activity.description}</p>
              <span className="shrink-0 text-xs font-medium text-[#9ca3af]">
                {formatActivityTime(activity.created_at)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
