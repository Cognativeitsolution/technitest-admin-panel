"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api-error";
import { rewardRuleService } from "@/services/reward-rule.service";
import type { PaginationMeta } from "@/types/api.types";
import type {
  RewardRule,
  UpdateRewardRulePayload,
} from "@/types/reward-rule.types";

type UseRewardRulesOptions = {
  perPage?: number;
  enabled?: boolean;
};

export function useRewardRules({ perPage = 15, enabled = true }: UseRewardRulesOptions = {}) {
  const [page, setPage] = useState(1);
  const [nonce, setNonce] = useState(0);
  const [items, setItems] = useState<RewardRule[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ page: 1, perPage, totalItems: 0, totalPages: 1 });
  const [error, setError] = useState<string | null>(null);
  const [settledKey, setSettledKey] = useState<string | null>(null);
  const [mutating, setMutating] = useState(false);

  const queryKey = `${enabled ? "on" : "off"}|${page}|${perPage}|${nonce}`;

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    rewardRuleService
      .getAdminRules({ page, per_page: perPage })
      .then((result) => {
        if (cancelled) return;
        setItems(result.items);
        setPagination({
          page,
          perPage,
          totalItems: result.total,
          totalPages: Math.max(1, Math.ceil(result.total / perPage)),
        });
        setError(null);
        setSettledKey(queryKey);
      })
      .catch((err) => {
        if (cancelled) return;
        setItems([]);
        setError(ApiError.fromAxiosError(err).message);
        setSettledKey(queryKey);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled, page, perPage, nonce, queryKey]);

  const goToPage = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const refresh = useCallback(() => {
    setNonce((prev) => prev + 1);
  }, []);

  const updateRule = useCallback(
    async (ruleId: number, payload: UpdateRewardRulePayload) => {
      setMutating(true);
      try {
        const updated = await rewardRuleService.updateRule(ruleId, payload);
        setItems((prev) =>
          prev.map((rule) => (rule.id === ruleId ? { ...rule, ...updated, id: ruleId } : rule)),
        );
        toast.success("Reward rule updated");
        return true;
      } catch (err) {
        toast.error(ApiError.fromAxiosError(err).message);
        return false;
      } finally {
        setMutating(false);
      }
    },
    [],
  );

  const toggleActive = useCallback(
    async (rule: RewardRule) => {
      setMutating(true);
      try {
        await rewardRuleService.updateRule(rule.id, {
          description: rule.description,
          coins: rule.coins,
          condition: rule.condition,
          coin_expiry: rule.coin_expiry,
          is_active: !rule.is_active,
        });
        setItems((prev) =>
          prev.map((item) => (item.id === rule.id ? { ...item, is_active: !item.is_active } : item)),
        );
        toast.success(!rule.is_active ? "Rule activated" : "Rule deactivated");
        return true;
      } catch (err) {
        toast.error(ApiError.fromAxiosError(err).message);
        return false;
      } finally {
        setMutating(false);
      }
    },
    [],
  );

  const deleteRule = useCallback(async (ruleId: number) => {
    setMutating(true);
    try {
      await rewardRuleService.deleteRule(ruleId);
      toast.success("Reward rule deleted");
      refresh();
      return true;
    } catch (err) {
      toast.error(ApiError.fromAxiosError(err).message);
      return false;
    } finally {
      setMutating(false);
    }
  }, [refresh]);

  const restoreRule = useCallback(async (ruleId: number) => {
    setMutating(true);
    try {
      await rewardRuleService.restoreRule(ruleId);
      toast.success("Reward rule restored");
      refresh();
      return true;
    } catch (err) {
      toast.error(ApiError.fromAxiosError(err).message);
      return false;
    } finally {
      setMutating(false);
    }
  }, [refresh]);

  return {
    items,
    pagination,
    loading: enabled ? settledKey !== queryKey : false,
    error,
    mutating,
    goToPage,
    refresh,
    updateRule,
    toggleActive,
    deleteRule,
    restoreRule,
  };
}
