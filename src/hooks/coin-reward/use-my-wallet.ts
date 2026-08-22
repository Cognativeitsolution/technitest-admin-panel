"use client";

import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/lib/api-error";
import { coinRewardService } from "@/services/coin-reward.service";
import type { MyWallet } from "@/types/coin-reward.types";

export function useMyWallet() {
  const [wallet, setWallet] = useState<MyWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await coinRewardService.getMyWallet();
      setWallet(result);
    } catch (err) {
      setError(ApiError.fromAxiosError(err).message);
      setWallet(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  return { wallet, loading, error, refresh: fetchWallet };
}
