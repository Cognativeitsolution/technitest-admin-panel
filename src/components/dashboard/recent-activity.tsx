import { ChevronDown } from "lucide-react";

const activities = [
  {
    text: "Amina Khan completed 'Advanced SEO Quiz' — scored 94% 🏆",
    time: "12 Nov 2025, 2:14 PM",
  },
  {
    text: "John Smith earned a Certificate in Digital Marketing",
    time: "12 Nov 2025, 1:02 PM",
  },
  {
    text: "Sara Ali referred 3 new users and earned 150 coins",
    time: "11 Nov 2025, 8:45 PM",
  },
  {
    text: "Usman Raza started 'Frontend Fundamentals' quiz",
    time: "11 Nov 2025, 6:20 PM",
  },
  {
    text: "Hira Malik left a 5-star review on UX Design Path",
    time: "11 Nov 2025, 4:11 PM",
  },
];

export function RecentActivity() {
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

      <ul className="divide-y divide-[#eef1f6]">
        {activities.map((activity) => (
          <li
            key={`${activity.text}-${activity.time}`}
            className="flex flex-col gap-1 py-3.5 first:pt-1 last:pb-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <p className="text-sm font-medium text-[#374151]">{activity.text}</p>
            <span className="shrink-0 text-xs font-medium text-[#9ca3af]">
              {activity.time}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
