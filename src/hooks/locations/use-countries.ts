"use client";

import { useEffect, useState } from "react";
import { locationService } from "@/services/location.service";
import { ApiError } from "@/lib/api-error";
import { toast } from "sonner";

export function useCountries() {
  const [countries, setCountries] = useState<string[]>(["All Countries"]);
  const [countryData, setCountryData] = useState<import("@/services/location.service").Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    locationService
      .getCountries()
      .then((data) => {
        if (cancelled) return;
        setCountryData(data);
        const countryNames = data.map((c) => c.name);
        setCountries(["All Countries", ...countryNames]);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        const errorMessage = ApiError.fromAxiosError(err).message;
        setError(errorMessage);
        toast.error(`Failed to load countries: ${errorMessage}`);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { countries, countryData, loading, error };
}
