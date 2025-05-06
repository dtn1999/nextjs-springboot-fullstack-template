import {
  parseAsInteger,
  parseAsIsoDate,
  parseAsString,
  type UrlKeys,
  useQueryStates,
} from "nuqs";
import { useCallback } from "react";
import { format, isBefore } from "date-fns";

export const listingSearchOptionsParsers = {
  location: parseAsString,
  checkin: parseAsIsoDate,
  checkout: parseAsIsoDate,
  guests: parseAsInteger,
  limit: parseAsInteger,
  offset: parseAsInteger,
};

export type ListingSearchOptionsUrlKeys = UrlKeys<
  typeof listingSearchOptionsParsers
>;

export const DATE_FORMAT = "yyyy-MM-dd";

export function useListingSearchParams() {
  const [params, setParams] = useQueryStates({
    location: parseAsString,
    checkin: parseAsIsoDate,
    checkout: parseAsIsoDate,
    guests: parseAsInteger.withDefault(1),
    limit: parseAsInteger,
    offset: parseAsInteger,
  });

  const toUrlParams = useCallback(() => {
    const urlParams = {} as Record<keyof ListingSearchOptionsUrlKeys, string>;
    if (params.location) {
      urlParams.location = params.location;
    }
    if (params.checkin) {
      urlParams.checkin = format(params.checkin, DATE_FORMAT);
    }
    if (params.checkout) {
      urlParams.checkout = format(params.checkout, DATE_FORMAT);
    }
    if (params.guests) {
      urlParams.guests = params.guests.toString();
    }
    if (params.limit) {
      urlParams.limit = params.limit.toString();
    }
    if (params.offset) {
      urlParams.offset = params.offset.toString();
    }

    return new URLSearchParams(urlParams);
  }, [params]);

  const isListingSearchParamsValidForBooking = useCallback(() => {
    const { checkin, checkout, guests } = params;

    if (!checkin || !checkout || !guests) {
      return false;
    }

    return isBefore(checkin, checkout) && guests > 0;
  }, [params]);

  return {
    params,
    setParams,
    toUrlParams,
    isListingSearchParamsValidForBooking,
  };
}
