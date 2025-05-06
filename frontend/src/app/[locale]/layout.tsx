import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { type Locale } from "@/i18n/types";
import { ModalProvider } from "@/components/modal-provider";
import { LoadingScreen } from "@/components/loader";
import { HydrateClient } from "@/trpc/server";
import { PropsWithChildren } from "react";
import { Toaster } from "@/components/ui/sonner";
import { UserSettingsProvider } from "@/features/users/components/user-settings-provider";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Layout({
  children,
  params,
}: PropsWithChildren<Props>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <UserSettingsProvider>
        <HydrateClient>{children}</HydrateClient>
      </UserSettingsProvider>
      <ModalProvider />
      <LoadingScreen />
      <Toaster richColors />
    </NextIntlClientProvider>
  );
}
