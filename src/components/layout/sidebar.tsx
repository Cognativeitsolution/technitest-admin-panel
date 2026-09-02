"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";

import { navItems } from "@/config/navigation";
import {
  SIDEBAR_WIDTH_COLLAPSED_PX,
  SIDEBAR_WIDTH_EXPANDED_PX,
} from "@/config/layout";
import { usePermissions } from "@/hooks/use-permissions";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebar-store";

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, mobileOpen, toggleCollapsed, setMobileOpen } =
    useSidebarStore();
  const { canAccess, isLoading } = usePermissions();

  const visibleItems = isLoading ? [] : navItems.filter((item) => canAccess(item.modules));

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
          width: collapsed ? SIDEBAR_WIDTH_COLLAPSED_PX : SIDEBAR_WIDTH_EXPANDED_PX,
        }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-[#e8ecf2] bg-[#f7f8fa] transition-[width] duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div
          className={cn(
            "flex h-14 shrink-0 items-center border-b border-[#e8ecf2] px-3",
            collapsed ? "justify-center" : "justify-between gap-2",
          )}
        >
          {!collapsed ? (
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label="Collapse sidebar"
              className="hidden lg:inline-flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-xs font-medium text-[#6b7280] shadow-sm transition hover:border-[#d1d5db] hover:bg-[#fafbfc] hover:text-[#111827]"
            >
              <PanelLeftClose className="size-4" />
              <span>Collapse sidebar</span>
            </button>
          ) : (
            <button
              type="button"
              aria-label="Expand sidebar"
              onClick={toggleCollapsed}
              className="hidden lg:inline-flex size-9 items-center justify-center rounded-lg border border-[#e5e7eb] bg-white text-[#6b7280] shadow-sm transition hover:border-[#d1d5db] hover:bg-[#fafbfc] hover:text-[#111827]"
            >
              <PanelLeftOpen className="size-4" />
            </button>
          )}

          <button
            type="button"
            aria-label="Close sidebar"
            className="ml-auto inline-flex size-9 items-center justify-center rounded-lg border border-[#e5e7eb] bg-white text-[#6b7280] shadow-sm transition hover:border-[#d1d5db] hover:bg-[#fafbfc] hover:text-[#111827] lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1.5">
            {visibleItems.map((item) => {
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
                        "size-4.5 shrink-0",
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
