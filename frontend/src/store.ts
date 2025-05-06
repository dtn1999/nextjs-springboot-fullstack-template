import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { Currency, Locale } from "@/i18n/types";
import { routing } from "@/i18n/routing";

interface GlobalState {
  loading: boolean;
  activeLocale: Locale;
  activeCurrency: Currency;

  setLoading: (loading: boolean) => void;
  setActiveLocale: (locale: Locale) => void;
  setActiveCurrency: (currency: Currency) => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      loading: false,
      activeLocale: routing.defaultLocale,
      activeCurrency: "USD",

      //
      setLoading: (loading) =>
        set(() => ({
          loading,
        })),
      setActiveLocale: (locale) =>
        set(() => ({
          activeLocale: locale,
        })),
      setActiveCurrency: (currency) =>
        set(() => ({
          activeCurrency: currency,
        })),
    }),
    {
      name: "global-settings",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
