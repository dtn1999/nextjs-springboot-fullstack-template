"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PersonalInformationForm } from "@/features/users/components/settings/form/personal-information-form";
import { formatter } from "@/lib/formatter";
import { Skeleton } from "@/components/ui/skeleton";
import { alert } from "@/lib/alert";
import { ProfileVerificationStatus } from "@/features/users/components/settings/profile-verification-status";
import { ProfileInformationForm } from "@/features/users/components/settings/form/profile-information-form";
import { GlobalSettingsForm } from "@/features/users/components/settings/form/global-settings-form";
import { useAccountQuery } from "@/features/users/hooks/use-accounts";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { notFound } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserInformationProps {
  accountId: number;
}

enum TabKey {
  PERSONAL_INFORMATION = "personal-information",
  PROFILE_INFORMATION = "profile-information",
  USER_PREFERENCES = "user-preferences",
  VERIFICATION_STATUS = "verification-status",
}

export function UserInformation({ accountId }: UserInformationProps) {
  const [activeTab, setActiveTab] = useQueryState(
    "accountSettingsTab",
    parseAsStringEnum<TabKey>(Object.values(TabKey)).withOptions({
      history: "push",
    })
  );

  const { account, error, isLoading } = useAccountQuery(accountId, true);

  if (isLoading) {
    return <UserInformationSkeleton />;
  }

  if (error) {
    alert(error);
  }

  // Just to make the compiler happy
  // The useAccountQuery will always return an account or redirect to 404
  // if no account is found
  if (!account) {
    notFound();
  }

  const profile = account.profile;

  const personalInformation = account.personalInformation;

  return (
    <div className="w-full py-2">
      {/* Header */}
      <header className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.profilePictureUrl} alt="Profile" />
            <AvatarFallback className="text-xl">
              {formatter.getFirstCharacter(personalInformation.legalName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold">
              {formatter.legalName(personalInformation.legalName)}
            </h1>
            <p className="text-gray-500">
              {formatter.email(personalInformation.email)}
            </p>
          </div>
        </div>
      </header>

      <Tabs
        value={activeTab ?? TabKey.PERSONAL_INFORMATION}
        onValueChange={(tab) => setActiveTab(tab as TabKey)}
        className="mb-6 w-full"
      >
        {/* Tab lists content */}
        <TabsList className="mb-6 flex h-16 w-full justify-start rounded-none border-none bg-transparent p-0">
          <TabsTrigger value={TabKey.PERSONAL_INFORMATION}>
            Personal information
          </TabsTrigger>
          <TabsTrigger value={TabKey.PROFILE_INFORMATION}>
            Profile information
          </TabsTrigger>
          <TabsTrigger value={TabKey.USER_PREFERENCES}>Preferences</TabsTrigger>
          <TabsTrigger value={TabKey.VERIFICATION_STATUS}>
            Verification status
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[calc(100vh-500px)] w-full">
          {/* Personal information */}
          <TabsContent
            value={TabKey.PERSONAL_INFORMATION}
            className="grid grid-cols-1 gap-4"
          >
            <Card className="border-none shadow-none">
              <CardHeader>
                <CardTitle className="text-xl text-title">
                  Personal information
                </CardTitle>
                <CardDescription>
                  These information are private and not visible by other users.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <PersonalInformationForm
                  {...account.personalInformation}
                  accountId={accountId}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile information */}
          <TabsContent
            value={TabKey.PROFILE_INFORMATION}
            className="grid grid-cols-1 gap-4"
          >
            <Card className="h-fit border-none shadow-none">
              <CardHeader>
                <CardTitle className="text-xl text-title">
                  Profile information
                </CardTitle>
                <CardDescription>
                  These information are seen by other users.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 border-none">
                <ProfileInformationForm
                  {...account.profile}
                  legalName={
                    formatter.legalName(personalInformation.legalName)!
                  }
                  accountId={accountId}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* User preferences */}
          <TabsContent
            value={TabKey.USER_PREFERENCES}
            className="grid grid-cols-1 gap-4"
          >
            <Card className="h-fit border-none shadow-none">
              <CardHeader>
                <CardTitle className="text-xl text-title">
                  Global settings
                </CardTitle>
                <CardDescription>
                  These settings are synced across all devices.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 border-none">
                <GlobalSettingsForm
                  {...account.settings.global}
                  accountId={accountId}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verification status */}
          <TabsContent
            value={TabKey.VERIFICATION_STATUS}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            <Card className="h-fit shadow-none">
              <ProfileVerificationStatus
                accountId={accountId}
                isEmailVerified={profile.isEmailVerified}
                isPhoneVerified={profile.isPhoneNumberVerified}
                isIdVerified={profile.isGovernmentIdVerified}
                governmentId={personalInformation.governmentId}
              />
            </Card>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

export function UserInformationSkeleton() {
  return (
    <div className="w-full py-2">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-6 w-36" />
          </div>
        </div>
      </div>
      {/*  */}
      <div className="mb-6 flex h-16 w-full justify-start space-x-2 rounded-none border-b border-border bg-transparent pb-2">
        <Skeleton className="h-full w-[200px]" />
        <Skeleton className="h-full w-[200px]" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Skeleton className="h-[450px] rounded-xl border border-border shadow-none" />
        <Skeleton className="h-[350px] rounded-xl border border-border shadow-none" />
      </div>
    </div>
  );
}
