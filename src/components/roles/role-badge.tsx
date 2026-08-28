"use client";

import { cn } from "@/lib/utils";

const ROLE_COLORS: { bg: string; text: string }[] = [
  { bg: "bg-[#eef5ff]", text: "text-[#2563eb]" },
  { bg: "bg-[#fef3c7]", text: "text-[#d97706]" },
  { bg: "bg-[#dcfce7]", text: "text-[#16a34a]" },
  { bg: "bg-[#fee2e2]", text: "text-[#dc2626]" },
  { bg: "bg-[#ede9fe]", text: "text-[#7c3aed]" },
  { bg: "bg-[#ccfbf1]", text: "text-[#0d9488]" },
  { bg: "bg-[#ffe4e6]", text: "text-[#e11d48]" },
  { bg: "bg-[#e0f2fe]", text: "text-[#0284c7]" },
];

export function getRoleColor(name: string): { bg: string; text: string } {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % 997;
  }
  return ROLE_COLORS[hash % ROLE_COLORS.length];
}

export function initials(name: string): string {
  if (!name) return "R";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

type RoleBadgeProps = {
  name: string;
  size?: "md" | "lg";
  className?: string;
};

export function RoleBadge({ name, size = "md", className }: RoleBadgeProps) {
  const color = getRoleColor(name);
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl font-bold",
        size === "md" ? "size-9 text-xs" : "size-11 text-sm",
        color.bg,
        color.text,
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}