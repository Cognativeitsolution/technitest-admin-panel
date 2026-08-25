import type { MediaItem } from "@/types/media.types";

export function isMediaItem(value: unknown): value is MediaItem {
  return !!value && typeof value === "object" && "id" in value && "url" in value;
}

export function mediaNameFromFile(file: File) {
  return file.name.replace(/\.[^.]+$/, "").slice(0, 100);
}
