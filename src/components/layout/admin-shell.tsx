"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebar-store";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { GuestRoute } from "@/components/auth/guest-route";

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const { collapsed } = useSidebarStore();
  const pathname = usePathname();

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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f5f6fa]">
        <Sidebar />
        <div
          className={cn(
            "flex min-h-screen flex-col transition-[padding] duration-300",
            collapsed ? "lg:pl-[84px]" : "lg:pl-[260px]"
          )}
        >
          <Header />
          <main className="flex-1 px-6 py-7 sm:px-10 lg:px-12 xl:px-16">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
