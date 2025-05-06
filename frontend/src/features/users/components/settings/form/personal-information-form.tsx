"use client";

import {
  Address,
  Email,
  EmergencyContact,
  LegalName,
  PersonalInformation,
  PhoneNumber,
} from "@/server/types/domain";
import { AddressForm } from "./address-form";
import { EmailForm } from "./email-form";
import { EmergencyContactForm } from "./emergency-contact-form";
import { LegalNameForm } from "./legal-name-form";
import { PhoneNumberForm } from "./phone-number-form";
import { useCallback, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { GovernmentIdSettingInput } from "@/features/users/components/settings/government-id-setting-input";
import { usePatchAccountMutation } from "@/features/users/hooks/use-accounts";

export interface BasicFormProps {
  disabled?: boolean;
  loading?: boolean;
  onEditorOpen?: () => void;
  onEditorClose?: () => void;
}

export type PersonalInformationKeys = keyof PersonalInformation;

interface PersonalInformationFormProps extends PersonalInformation {
  accountId: number;
}

export function PersonalInformationForm(
  personalInformation: PersonalInformationFormProps
) {
  const { accountId } = personalInformation;
  const router = useRouter();
  const [key, setKey] = useState<PersonalInformationKeys>();
  const { mutateAsync: updateUserInfo, isPending: isSubmitting } =
    usePatchAccountMutation();

  const isDisabled = useCallback(
    (inputKey: PersonalInformationKeys) => {
      if (key) {
        return key !== inputKey || isSubmitting;
      }
      return isSubmitting;
    },
    [key, isSubmitting]
  );

  const updateLegalName = async (data: LegalName) => {
    await updateUserInfo({ accountId, legalName: data });
  };

  const updateEmail = async (email: Email) => {
    await updateUserInfo({ accountId, email: { email } });
  };

  const updatePhoneNumber = async (phoneNumber: PhoneNumber) => {
    await updateUserInfo({ accountId, phoneNumber });
  };

  const updateAddress = async (address: Address) => {
    await updateUserInfo({ accountId, address });
  };

  const updateEmergencyContact = async (emergencyContact: EmergencyContact) => {
    await updateUserInfo({ accountId, emergencyContact });
  };

  const handleStartIdentityVerification = () => {
    router.push(
      `/account/settings/information/verifications/${accountId}/government-id`
    );
  };

  return (
    <div className="flex flex-col items-start">
      {/* Legal name */}
      <LegalNameForm
        loading={isSubmitting}
        handleSubmit={updateLegalName}
        disabled={isDisabled("legalName")}
        onEditorOpen={() => setKey("legalName")}
        onEditorClose={() => setKey(undefined)}
        defaultValues={personalInformation.legalName}
      />
      {/*  Email */}
      <EmailForm
        loading={isSubmitting}
        handleSubmit={updateEmail}
        disabled={isDisabled("email")}
        defaultValues={personalInformation.email}
        onEditorOpen={() => setKey("email")}
        onEditorClose={() => setKey(undefined)}
      />
      {/*  Phone name */}
      <PhoneNumberForm
        loading={isSubmitting}
        handleSubmit={updatePhoneNumber}
        disabled={isDisabled("phoneNumber")}
        defaultValues={personalInformation.phoneNumber}
        onEditorOpen={() => setKey("phoneNumber")}
        onEditorClose={() => setKey(undefined)}
      />

      {/* Identification */}
      <GovernmentIdSettingInput
        accountId={accountId}
        disabled={isDisabled("governmentId")}
        onClick={handleStartIdentityVerification}
        governmentId={personalInformation.governmentId}
      />

      {/*  Address */}
      <AddressForm
        loading={isSubmitting}
        handleSubmit={updateAddress}
        disabled={isDisabled("address")}
        defaultValues={personalInformation.address}
        onEditorOpen={() => setKey("address")}
        onEditorClose={() => setKey(undefined)}
      />

      {/*  Emergency Contact */}
      <EmergencyContactForm
        loading={isSubmitting}
        handleSubmit={updateEmergencyContact}
        disabled={isDisabled("emergencyContact")}
        defaultValues={personalInformation.emergencyContact}
        onEditorOpen={() => setKey("emergencyContact")}
        onEditorClose={() => setKey(undefined)}
      />
    </div>
  );
}
