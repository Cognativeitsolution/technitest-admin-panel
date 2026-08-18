"use client";

import Image from "next/image";
import { Bell, Menu } from "lucide-react";

import { ProfileMenu } from "@/components/layout/profile-menu";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebar-store";

type HeaderProps = {
  className?: string;
};

export function Header({ className }: HeaderProps) {
  const { setMobileOpen } = useSidebarStore();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-[72px] items-center justify-between gap-3 border-b border-[#eef1f6] bg-white px-6 sm:px-10 lg:px-12 xl:px-16",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Open sidebar"
          className="rounded-lg p-2 text-[#4b5563] transition hover:bg-[#f3f4f6] lg:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="size-5" />
        </button>
        <Image
          src="/TechLogo.png"
          alt="Technitest"
          width={160}
          height={40}
          className="h-9 w-auto object-contain"
          priority
        />
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-[#4b5563] transition hover:bg-[#f3f4f6]"
        >
          <Bell className="size-[18px]" />
          <span className="hidden sm:inline">Notifications</span>
        </button>

        <ProfileMenu />
      </div>
    </header>
  );
}
