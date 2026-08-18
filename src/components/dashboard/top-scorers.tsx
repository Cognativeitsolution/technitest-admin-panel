import Image from "next/image";
import { Star } from "lucide-react";

const scorers = [
  {
    name: "Shalina David",
    score: "95%",
    avatar: "https://i.pravatar.cc/80?img=5",
  },
  {
    name: "John Smith",
    score: "93%",
    avatar: "https://i.pravatar.cc/80?img=33",
  },
  {
    name: "Amina Khan",
    score: "92%",
    avatar: "https://i.pravatar.cc/80?img=47",
  },
];

export function TopScorers() {
  return (
    <section className="rounded-2xl border border-[#eef1f6] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
      <h2 className="mb-4 text-lg font-bold text-[#111827]">Top Scorers</h2>

      <ul className="space-y-3">
        {scorers.map((scorer) => (
          <li
            key={scorer.name}
            className="flex items-center gap-3 rounded-xl border border-[#f1f3f7] bg-[#fafbfc] px-3 py-3"
          >
            <Image
              src={scorer.avatar}
              alt={scorer.name}
              width={42}
              height={42}
              className="size-[42px] rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#111827]">
                {scorer.name}
              </p>
              <div className="mt-1 flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className="size-3.5 fill-[#fbbf24] text-[#fbbf24]"
                  />
                ))}
              </div>
            </div>
            <span className="text-sm font-bold text-[#111827]">
              {scorer.score}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
