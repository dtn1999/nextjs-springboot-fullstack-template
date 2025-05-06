"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Account } from "@/server/types/domain";
import { formatter } from "@/lib/formatter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileVerificationCardInfoProps {
  account: Account;
}

export function ProfileVerificationCardInfo({
  account,
}: ProfileVerificationCardInfoProps) {
  if (!account) return null;

  const accountPersonalInformation = account.personalInformation;
  const legalName = accountPersonalInformation.legalName;
  const accountProfile = account.profile;

  const NotProvided = () => (
    <span className="py-2 text-red-600">Not provided yet</span>
  );

  return (
    <Card className="h-fit w-[350px]">
      <CardContent className="flex flex-col items-center p-6">
        <Avatar className="relative size-40">
          <AvatarImage
            src={accountProfile.profilePictureUrl}
            alt={`${legalName.firstName}'s profile picture`}
          />
          <AvatarFallback>
            {formatter.getFirstCharacter(legalName)}
          </AvatarFallback>
        </Avatar>
        <h2 className="mb-6 text-2xl font-semibold text-[#1f2937]">
          <span className="underline">
            {`${legalName.firstName} ${legalName.lastName}'s`}
          </span>{" "}
          information
        </h2>
        <div className="w-full space-y-6">
          <div>
            <h3 className="text-lg font-medium text-[#1f2937]">Firstname</h3>
            <p className="text-[#1f2937]">{legalName.firstName}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-[#1f2937]">Lastname</h3>
            <p className="text-[#1f2937]">{legalName.lastName}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-[#1f2937]">Email</h3>
            <p className="text-[#1f2937]">
              {accountPersonalInformation.email ?? <NotProvided />}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-[#1f2937]">Phone number</h3>
            <p className="text-[#1f2937]">
              {formatter.phoneObject(
                accountPersonalInformation.phoneNumber
              ) ?? <NotProvided />}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-[#1f2937]">Address</h3>
            <p className="text-[#1f2937]">
              {formatter.address(accountPersonalInformation.address) ?? (
                <NotProvided />
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
