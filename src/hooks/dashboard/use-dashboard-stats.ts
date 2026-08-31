"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api-error";
import { dashboardService, type DashboardStats } from "@/services/dashboard.service";

interface UseDashboardStatsOptions {
  dateFrom?: string | null;
  dateTo?: string | null;
}

export function useDashboardStats(options?: UseDashboardStatsOptions) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(
    async (dateFrom?: string | null, dateTo?: string | null) => {
      setLoading(true);
      setError(null);
      try {
        const data = await dashboardService.getStats(dateFrom, dateTo);
        setStats(data);
        return data;
      } catch (err) {
        const errorMessage = ApiError.fromAxiosError(err).message;
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchStats(options?.dateFrom, options?.dateTo);
  }, [options?.dateFrom, options?.dateTo, fetchStats]);

  const refetch = useCallback(
    (dateFrom?: string | null, dateTo?: string | null) => {
      return fetchStats(dateFrom, dateTo);
    },
    [fetchStats],
  );

  return {
    stats,
    loading,
    error,
    refetch,
  };
}
