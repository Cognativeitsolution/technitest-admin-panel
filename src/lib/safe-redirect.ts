export function getSafeRedirectPath(
  value: string | null | undefined,
  fallback = "/",
): string {
  if (!value) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//") || value.startsWith("/\\")) return fallback;

  if (typeof window !== "undefined") {
    try {
      const url = new URL(value, window.location.origin);
      if (url.origin !== window.location.origin) return fallback;
    } catch {
      return fallback;
    }
  }

  return value;
}
