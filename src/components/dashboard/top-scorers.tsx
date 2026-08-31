import Image from "next/image";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import type { TopScorerItem } from "@/services/dashboard.service";

type TopScorersProps = {
  scorers?: TopScorerItem[];
};

const fallbackScorers: TopScorerItem[] = [
  {
    certificate_id: 1,
    user_id: 1,
    username: "Shalina David",
    email: "test@example.com",
    avatar_url: "https://i.pravatar.cc/80?img=5",
    quiz_name: "Advanced SEO Quiz",
    score: 95,
    percentage: 95,
    stars: 5,
    issued_at: new Date().toISOString(),
  },
  {
    certificate_id: 2,
    user_id: 2,
    username: "John Smith",
    email: "test2@example.com",
    avatar_url: "https://i.pravatar.cc/80?img=33",
    quiz_name: "Digital Marketing",
    score: 93,
    percentage: 93,
    stars: 5,
    issued_at: new Date().toISOString(),
  },
  {
    certificate_id: 3,
    user_id: 3,
    username: "Amina Khan",
    email: "test3@example.com",
    avatar_url: "https://i.pravatar.cc/80?img=47",
    quiz_name: "UX Design Path",
    score: 92,
    percentage: 92,
    stars: 5,
    issued_at: new Date().toISOString(),
  },
];

export function TopScorers({ scorers = fallbackScorers }: TopScorersProps) {
  return (
    <section className="rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <h2 className="mb-4 text-lg font-bold text-[#111827]">Top Scorers</h2>

      {scorers.length === 0 ? (
        <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-[#e5e7eb] bg-[#fafbfc] text-sm font-medium text-[#6b7280]">
          No data found
        </div>
      ) : (
        <ul className="space-y-3">
          {scorers.map((scorer) => {
            const starCount = scorer.stars ?? Math.max(1, Math.min(5, Math.round(scorer.percentage / 20)));
            const avatar = scorer.avatar_url || "https://i.pravatar.cc/80?img=5";

            return (
              <li
                key={`${scorer.user_id}-${scorer.certificate_id}`}
                className="flex items-center gap-3 rounded-xl border border-[#f1f3f7] bg-[#fafbfc] px-3 py-3"
              >
                <Image
                  src={avatar}
                  alt={scorer.username}
                  width={42}
                  height={42}
                  className="size-[42px] rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#111827]">
                    {scorer.username}
                  </p>
                  <div className="mt-1 flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={`${scorer.user_id}-${index}`}
                        className={cn(
                          "size-3.5",
                          index < starCount ? "fill-[#fbbf24] text-[#fbbf24]" : "text-[#d1d5db]"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm font-bold text-[#111827]">
                  {Math.round(scorer.percentage)}%
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
