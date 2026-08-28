"use client";

import { Users, ShieldCheck } from "lucide-react";

type RolesTabBarProps = {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  active: string;
  counts?: Record<string, number>;
  onChange: (id: string) => void;
};

export function RolesTabBar({
  tabs,
  active,
  counts = {},
  onChange,
}: RolesTabBarProps) {
  return (
    <div className="flex w-fit items-center gap-1 rounded-xl border border-[#e5e7eb] bg-white p-1 shadow-sm">
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        const count = counts[tab.id];
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`inline-flex h-10 items-center gap-2 rounded-lg px-5 text-sm font-semibold transition ${
              isActive
                ? "bg-[#111827] text-white shadow-sm"
                : "text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#374151]"
            }`}
          >
            {tab.icon ?? null}
            {tab.label}
            {count != null ? (
              <span
                className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                  isActive ? "bg-white/15 text-white" : "bg-[#f3f4f6] text-[#6b7280]"
                }`}
              >
                {count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export const rolesTabIcons = {
  users: <Users className="size-4" />,
  roles: <ShieldCheck className="size-4" />,
};