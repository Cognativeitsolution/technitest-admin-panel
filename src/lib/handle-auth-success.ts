import { authStorage } from "@/lib/auth-storage";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";
import type { AuthTokens, User } from "@/types/auth.types";

type HandleAuthSuccessInput = {
  tokens: AuthTokens;
  user?: User | null;
};

export async function handleAuthSuccess({
  tokens,
  user,
}: HandleAuthSuccessInput): Promise<User> {
  authStorage.setTokens(tokens.accessToken, tokens.refreshToken);

  let resolvedUser = user ?? null;
  if (!resolvedUser) {
    try {
      const meResponse = await authService.getMe();
      const rawUser = 
        (meResponse as any)?.response?.data || 
        (meResponse as any)?.data || 
        (meResponse as any)?.user || 
        meResponse;
      if (rawUser?.id || rawUser?.email) {
        resolvedUser = {
          id: String(rawUser.id || rawUser._id || ""),
          fullName: String(rawUser.fullName || rawUser.full_name || rawUser.username || "Admin"),
          email: String(rawUser.email || ""),
          avatar: rawUser.avatar ? String(rawUser.avatar) : undefined,
        };
      }
    } catch {
      // ignore
    }
  }

  const finalUser = resolvedUser || {
    id: "admin",
    fullName: "Admin User",
    email: "",
  };

  useAuthStore
    .getState()
    .login(tokens.accessToken, tokens.refreshToken, finalUser);
  return finalUser;
}
