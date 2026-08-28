"use client";

import { usePermissions } from "@/hooks/use-permissions";

type CanProps = {
  permission?: string;
  anyPermission?: string[];
  module?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

export function Can({
  permission,
  anyPermission,
  module,
  fallback = null,
  children,
}: CanProps) {
  const { can, canAny, hasModule } = usePermissions();

  const allowed =
    (permission ? can(permission) : false) ||
    (anyPermission ? canAny(anyPermission) : false) ||
    (module ? hasModule(module) : false);

  return allowed ? <>{children}</> : <>{fallback}</>;
}