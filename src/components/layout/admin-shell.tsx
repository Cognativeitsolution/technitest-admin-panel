"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { AccessDenied } from "@/components/auth/access-denied";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { GuestRoute } from "@/components/auth/guest-route";
import { findNavItemForPath } from "@/config/navigation";
import { getSidebarWidthPx } from "@/config/layout";
import { usePermissions } from "@/hooks/use-permissions";
import { useSidebarStore } from "@/store/sidebar-store";

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const { collapsed } = useSidebarStore();
  const pathname = usePathname();
  const { canAccess, isLoading } = usePermissions();

  const isAuthPage =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/signup") ||
    pathname?.startsWith("/forgot-password") ||
    pathname?.startsWith("/reset-password") ||
    pathname?.startsWith("/verify");

  if (isAuthPage) {
    return (
      <GuestRoute>
        <main className="min-h-screen bg-white">{children}</main>
      </GuestRoute>
    );
  }

  const navItem = pathname ? findNavItemForPath(pathname) : undefined;
  const authorized = isLoading || !navItem || canAccess(navItem.modules);

  return (
    <ProtectedRoute>
      <div
        className="min-h-screen bg-[#f5f6fa]"
        style={
          {
            "--sidebar-width": `${getSidebarWidthPx(collapsed)}px`,
          } as React.CSSProperties
        }
      >
        <Sidebar />
        <div className="admin-main-offset flex min-h-screen min-w-0 flex-col transition-[padding-left] duration-300">
          <Header />
          <main className="min-w-0 flex-1 overflow-x-hidden px-6 py-7 pb-16 sm:px-10 lg:px-12 xl:px-16">
            {authorized ? children : <AccessDenied />}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}