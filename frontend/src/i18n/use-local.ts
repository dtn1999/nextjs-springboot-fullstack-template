import { useParams } from "next/navigation";

export function useLocale() {
  const { locale } = useParams<{ locale: string }>();

  return {
    activeLocale: locale,
  };
}
