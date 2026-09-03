import {
  FAQ_CATEGORIES,
  type FaqCategory,
  type FaqRecord,
} from "@/types/faq.types";

export const FAQ_STATUS_OPTIONS = ["All", "Active", "Inactive"] as const;

export const FAQ_CATEGORY_LABELS: Record<FaqCategory, string> = {
  basic: "Basic",
  quiz: "Quiz",
  certificate: "Certificate",
  transaction: "Transaction",
  others: "Others",
};

export const FAQ_CATEGORY_STYLES: Record<
  FaqCategory,
  { badge: string; tint: string; dot: string }
> = {
  basic: {
    badge: "bg-[#eff6ff] text-[#2563eb]",
    tint: "bg-[#eff6ff]",
    dot: "bg-[#2563eb]",
  },
  quiz: {
    badge: "bg-[#fff7ed] text-[#c2410c]",
    tint: "bg-[#fff7ed]",
    dot: "bg-[#f0a500]",
  },
  certificate: {
    badge: "bg-[#ecfdf5] text-[#047857]",
    tint: "bg-[#ecfdf5]",
    dot: "bg-[#10b981]",
  },
  transaction: {
    badge: "bg-[#f5f3ff] text-[#6d28d9]",
    tint: "bg-[#f5f3ff]",
    dot: "bg-[#7c3aed]",
  },
  others: {
    badge: "bg-[#f3f4f6] text-[#4b5563]",
    tint: "bg-[#f3f4f6]",
    dot: "bg-[#6b7280]",
  },
};

export function isFaqCategory(value: string): value is FaqCategory {
  return (FAQ_CATEGORIES as readonly string[]).includes(value);
}

export function formatFaqCategory(value: string) {
  if (isFaqCategory(value)) return FAQ_CATEGORY_LABELS[value];
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getFaqCategoryStyle(value: string) {
  if (isFaqCategory(value)) return FAQ_CATEGORY_STYLES[value];
  return FAQ_CATEGORY_STYLES.others;
}

export function isFaqInactive(faq: FaqRecord) {
  return faq.is_active === false;
}

export function nextDisplayOrder(items: FaqRecord[]) {
  const max = items.reduce(
    (highest, faq) => Math.max(highest, faq.display_order ?? 0),
    0,
  );
  return max + 1;
}

export function sortFaqs(items: FaqRecord[]) {
  return [...items].sort((a, b) => {
    const orderA = a.display_order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.display_order ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    return a.id - b.id;
  });
}
