import { PreferredLanguageForm } from "@/features/users/components/settings/form/preferred-language-form";
import { PreferredCurrencyForm } from "@/features/users/components/settings/form/preferred-currency-form";
import { GlobalSettings } from "@/server/types/domain";
import { useCallback, useState } from "react";
import { alert } from "@/lib/alert";
import { toast } from "sonner";
import { usePatchAccountMutation } from "@/features/users/hooks/use-accounts";

type GlobalSettingsKeys = keyof GlobalSettings;

interface GlobalSettingsFormProps extends GlobalSettings {
  accountId: number;
}

export function GlobalSettingsForm(settings: GlobalSettingsFormProps) {
  const { accountId } = settings;
  const [key, setKey] = useState<GlobalSettingsKeys>();

  const { mutateAsync: updateUserInfo, isPending: isSubmitting } =
    usePatchAccountMutation();

  const isDisabled = useCallback(
    (inputKey: GlobalSettingsKeys) => {
      if (key) {
        return key !== inputKey || isSubmitting;
      }
      return isSubmitting;
    },
    [key, isSubmitting]
  );

  const updatePreferredLanguage = async (language: string) => {
    const data = await updateUserInfo({
      accountId,
      preferredLanguage: {
        preferredLanguage: language,
      },
    });

    if (data.error) {
      alert(data.error);
    }

    if (data.data) {
      toast.success("Preferred language updated.");
    }
  };

  const updatePreferredCurrency = async (currency: string) => {
    const data = await updateUserInfo({
      accountId,
      preferredCurrency: {
        preferredCurrency: currency,
      },
    });

    if (data.error) {
      alert(data.error);
    }

    if (data.data) {
      toast.success("Preferred currency updated.");
    }
  };

  return (
    <>
      <PreferredLanguageForm
        defaultValues={settings.defaultLanguage}
        disabled={isDisabled("defaultLanguage")}
        loading={isSubmitting}
        onEditorOpen={() => setKey("defaultLanguage")}
        onEditorClose={() => setKey(undefined)}
        handleSubmit={updatePreferredLanguage}
      />
      <PreferredCurrencyForm
        defaultValues={settings.defaultCurrency}
        disabled={isDisabled("defaultCurrency")}
        loading={isSubmitting}
        onEditorOpen={() => setKey("defaultCurrency")}
        onEditorClose={() => setKey(undefined)}
        handleSubmit={updatePreferredCurrency}
      />
    </>
  );
}
