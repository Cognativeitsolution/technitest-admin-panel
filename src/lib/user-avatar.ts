export function resolveUserAvatar(
  raw: Record<string, unknown> | null | undefined,
): string | undefined {
  if (!raw) return undefined;

  for (const key of ["avatar", "image_url", "imageUrl", "profile_image"]) {
    const value = raw[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return undefined;
}
