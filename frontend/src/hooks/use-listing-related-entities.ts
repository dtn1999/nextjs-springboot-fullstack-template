import { api } from "@/trpc/react";
import { ListingLocation } from "@/server/types/domain";

export function useLocationById(locationId: number, enabled: boolean = true) {
  const result = api.listing.location.getById.useQuery(
    {
      locationId,
    },
    {
      enabled,
    }
  );

  return {
    ...result,
    location: result?.data?.data as ListingLocation,
    error: result?.data?.error ?? result.error,
  };
}
