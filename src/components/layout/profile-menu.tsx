"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Info,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";

const menuItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    label: "Help & Support",
    href: "/support",
    icon: Info,
  },
  {
    label: "Logout",
    href: "/logout",
    icon: LogOut,
  },
] as const;

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2.5 rounded-lg px-1.5 py-1 transition hover:bg-[#f3f4f6]"
      >
        <Image
          src="https://i.pravatar.cc/80?img=12"
          alt="Ammad Aslam"
          width={36}
          height={36}
          className="size-9 rounded-full object-cover"
        />
        <span className="hidden text-sm font-semibold text-[#111827] md:inline">
          Ammad Aslam
        </span>
        <ChevronDown
          className={cn(
            "hidden size-4 text-[#6b7280] transition md:block",
            open && "rotate-180"
          )}
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute top-[calc(100%+12px)] right-0 z-50 w-[220px]"
        >
          <div className="absolute -top-2 right-8 size-4 rotate-45 rounded-[2px] bg-white shadow-sm" />
          <div className="relative overflow-hidden rounded-2xl border border-[#eef1f6] bg-white shadow-[0_12px_30px_rgba(16,24,40,0.14)]">
            <ul>
              {menuItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <li key={item.label}>
                    {index > 0 ? (
                      <div className="h-px bg-[#eef1f6]" />
                    ) : null}
                    <Link
                      href={item.href}
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-[#111827] transition hover:bg-[#f8fafc]"
                    >
                      <Icon className="size-[18px] text-[#374151]" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
