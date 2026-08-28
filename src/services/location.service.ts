import apiClient from "@/lib/api-client";
import type { ApiEnvelope, PaginatedData } from "@/types/api.types";
import type { City, Country, State } from "@/types/location.types";

type LocationListPayload<T> = T[] | PaginatedData<T> | { items?: T[] };

function unwrapLocationItems<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload;

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.items)) return record.items as T[];

    const nested = record.data;
    if (nested && typeof nested === "object") {
      const nestedRecord = nested as Record<string, unknown>;
      if (Array.isArray(nestedRecord.items)) return nestedRecord.items as T[];
    }
  }

  return [];
}

export const locationService = {
  getCountries: async () => {
    const { data } = await apiClient.get<
      ApiEnvelope<LocationListPayload<Country>>
    >("/api/v1/locations/countries");
    return unwrapLocationItems(data.response.data);
  },

  getStatesByCountry: async (countryId: number) => {
    const { data } = await apiClient.get<
      ApiEnvelope<LocationListPayload<State>>
    >(`/api/v1/locations/countries/${countryId}/states`);
    return unwrapLocationItems(data.response.data);
  },

  getCitiesByState: async (stateId: number) => {
    const { data } = await apiClient.get<
      ApiEnvelope<LocationListPayload<City>>
    >(`/api/v1/locations/states/${stateId}/cities`);
    return unwrapLocationItems(data.response.data);
  },

  getCitiesByCountry: async (countryId: number) => {
    const { data } = await apiClient.get<
      ApiEnvelope<LocationListPayload<City>>
    >(`/api/v1/locations/countries/${countryId}/cities`);
    return unwrapLocationItems(data.response.data);
  },
};
