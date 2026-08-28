import { create } from "zustand";

import { authStorage } from "@/lib/auth-storage";
import { decodeAccessToken, normalizePermissions, normalizeRoles } from "@/lib/permissions";
import { authService } from "@/services/auth.service";
import type { AuthState, User } from "@/types/auth.types";

type AuthActions = {
  setUser: (user: User | null) => void;
  setAccess: (roles: string[], permissions: string[]) => void;
  initialize: () => Promise<void>;
  login: (
    accessToken: string,
    refreshToken: string,
    user: User,
    roles?: string[],
    permissions?: string[],
  ) => void;
  logout: () => Promise<void>;
};

type AuthStore = AuthState & AuthActions;

type RawUserLike = {
  id?: unknown;
  _id?: unknown;
  fullName?: unknown;
  full_name?: unknown;
  username?: unknown;
  email?: unknown;
  avatar?: unknown;
  roles?: unknown;
  role?: unknown;
  permissions?: unknown;
};

type MeResponseLike = {
  response?: { data?: unknown };
  data?: unknown;
  user?: unknown;
};

function asRawUser(value: unknown): RawUserLike {
  if (value && typeof value === "object") return value as RawUserLike;
  return {};
}

function rolesFromClaim(rawUser: RawUserLike): string[] | undefined {
  const roles = rawUser.roles;
  if (Array.isArray(roles)) return roles.map(String);
  if (typeof roles === "string" && roles) return [roles];
  return undefined;
}

function permissionsFromClaim(rawUser: RawUserLike): string[] | undefined {
  const permissions = rawUser.permissions;
  if (Array.isArray(permissions)) return permissions.map(String);
  return undefined;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  roles: [],
  permissions: [],
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setAccess: (roles, permissions) => set({ roles, permissions }),

  initialize: async () => {
    try {
      const token = authStorage.getAccessToken();
      if (!token) {
        set({ isLoading: false });
        return;
      }
      set({ accessToken: token, refreshToken: authStorage.getRefreshToken() });
      const response = await authService.getMe();
      // Extract user from the nested response structure
      const me = response as MeResponseLike;
      const nested = me.response?.data ?? me.data ?? me.user;
      const rawUser = asRawUser(nested ?? response);

      const claims = decodeAccessToken(token);
      const roles = normalizeRoles(claims?.roles, rolesFromClaim(rawUser));
      const permissions = normalizePermissions(
        claims?.permissions,
        permissionsFromClaim(rawUser),
      );

      const user: User = {
        id: String(rawUser?.id ?? rawUser?._id ?? "admin"),
        fullName: String(rawUser?.fullName ?? rawUser?.full_name ?? rawUser?.username ?? "Admin User"),
        email: String(rawUser?.email ?? ""),
        avatar: rawUser?.avatar ? String(rawUser.avatar) : undefined,
      };

      set({ user, roles, permissions, isAuthenticated: true, isLoading: false });
    } catch {
      authStorage.clear();
      set({
        user: null,
        roles: [],
        permissions: [],
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  login: (accessToken, refreshToken, user, roles, permissions) => {
    authStorage.setTokens(accessToken, refreshToken);
    const claims = decodeAccessToken(accessToken);
    set({
      user,
      roles: normalizeRoles(claims?.roles, roles),
      permissions: normalizePermissions(claims?.permissions, permissions),
      accessToken,
      refreshToken,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    } finally {
      authStorage.clear();
      set({
        user: null,
        roles: [],
        permissions: [],
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));