import { authStorage } from "@/lib/auth-storage";
import { resolveUserAvatar } from "@/lib/user-avatar";
import { authService } from "@/services/auth.service";
import { profileService } from "@/services/profile.service";
import { useAuthStore } from "@/store/auth-store";
import type { AuthTokens, User } from "@/types/auth.types";

type HandleAuthSuccessInput = {
  tokens: AuthTokens;
  user?: User | null;
  roles?: string[];
  permissions?: string[];
};

type MeResponseLike = {
  response?: { data?: Record<string, unknown> };
  data?: Record<string, unknown>;
  user?: Record<string, unknown>;
};

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function toUser(raw: Record<string, unknown>): User {
  return {
    id: String(raw.id ?? raw._id ?? ""),
    fullName: String(raw.fullName ?? raw.full_name ?? raw.username ?? "Admin"),
    email: String(raw.email ?? ""),
    avatar: resolveUserAvatar(raw),
  };
}

export async function handleAuthSuccess({
  tokens,
  user,
  roles: providedRoles,
  permissions: providedPermissions,
}: HandleAuthSuccessInput): Promise<User> {
  authStorage.setTokens(tokens.accessToken, tokens.refreshToken);

  let resolvedUser = user ?? null;
  let resolvedRoles = providedRoles;
  let resolvedPermissions = providedPermissions;

  try {
    const meResponse = (await authService.getMe()) as MeResponseLike;
    const rawUser =
      meResponse?.response?.data ??
      meResponse?.data ??
      meResponse?.user;

    if (rawUser && (rawUser.id || rawUser.email)) {
      resolvedUser = toUser(rawUser);
      if (!resolvedRoles || resolvedRoles.length === 0) {
        resolvedRoles = stringArray(rawUser.roles);
      }
      if (!resolvedPermissions || resolvedPermissions.length === 0) {
        resolvedPermissions = stringArray(rawUser.permissions);
      }
    }
  } catch {
    // me fetch failed; fall back to roles/permissions from the login response
  }

  const finalUser =
    resolvedUser || { id: "admin", fullName: "Admin User", email: "" };

  try {
    const profileInfo = await profileService.getInfo();
    if (profileInfo.image_url) {
      finalUser.avatar = profileInfo.image_url;
    }
  } catch {
    // optional profile bootstrap
  }

  useAuthStore
    .getState()
    .login(
      tokens.accessToken,
      tokens.refreshToken,
      finalUser,
      resolvedRoles,
      resolvedPermissions,
    );
  return finalUser;
}