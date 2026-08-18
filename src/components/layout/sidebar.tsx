"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftOpen, X } from "lucide-react";

import { navItems } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebar-store";

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, mobileOpen, toggleCollapsed, setMobileOpen } =
    useSidebarStore();

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
      style={{
        boxShadow: "4px 0px 27.2px 1px #E4EDFA",
      }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-[#e8ecf2] bg-[#f7f8fa] transition-all duration-300",
          collapsed ? "w-21" : "w-70",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div
          className={cn(
            "flex h-14 items-center border-b border-[#e8ecf2] px-4",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          {!collapsed ? (
            <button
              type="button"
              onClick={toggleCollapsed}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#6b7280] transition hover:text-[#111827]"
            >
              <X className="size-[18px]" />
              Collapse
            </button>
          ) : (
            <button
              type="button"
              aria-label="Expand sidebar"
              onClick={toggleCollapsed}
              className="rounded-lg p-2 text-[#6b7280] transition hover:bg-white hover:text-[#111827]"
            >
              <PanelLeftOpen className="size-[18px]" />
            </button>
          )}

          <button
            type="button"
            aria-label="Close sidebar"
            className="rounded-lg p-1.5 text-[#6b7280] transition hover:bg-white hover:text-[#111827] lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "group flex items-center gap-3 rounded-md p-3 text-[14px] font-medium transition-colors",
                      collapsed && "justify-center px-2",
                      isActive
                        ? "bg-[#2533F1] text-white shadow-sm shadow-blue-500/25"
                        : "text-black hover:bg-white hover:text-[#111827]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-[18px] shrink-0",
                        isActive ? "text-white" : "text-[#6b7280]"
                      )}
                    />
                    {!collapsed ? <span>{item.label}</span> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
