"use client";

import { useEffect, useState } from "react";

import { enumService, type EnumOption } from "@/services/enum.service";
import {
  TRANSACTION_STATUS_LABELS,
  TRANSACTION_STATUS_OPTIONS,
  type TransactionStatus,
} from "@/types/payment.types";

export type TransactionFilterOption = {
  value: string;
  label: string;
};

const FALLBACK_STATUSES: TransactionFilterOption[] =
  TRANSACTION_STATUS_OPTIONS.map((value) => ({
    value,
    label: TRANSACTION_STATUS_LABELS[value],
  }));

function uniqueOptions(options: TransactionFilterOption[]) {
  const seen = new Map<string, TransactionFilterOption>();
  for (const option of options) {
    const value = option.value.trim();
    if (!value) continue;
    const key = value.toLowerCase();
    if (!seen.has(key)) {
      seen.set(key, {
        value,
        label: option.label.trim() || value,
      });
    }
  }
  return Array.from(seen.values());
}

function statusLabel(value: string) {
  return (
    TRANSACTION_STATUS_LABELS[value as TransactionStatus] ??
    value.charAt(0).toUpperCase() + value.slice(1)
  );
}

function enumOptions(
  enums: Record<string, EnumOption[]>,
  ...names: string[]
): TransactionFilterOption[] {
  for (const name of names) {
    const options = enums[name];
    if (!options?.length) continue;
    return uniqueOptions(
      options.map((option) => {
        const value = (option.value || option.label || "").trim();
        return {
          value,
          label: option.label?.trim() || statusLabel(value),
        };
      }),
    );
  }
  return [];
}

export function useTransactionFilterOptions() {
  const [statuses, setStatuses] =
    useState<TransactionFilterOption[]>(FALLBACK_STATUSES);

  useEffect(() => {
    let cancelled = false;

    enumService
      .getAll()
      .then((enums) => {
        if (cancelled) return;
        const fromEnum = enumOptions(
          enums,
          "transaction_status",
          "payment_status",
          "payment_transaction_status",
        );
        if (fromEnum.length) setStatuses(fromEnum);
      })
      .catch(() => {
        if (!cancelled) setStatuses(FALLBACK_STATUSES);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { statuses };
}
