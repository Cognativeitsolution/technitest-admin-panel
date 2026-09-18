// const DEFAULT_API_BASE_URL = "https://tech-ni-test-staging.efinder24.com";
const DEFAULT_API_BASE_URL = "https://technitest-user-env-staging-soft-tech-cubes-projects.vercel.app";

function readApiBaseUrl(): string {
  // Access the env var as a static member so Next.js can inline it in the browser bundle.
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
  const trimmed = typeof fromEnv === "string" ? fromEnv.trim() : "";
  return (trimmed || DEFAULT_API_BASE_URL).replace(/\/$/, "");
}

export const env = {
  API_BASE_URL: readApiBaseUrl(),
} as const;
