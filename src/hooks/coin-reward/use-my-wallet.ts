"use client";

import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/lib/api-error";
import { coinRewardService } from "@/services/coin-reward.service";
import type { MyWallet } from "@/types/coin-reward.types";

export function useMyWallet() {
  const [nonce, setNonce] = useState(0);
  const [wallet, setWallet] = useState<MyWallet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    coinRewardService
      .getMyWallet()
      .then((result) => {
        if (cancelled) return;
        setWallet(result);
        setError(null);
        setSettled(true);
      })
      .catch((err) => {
        if (cancelled) return;
        setWallet(null);
        setError(ApiError.fromAxiosError(err).message);
        setSettled(true);
      });
    return () => {
      cancelled = true;
    };
  }, [nonce]);

  const refresh = useCallback(() => {
    setNonce((prev) => prev + 1);
  }, []);

  return { wallet, loading: !settled, error, refresh };
}
