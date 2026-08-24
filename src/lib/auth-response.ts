import type { AuthTokens, User } from "@/types/auth.types";

export function parseLoginResponse(raw: any): {
  tokens: AuthTokens;
  user: User | null;
} {
  console.log("RAW LOGIN RESPONSE:", raw);

  // Try to find the tokens object in various possible nested locations
  let tokensObj =
    raw?.tokens ||
    raw?.data?.tokens ||
    raw?.data?.data?.tokens ||
    raw?.response?.data?.tokens ||
    raw?.response?.tokens ||
    raw?.response?.data ||
    raw || {};

  const accessToken = tokensObj?.accessToken || tokensObj?.access_token || tokensObj?.token;
  const refreshToken = tokensObj?.refreshToken || tokensObj?.refresh_token;

  if (!accessToken) {
    console.error("Failed to parse access token. tokensObj was:", tokensObj);
    throw new Error("Invalid login response: missing token");
  }

  // Same for user object
  let rawUser =
    raw?.user ||
    raw?.data?.user ||
    raw?.data?.data?.user ||
    raw?.response?.data?.user ||
    raw?.response?.user ||
    raw?.response?.data ||
    {};

  const user: User | null = rawUser.id || rawUser.email
    ? {
      id: String(rawUser.i || ""),
      fullName: String(rawUser.fullName || rawUser.full_name || rawUser.username || "Admin"),
      email: String(rawUser.email || ""),
      avatar: rawUser.avatar ? String(rawUser.avatar) : undefined,
    }
    : null;

  return {
    tokens: {
      accessToken,
      refreshToken: refreshToken || "",
      expiresIn: Number(tokensObj?.expiresIn || tokensObj?.expires_in || 0),
    },
    user,
  };
}
