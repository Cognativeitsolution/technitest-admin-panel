import type { PermissionRecord } from "@/types/role.types";

export type PermissionGroup = {
  module: string;
  permissions: PermissionRecord[];
};

export const PERMISSION_ACTIONS = [
  "read",
  "create",
  "update",
  "delete",
  "restore",
  "publish",
] as const;

export const PERMISSION_ACTION_LABELS: Record<string, string> = {
  read: "Read",
  create: "Create",
  update: "Update",
  delete: "Delete",
  restore: "Restore",
  publish: "Publish",
};

const ACTION_ORDER: Record<string, number> = {
  read: 0,
  create: 1,
  update: 2,
  delete: 3,
  restore: 4,
  publish: 5,
};

export function getPermissionAction(permission: PermissionRecord): string {
  const parts = permission.slug.split(":");
  return parts[parts.length - 1] ?? "read";
}

export function getPermissionActionLabel(permission: PermissionRecord): string {
  return PERMISSION_ACTION_LABELS[getPermissionAction(permission)] ?? permission.name;
}

export function formatModuleName(module: string): string {
  return module
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function groupPermissionsByModule(
  permissions: PermissionRecord[],
): PermissionGroup[] {
  const modules = new Map<string, PermissionRecord[]>();
  for (const permission of permissions) {
    const list = modules.get(permission.module) ?? [];
    list.push(permission);
    modules.set(permission.module, list);
  }

  return Array.from(modules.entries()).map(([module, list]) => ({
    module,
    permissions: [...list].sort((a, b) => {
      const aAction = getPermissionAction(a);
      const bAction = getPermissionAction(b);
      const aOrder = ACTION_ORDER[aAction] ?? 99;
      const bOrder = ACTION_ORDER[bAction] ?? 99;
      return aOrder - bOrder;
    }),
  }));
}