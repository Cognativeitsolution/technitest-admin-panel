function readPublicUrl(value: string | undefined, fallback: string): string {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return (trimmed || fallback).replace(/\/$/, "");
}

/**
 * Prefer values from `.env` / `.env.local`:
 * - NEXT_PUBLIC_API_BASE_URL
 * - NEXT_PUBLIC_AI_API_BASE_URL
 */
export const env = {
  API_BASE_URL: readPublicUrl(
    process.env.NEXT_PUBLIC_API_BASE_URL,
    "https://tech-ni-test-staging.efinder24.com",
  ),
  AI_API_BASE_URL: readPublicUrl(
    process.env.NEXT_PUBLIC_AI_API_BASE_URL,
    "https://tech-ni-test-ai.naveedkhangroup.com",
  ),
} as const;
