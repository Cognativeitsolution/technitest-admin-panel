"use client";

import { useEffect, useState } from "react";

import { categoryService } from "@/services/category.service";
import { certificateService } from "@/services/certificate.service";
import { enumService, type EnumOption } from "@/services/enum.service";
import type { PaginatedData } from "@/types/api.types";
import type { CategoryItem } from "@/types/category.types";
import type { UserCertificateItem } from "@/types/certificate.types";

const PAGE_SIZE = 100;

async function fetchAllPages<T>(
  load: (page: number, perPage: number) => Promise<PaginatedData<T>>,
  maxPages = 10,
) {
  const first = await load(1, PAGE_SIZE);
  const items = [...(first.items ?? [])];
  const totalPages = Math.min(Math.max(1, first.total_pages ?? 1), maxPages);

  for (let page = 2; page <= totalPages; page += 1) {
    const next = await load(page, PAGE_SIZE);
    items.push(...(next.items ?? []));
  }

  return items;
}

function uniqueSorted(values: Array<string | null | undefined>) {
  const seen = new Map<string, string>();
  for (const raw of values) {
    const value = raw?.trim();
    if (!value) continue;
    const key = value.toLowerCase();
    if (!seen.has(key)) seen.set(key, value);
  }
  return Array.from(seen.values()).sort((a, b) => a.localeCompare(b));
}

function enumValues(
  enums: Record<string, EnumOption[]>,
  ...names: string[]
) {
  for (const name of names) {
    const options = enums[name];
    if (options?.length) {
      return uniqueSorted(options.map((option) => option.value || option.label));
    }
  }
  return [];
}

async function loadCategories() {
  try {
    return await fetchAllPages((page, perPage) =>
      categoryService.getAdminList({ page, per_page: perPage }),
    );
  } catch {
    return fetchAllPages((page, perPage) =>
      categoryService.getUserList({ page, per_page: perPage }),
    );
  }
}

export function useCertificateFilterOptions() {
  const [statuses, setStatuses] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([
      loadCategories(),
      enumService.getAll(),
      fetchAllPages(
        (page, perPage) =>
          certificateService.getAdminCertificates({ page, per_page: perPage }),
        5,
      ),
    ]).then(([categoryResult, enumResult, certificateResult]) => {
      if (cancelled) return;

      const categoryItems =
        categoryResult.status === "fulfilled" ? (categoryResult.value as CategoryItem[]) : [];
      const enums =
        enumResult.status === "fulfilled" ? enumResult.value : ({} as Record<string, EnumOption[]>);
      const certificates =
        certificateResult.status === "fulfilled"
          ? (certificateResult.value as UserCertificateItem[])
          : [];

      const statusFromEnum = enumValues(enums, "certificate_status");
      const levelFromEnum = enumValues(enums, "difficulty_level", "difficulty_levels");

      setCategories(uniqueSorted(categoryItems.map((item) => item.title)));
      setStatuses(
        statusFromEnum.length
          ? statusFromEnum
          : uniqueSorted(certificates.map((item) => item.status)),
      );
      setLevels(
        levelFromEnum.length
          ? levelFromEnum
          : uniqueSorted(certificates.map((item) => item.level)),
      );
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { statuses, levels, categories };
}
