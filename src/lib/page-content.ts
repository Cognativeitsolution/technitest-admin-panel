import type { PageContentBlock, PageDetail } from "@/types/page.types";

export type StatItem = { label: string; value: string };
export type StepItem = { title: string; text: string };
export type FeatureItem = { title: string; text: string };
export type CardItem = { title: string; text: string; value: string };

export type DataStringField = {
  key: string;
  label: string;
  multiline?: boolean;
};

export type DataArrayField = {
  key: string;
  label: string;
  itemFields: { key: string; label: string }[];
};

export type BlockDataSchema = {
  strings?: DataStringField[];
  arrays?: DataArrayField[];
};

export const BLOCK_TYPE_OPTIONS = [
  "hero",
  "intro",
  "categories_intro",
  "achievement_stats",
  "steps",
  "cta_banner",
  "trending_quizzes",
  "hall_of_achievers",
  "testimonials",
  "vision_intro",
  "mission_vision",
  "features",
  "trust_banner",
  "contact_cards",
  "contact_form",
  "category_grid",
  "new_quizzes",
  "newsletter",
  "social_links",
  "contact_info",
  "copyright",
] as const;

export const BLOCK_DATA_SCHEMA: Record<string, BlockDataSchema> = {
  hero: {
    strings: [
      { key: "cta_label", label: "CTA Label" },
      { key: "cta_link", label: "CTA Link" },
    ],
  },
  achievement_stats: {
    arrays: [{ key: "stats", label: "Stats", itemFields: [{ key: "label", label: "Label" }, { key: "value", label: "Value" }] }],
  },
  vision_intro: {
    arrays: [{ key: "stats", label: "Stats", itemFields: [{ key: "label", label: "Label" }, { key: "value", label: "Value" }] }],
  },
  steps: {
    arrays: [{ key: "steps", label: "Steps", itemFields: [{ key: "title", label: "Title" }, { key: "text", label: "Text" }] }],
  },
  features: {
    arrays: [{ key: "features", label: "Features", itemFields: [{ key: "title", label: "Title" }, { key: "text", label: "Text" }] }],
  },
  cta_banner: {
    strings: [
      { key: "cta_label", label: "CTA Label" },
      { key: "cta_link", label: "CTA Link" },
    ],
  },
  trust_banner: {
    strings: [
      { key: "cta_label", label: "CTA Label" },
      { key: "cta_link", label: "CTA Link" },
    ],
  },
  mission_vision: {
    strings: [
      { key: "mission", label: "Mission", multiline: true },
      { key: "vision", label: "Vision", multiline: true },
    ],
  },
  contact_cards: {
    arrays: [
      {
        key: "cards",
        label: "Cards",
        itemFields: [
          { key: "title", label: "Title" },
          { key: "text", label: "Text" },
          { key: "value", label: "Value" },
        ],
      },
    ],
  },
  newsletter: {
    strings: [{ key: "consent_text", label: "Consent Text", multiline: true }],
  },
  social_links: {
    strings: [
      { key: "facebook", label: "Facebook" },
      { key: "twitter", label: "Twitter" },
      { key: "linkedin", label: "LinkedIn" },
      { key: "instagram", label: "Instagram" },
    ],
  },
  contact_info: {
    strings: [
      { key: "address", label: "Address", multiline: true },
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email" },
    ],
  },
};

export function formatBlockType(type: string) {
  return type
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatPageLabel(value: string | null | undefined) {
  if (!value) return "--";
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function pageStatusLabel(page: { status: string; publish_status: string }) {
  if (page.status === "archived") return "Archived";
  return formatPageLabel(page.publish_status);
}

export function slugifyPageTitle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

export function asNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return { ...(value as Record<string, unknown>) };
  }
  return {};
}

export function asObjectList(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => asRecord(item));
}

export function createEmptyBlock(type = "hero"): PageContentBlock {
  return { type, header: "", text: "", data: {} };
}

export function emptyPageContent(): PageContentBlock[] {
  return [createEmptyBlock("hero")];
}

export type HomepageFormValues = {
  title: string;
  slug: string;
  heroHeader: string;
  heroText: string;
  heroCtaLabel: string;
  heroCtaLink: string;
  categoriesHeader: string;
  achievementHeader: string;
  achievementText: string;
  stats: StatItem[];
  stepsHeader: string;
  steps: StepItem[];
  ctaHeader: string;
  ctaText: string;
  ctaLabel: string;
  ctaLink: string;
  trendingHeader: string;
  achieversHeader: string;
  testimonialsHeader: string;
  metaTitle: string;
  metaKeyword: string;
  metaDescription: string;
  showInNav: boolean;
  navLabel: string;
  navOrder: number;
};

function asStats(value: unknown): StatItem[] {
  return asObjectList(value).map((item) => ({
    label: asString(item.label),
    value: asString(item.value),
  }));
}

function asSteps(value: unknown): StepItem[] {
  return asObjectList(value).map((item) => ({
    title: asString(item.title),
    text: asString(item.text),
  }));
}

function findBlock(content: PageContentBlock[], type: string) {
  return content.find((block) => block.type === type);
}

export function homepageFormFromPage(page: PageDetail): HomepageFormValues {
  const content = page.content ?? [];
  const hero = findBlock(content, "hero");
  const categories = findBlock(content, "categories_intro");
  const achievement = findBlock(content, "achievement_stats");
  const steps = findBlock(content, "steps");
  const cta = findBlock(content, "cta_banner");
  const trending = findBlock(content, "trending_quizzes");
  const achievers = findBlock(content, "hall_of_achievers");
  const testimonials = findBlock(content, "testimonials");

  return {
    title: page.title,
    slug: page.slug,
    heroHeader: hero?.header ?? "",
    heroText: hero?.text ?? "",
    heroCtaLabel: asString(hero?.data?.cta_label),
    heroCtaLink: asString(hero?.data?.cta_link),
    categoriesHeader: categories?.header ?? "",
    achievementHeader: achievement?.header ?? "",
    achievementText: achievement?.text ?? "",
    stats: asStats(achievement?.data?.stats),
    stepsHeader: steps?.header ?? "",
    steps: asSteps(steps?.data?.steps),
    ctaHeader: cta?.header ?? "",
    ctaText: cta?.text ?? "",
    ctaLabel: asString(cta?.data?.cta_label),
    ctaLink: asString(cta?.data?.cta_link),
    trendingHeader: trending?.header ?? "",
    achieversHeader: achievers?.header ?? "",
    testimonialsHeader: testimonials?.header ?? "",
    metaTitle: page.meta_title ?? "",
    metaKeyword: page.meta_keyword ?? "",
    metaDescription: page.meta_description ?? "",
    showInNav: page.show_in_nav ?? false,
    navLabel: page.nav_label ?? "",
    navOrder: page.nav_order ?? 0,
  };
}

export function contentFromHomepageForm(
  original: PageContentBlock[],
  form: HomepageFormValues,
): PageContentBlock[] {
  return original.map((block) => {
    if (block.type === "hero") {
      return {
        ...block,
        header: form.heroHeader,
        text: form.heroText,
        data: { ...asRecord(block.data), cta_label: form.heroCtaLabel, cta_link: form.heroCtaLink },
      };
    }
    if (block.type === "categories_intro") {
      return { ...block, header: form.categoriesHeader };
    }
    if (block.type === "achievement_stats") {
      return {
        ...block,
        header: form.achievementHeader,
        text: form.achievementText,
        data: { ...asRecord(block.data), stats: form.stats },
      };
    }
    if (block.type === "steps") {
      return {
        ...block,
        header: form.stepsHeader,
        data: { ...asRecord(block.data), steps: form.steps },
      };
    }
    if (block.type === "cta_banner") {
      return {
        ...block,
        header: form.ctaHeader,
        text: form.ctaText,
        data: { ...asRecord(block.data), cta_label: form.ctaLabel, cta_link: form.ctaLink },
      };
    }
    if (block.type === "trending_quizzes") {
      return { ...block, header: form.trendingHeader };
    }
    if (block.type === "hall_of_achievers") {
      return { ...block, header: form.achieversHeader };
    }
    if (block.type === "testimonials") {
      return { ...block, header: form.testimonialsHeader };
    }
    return block;
  });
}

export function isPageDetail(value: unknown): value is PageDetail {
  return !!value && typeof value === "object" && "id" in value && "slug" in value;
}
