const DEFAULT_API_BASE_URL = "https://tech-ni-test-staging.efinder24.com";
const DEFAULT_AI_API_BASE_URL = "https://tech-ni-test-ai.naveedkhangroup.com";

function readPublicUrl(value: string | undefined, fallback: string): string {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return (trimmed || fallback).replace(/\/$/, "");
}

export const env = {
  API_BASE_URL: readPublicUrl(
    process.env.NEXT_PUBLIC_API_BASE_URL,
    DEFAULT_API_BASE_URL,
  ),
  AI_API_BASE_URL: readPublicUrl(
    process.env.NEXT_PUBLIC_AI_API_BASE_URL,
    DEFAULT_AI_API_BASE_URL,
  ),
} as const;
