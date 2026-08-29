export function isE164PhoneNumber(value: string) {
  return /^\+[1-9]\d{6,14}$/.test(value);
}

export function normalizeToE164(value: string | undefined | null) {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (isE164PhoneNumber(trimmed)) return trimmed;
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return undefined;
  return `+${digits}`;
}
