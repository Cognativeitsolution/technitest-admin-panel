"use client";

import { cn } from "@/lib/utils";

type ProfileTabsProps = {
  activeTab: "personal" | "password";
  onChange: (tab: "personal" | "password") => void;
};

export function ProfileTabs({ activeTab, onChange }: ProfileTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => onChange("personal")}
        className={cn(
          "rounded-full px-5 py-2.5 text-sm font-semibold transition",
          activeTab === "personal"
            ? "bg-[#1a1a1a] text-white"
            : "bg-transparent text-[#111111] hover:text-[#374151]",
        )}
      >
        Personal Information
      </button>
      <button
        type="button"
        onClick={() => onChange("password")}
        className={cn(
          "rounded-full px-5 py-2.5 text-sm font-semibold transition",
          activeTab === "password"
            ? "bg-[#1a1a1a] text-white"
            : "bg-transparent text-[#111111] hover:text-[#374151]",
        )}
      >
        Change Password
      </button>
    </div>
  );
}
