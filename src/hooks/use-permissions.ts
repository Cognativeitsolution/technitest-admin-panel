"use client";

import {
  canAccessModules,
  hasAnyPermission,
  hasModulePermission,
  hasPermission,
  isSuperAdmin,
} from "@/lib/permissions";
import { useAuthStore } from "@/store/auth-store";

export function usePermissions() {
  const roles = useAuthStore((s) => s.roles);
  const permissions = useAuthStore((s) => s.permissions);

  return {
    roles,
    permissions,
    isAuthenticated: useAuthStore((s) => s.isAuthenticated),
    isLoading: useAuthStore((s) => s.isLoading),
    isSuperAdmin: () => isSuperAdmin(roles),
    can: (slug: string) =>
      isSuperAdmin(roles) || hasPermission(permissions, slug),
    canAny: (slugs: string[]) =>
      isSuperAdmin(roles) || hasAnyPermission(permissions, slugs),
    hasModule: (module: string) =>
      isSuperAdmin(roles) || hasModulePermission(permissions, module),
    canAccess: (modules?: string[]) =>
      canAccessModules(roles, permissions, modules),
  };
}