"use client";

import Link from "next/link";
import { Settings, Sparkles, Bell, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type SettingsCardProps = {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
};

export function SettingsCard({ title, description, href, icon }: SettingsCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 rounded-2xl border border-[#e8ecf2] bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)] transition",
        "hover:shadow-[0_4px_12px_rgba(16,24,40,0.08)] hover:border-[#d1d5db]"
      )}
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] text-[#2563eb]">
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold text-[#111827]">{title}</h3>
        <p className="mt-1 text-[13px] leading-snug text-[#6b7280]">{description}</p>
      </div>
    </Link>
  );
}

export const settingsCards = [
  {
    title: "General Settings",
    description: "Configure the fundamental information of the site.",
    href: "/settings/general",
    icon: <Settings className="size-6" />,
  },
  {
    title: "Logo and Favicon",
    description: "Upload your logo and favicon here.",
    href: "/settings/logo-favicon",
    icon: <Sparkles className="size-6" />,
  },
  {
    title: "Notification Settings",
    description: "Control and configure overall notification elements of the system.",
    href: "/settings/notifications",
    icon: <Bell className="size-6" />,
  },
  {
    title: "SEO Configuration",
    description: "Configure SEO etc to make the system SEO-friendly.",
    href: "/settings/seo",
    icon: <Search className="size-6" />,
  },
];
