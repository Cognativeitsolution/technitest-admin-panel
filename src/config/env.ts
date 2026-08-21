const DEFAULT_API_BASE_URL = "https://tech-ni-test.efinder24.com";

function readApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return fromEnv || DEFAULT_API_BASE_URL;
}

export const env = {
  API_BASE_URL: readApiBaseUrl(),
} as const;
