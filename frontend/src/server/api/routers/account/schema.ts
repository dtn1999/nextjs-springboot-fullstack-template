import { z } from "zod";
import { DATE_FORMAT, DateSchema } from "@/server/api/schema";
import { differenceInYears, parse } from "date-fns";
import { GovernmentIdStatusEnum } from "@/server/generated/app.backend.api";

export const RegistrationFormSchema = z.object({
  firstname: z.string().nonempty(),
  lastname: z.string().nonempty(),
  birthdate: DateSchema.refine(
    (value) => {
      const parsedDate = parse(value, DATE_FORMAT, new Date());
      // Calculate the user's age
      const age = differenceInYears(new Date(), parsedDate);
      // Check if the user is at least 18 years old
      return age >= 18;
    },
    {
      message: "You must be at least 18 years old",
    }
  ),
  email: z.string().email(),
  newsletter: z.boolean().optional(),
});

export type RegistrationFormData = z.infer<typeof RegistrationFormSchema>;

export const LegalNameSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
});

export type LegalNameFormData = z.infer<typeof LegalNameSchema>;

export const EmailSchema = z.object({
  email: z.string().email(),
});

export type EmailFormData = z.infer<typeof EmailSchema>;

export const ProfileBioSchema = z.object({
  about: z.string().nonempty(),
});

export type ProfileBioFormData = z.infer<typeof ProfileBioSchema>;

export const PhoneNumbersSchema = z.object({
  phone: z
    .string()
    .nonempty()
    .refine((value) => !!value, { message: "Phone number is required" }),
});

export type PhoneNumberFormData = z.infer<typeof PhoneNumbersSchema>;

export const AddressSchema = z.object({
  street: z.string().nonempty({ message: "Street is required" }),
  city: z.string().nonempty({ message: "City is required" }),
  state: z.string().nonempty({ message: "State is required" }),
  zipCode: z.string().nonempty({ message: "Zip code is required" }),
  country: z.string().nonempty({ message: "Country is required" }),
});

export type AddressFormData = z.infer<typeof AddressSchema>;

export const EmergencyContactSchema = z
  .object({
    name: z.string().nonempty({ message: "Name is required" }),
    relationship: z.string().nonempty({ message: "Relationship is required" }),
    phone: z.string().nonempty({ message: "Phone number is required" }),
  })
  .merge(EmailSchema);

export type EmergencyContactFormData = z.infer<typeof EmergencyContactSchema>;

export const IdVerificationFormSchema = z.object({
  idFrontSideImage: z.string().url(),
  idBackSideImage: z.string().url(),
  selfieWithIdImage: z.string().url(),
});

export type IdVerificationFormData = z.infer<typeof IdVerificationFormSchema>;

export const GovernmentIdVerificationSchema = z.object({
  status: z.enum(
    Object.values<GovernmentIdStatusEnum>(GovernmentIdStatusEnum) as [
      string,
      ...string[],
    ]
  ),
  rejectionReason: z.string().nonempty().optional(),
});

export const PreferredLanguageSchema = z.object({
  preferredLanguage: z.string().nonempty(),
});

export type PreferredLanguageData = z.infer<typeof PreferredLanguageSchema>;

export const PreferredCurrencySchema = z.object({
  preferredCurrency: z.string().nonempty(),
});

export type PreferredCurrencyData = z.infer<typeof PreferredCurrencySchema>;

export const ProfileSchema = z.object({
  profileImageUrl: z.string().url().optional(),
  about: z.string().optional(),
});

export type ProfileData = z.infer<typeof ProfileSchema>;

export const PatchAccountEmailSchema = z.object({
  email: z.string().email(),
});

export const PatchAccountLegalNameSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

export const PatchAccountPhoneNumberSchema = z.object({
  countryCode: z.string(),
  number: z.string(),
});

export const PatchAccountEmergencyContactSchema = z.object({
  name: z.string(),
  preferredLanguage: z.string(),
  relationship: z.string(),
  email: z.string().email(),
  phoneNumber: PatchAccountPhoneNumberSchema,
});

export const PatchAccountAddressSchema = z.object({
  country: z.string(),
  state: z.string(),
  city: z.string(),
  street: z.string(),
  zipCode: z.string(),
});

export const PatchProfilePictureUrlSchema = z.object({
  profilePictureUrl: z.string().url(),
});

export const PatchProfileBioSchema = z.object({
  about: z.string(),
});

export const PatchAccountInputSchema = z.object({
  email: PatchAccountEmailSchema.optional(),
  legalName: PatchAccountLegalNameSchema.optional(),
  emergencyContact: PatchAccountEmergencyContactSchema.optional(),
  governmentId: IdVerificationFormSchema.optional(),
  address: PatchAccountAddressSchema.optional(),
  phoneNumber: PatchAccountPhoneNumberSchema.optional(),
  preferredLanguage: PreferredLanguageSchema.optional(),
  preferredCurrency: PreferredCurrencySchema.optional(),
  profilePictureUrl: PatchProfilePictureUrlSchema.optional(),
  about: PatchProfileBioSchema.optional(),
});
