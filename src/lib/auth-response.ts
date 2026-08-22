import type { AuthTokens, User } from "@/types/auth.types";

export function parseLoginResponse(raw: any): {
  tokens: AuthTokens;
  user: User | null;
} {
  const data = raw?.data?.data || raw?.data || raw?.response || raw || {};
  const tokens = data.tokens || data;
  const accessToken = tokens.accessToken || tokens.access_token;
  const refreshToken = tokens.refreshToken || tokens.refresh_token;

  if (!accessToken) {
    throw new Error("Invalid login response: missing token");
  }

  const rawUser = data.user || {};
  const user: User | null = rawUser.id || rawUser.email
    ? {
        id: String(rawUser.id || ""),
        fullName: String(rawUser.fullName || rawUser.full_name || rawUser.username || "Admin"),
        email: String(rawUser.email || ""),
        avatar: rawUser.avatar ? String(rawUser.avatar) : undefined,
      }
    : null;

  return {
    tokens: {
      accessToken,
      refreshToken: refreshToken || "",
      expiresIn: Number(tokens.expiresIn || tokens.expires_in || 0),
    },
    user,
  };
}
