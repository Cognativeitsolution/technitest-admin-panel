import type { AuthTokens, User } from "@/types/auth.types";

function readDeep(root: unknown, paths: string[]): unknown {
  let value: unknown = root;
  for (const key of paths) {
    if (value !== null && value !== undefined) {
      const record = value as Record<string, unknown>;
      if (typeof record === "object") {
        value = record[key];
        continue;
      }
    }
    return undefined;
  }
  return value;
}

function firstDefined(root: unknown, paths: string[][]): unknown {
  for (const path of paths) {
    const value = readDeep(root, path);
    if (value !== undefined) return value;
  }
  return undefined;
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function toParsedUser(rawUser: Record<string, unknown>): User | null {
  if (!rawUser.id && !rawUser.email) return null;
  return {
    id: String(rawUser.id ?? rawUser._id ?? ""),
    fullName: String(
      rawUser.fullName ?? rawUser.full_name ?? rawUser.username ?? "Admin",
    ),
    email: String(rawUser.email ?? ""),
    avatar: rawUser.avatar ? String(rawUser.avatar) : undefined,
  };
}

export function parseLoginResponse(raw: unknown): {
  tokens: AuthTokens;
  user: User | null;
  roles: string[];
  permissions: string[];
} {
  const tokensObj =
    firstDefined(raw, [
      ["tokens"],
      ["data", "tokens"],
      ["data", "data", "tokens"],
      ["response", "data", "tokens"],
      ["response", "tokens"],
      ["response", "data"],
    ]) ?? raw;
  const tokenBag = (tokensObj ?? {}) as Record<string, unknown>;

  const accessToken =
    tokenBag.accessToken ?? tokenBag.access_token ?? tokenBag.token;
  const refreshToken = tokenBag.refreshToken ?? tokenBag.refresh_token;

  if (!accessToken) {
    throw new Error("Invalid login response: missing token");
  }

  const rawUser =
    firstDefined(raw, [
      ["user"],
      ["data", "user"],
      ["data", "data", "user"],
      ["response", "data", "user"],
      ["response", "user"],
      ["response", "data"],
    ]) ?? {};
  const userRecord = rawUser as Record<string, unknown>;

  return {
    tokens: {
      accessToken: String(accessToken),
      refreshToken: refreshToken ? String(refreshToken) : "",
      expiresIn: Number(tokenBag.expiresIn ?? tokenBag.expires_in ?? 0),
    },
    user: toParsedUser(userRecord),
    roles: toStringArray(userRecord.roles),
    permissions: toStringArray(userRecord.permissions),
  };
}