"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { SettingsCard, settingsCards } from "@/components/settings/settings-card";

export function SettingsView() {
  const [query, setQuery] = useState("");

  const filtered = settingsCards.filter((card) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return card.title.toLowerCase().includes(q) || card.description.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[28px] font-bold tracking-tight text-[#111827]">
          System Settings
        </h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9ca3af]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="h-10 w-full rounded-xl border border-[#e5e7eb] bg-white pl-10 pr-4 text-sm text-[#374151] shadow-sm outline-none transition placeholder:text-[#9ca3af] focus:border-[#dcdcdc] focus:ring-0"
          />
        </div>
      </div>

      <div className="h-px bg-[#eef1f6]" />

      {/* Cards */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((card) => (
            <SettingsCard key={card.href} {...card} />
          ))}
        </div>
      ) : (
        <p className="py-10 text-center text-sm text-[#6b7280]">No settings found.</p>
      )}
    </div>
  );
}
