export type AccessTokenClaims = {
  sub?: string;
  roles?: string[];
  permissions?: string[];
  [key: string]: unknown;
};

function decodeBase64Url(segment: string): string {
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return globalThis.atob(normalized + padding);
}

export function decodeAccessToken(token: string): AccessTokenClaims | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = decodeBase64Url(payload);
    const claims = JSON.parse(json) as AccessTokenClaims;
    return {
      ...claims,
      roles: Array.isArray(claims.roles) ? claims.roles.map(String) : [],
      permissions: Array.isArray(claims.permissions)
        ? claims.permissions.map(String)
        : [],
    };
  } catch {
    return null;
  }
}

export function normalizeRoles(...lists: (string[] | undefined)[]): string[] {
  const unique = new Set<string>();
  for (const list of lists) {
    for (const role of list ?? []) {
      if (role) unique.add(role);
    }
  }
  return Array.from(unique);
}

export function normalizePermissions(...lists: (string[] | undefined)[]): string[] {
  const unique = new Set<string>();
  for (const list of lists) {
    for (const permission of list ?? []) {
      if (permission) unique.add(permission);
    }
  }
  return Array.from(unique);
}

export function isSuperAdmin(roles: string[]): boolean {
  return roles.includes("super_admin");
}

export function hasPermission(permissions: string[], slug: string): boolean {
  return permissions.includes(slug);
}

export function hasAnyPermission(permissions: string[], slugs: string[]): boolean {
  return slugs.some((slug) => permissions.includes(slug));
}

export function hasModulePermission(
  permissions: string[],
  module: string,
): boolean {
  const prefix = `${module}:`;
  return permissions.some((permission) => permission.startsWith(prefix));
}

export function canAccessModules(
  roles: string[],
  permissions: string[],
  modules: string[] = [],
): boolean {
  if (modules.length === 0) return true;
  if (isSuperAdmin(roles)) return true;
  return modules.some((module) => hasModulePermission(permissions, module));
}