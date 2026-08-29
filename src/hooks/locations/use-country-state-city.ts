"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { locationService } from "@/services/location.service";
import type { City, Country, State } from "@/types/location.types";

export type SelectOption = {
  label: string;
  value: string;
};

type UseCountryStateCityProps = {
  initialCountryId?: number | null;
  initialStateId?: number | null;
  initialCityId?: number | null;
  onStateResolved?: (stateId: number) => void;
};

export function useCountryStateCity({
  initialCountryId = null,
  initialStateId = null,
  initialCityId = null,
  onStateResolved,
}: UseCountryStateCityProps = {}) {
  const [countryId, setCountryIdState] = useState<number | null>(
    initialCountryId,
  );
  const [stateId, setStateIdState] = useState<number | null>(initialStateId);
  const [cityId, setCityIdState] = useState<number | null>(initialCityId);

  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [isCountriesLoading, setIsCountriesLoading] = useState(true);
  const [isStatesLoading, setIsStatesLoading] = useState(false);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);

  const countriesFetchedRef = useRef(false);
  const statesRequestIdRef = useRef(0);
  const citiesRequestIdRef = useRef(0);
  const onStateResolvedRef = useRef(onStateResolved);

  useEffect(() => {
    onStateResolvedRef.current = onStateResolved;
  }, [onStateResolved]);

  useEffect(() => {
    if (initialCountryId != null) {
      setCountryIdState(initialCountryId);
    }
  }, [initialCountryId]);

  useEffect(() => {
    if (initialStateId != null) {
      setStateIdState(initialStateId);
    }
  }, [initialStateId]);

  useEffect(() => {
    if (initialCityId != null) {
      setCityIdState(initialCityId);
    }
  }, [initialCityId]);

  const fetchCountries = useCallback(async () => {
    if (countriesFetchedRef.current) return;
    countriesFetchedRef.current = true;
    setIsCountriesLoading(true);
    try {
      const data = await locationService.getCountries();
      setCountries(
        [...data].sort((a, b) => a.name.localeCompare(b.name)),
      );
    } catch {
      toast.error("Failed to load countries");
    } finally {
      setIsCountriesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  const fetchStates = useCallback(async (cid: number) => {
    const reqId = ++statesRequestIdRef.current;
    setIsStatesLoading(true);
    try {
      const data = await locationService.getStatesByCountry(cid);
      if (reqId !== statesRequestIdRef.current) return;
      setStates([...data].sort((a, b) => a.name.localeCompare(b.name)));
    } catch {
      if (reqId === statesRequestIdRef.current) {
        toast.error("Failed to load states");
        setStates([]);
      }
    } finally {
      if (reqId === statesRequestIdRef.current) {
        setIsStatesLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (countryId == null) {
      setStates([]);
      return;
    }
    fetchStates(countryId);
  }, [countryId, fetchStates]);

  const resolveStateFromCity = useCallback(
    (cityList: City[], targetCityId: number | null) => {
      if (!targetCityId || stateId != null) return;
      const matched = cityList.find((city) => city.id === targetCityId);
      if (!matched?.state_id) return;
      setStateIdState(matched.state_id);
      onStateResolvedRef.current?.(matched.state_id);
    },
    [stateId],
  );

  useEffect(() => {
    if (countryId == null) {
      setCities([]);
      setIsCitiesLoading(false);
      return;
    }

    if (stateId == null) {
      const targetCityId = cityId ?? initialCityId;
      if (!targetCityId) {
        setCities([]);
        setIsCitiesLoading(false);
        return;
      }

      let cancelled = false;
      const reqId = ++citiesRequestIdRef.current;
      setIsCitiesLoading(true);

      locationService
        .getCitiesByCountry(countryId)
        .then((data) => {
          if (cancelled || reqId !== citiesRequestIdRef.current) return;
          const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
          setCities(sorted);
          resolveStateFromCity(sorted, targetCityId);
        })
        .catch(async () => {
          if (cancelled || reqId !== citiesRequestIdRef.current) return;
          setCities([]);
        })
        .finally(() => {
          if (cancelled || reqId !== citiesRequestIdRef.current) return;
          setIsCitiesLoading(false);
        });

      return () => {
        cancelled = true;
      };
    }

    let cancelled = false;
    const reqId = ++citiesRequestIdRef.current;
    setIsCitiesLoading(true);
    setCities([]);

    locationService
      .getCitiesByState(stateId)
      .then((data) => {
        if (cancelled || reqId !== citiesRequestIdRef.current) return;
        setCities([...data].sort((a, b) => a.name.localeCompare(b.name)));
      })
      .catch(() => {
        if (cancelled || reqId !== citiesRequestIdRef.current) return;
        toast.error("Failed to load cities");
        setCities([]);
      })
      .finally(() => {
        if (cancelled || reqId !== citiesRequestIdRef.current) return;
        setIsCitiesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [stateId, countryId, cityId, initialCityId, resolveStateFromCity]);

  const setCountryId = useCallback((id: number | null) => {
    setCountryIdState(id);
    setStateIdState(null);
    setCityIdState(null);
  }, []);

  const setStateId = useCallback((id: number | null) => {
    setStateIdState(id);
    setCityIdState(null);
  }, []);

  const setCityId = useCallback((id: number | null) => {
    setCityIdState(id);
  }, []);

  const countryOptions: SelectOption[] = countries.map((c) => ({
    label: c.name,
    value: String(c.id),
  }));

  const stateOptions: SelectOption[] = states.map((s) => ({
    label: s.name,
    value: String(s.id),
  }));

  const cityOptions: SelectOption[] = cities.map((c) => ({
    label: c.name,
    value: String(c.id),
  }));

  return {
    countryId,
    stateId,
    cityId,
    setCountryId,
    setStateId,
    setCityId,
    countryOptions,
    stateOptions,
    cityOptions,
    isCountriesLoading,
    isStatesLoading,
    isCitiesLoading,
  };
}
