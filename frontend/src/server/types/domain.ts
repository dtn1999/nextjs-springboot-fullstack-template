import {
  AccountRole,
  SchemaAccount,
  SchemaAccountProjection,
  SchemaAmenity,
  SchemaAvailability,
  SchemaBooking,
  SchemaCardDetails,
  SchemaConversation,
  SchemaEmailUniquenessResponse,
  SchemaGlobalSettings,
  SchemaIdentityVerificationResponse,
  SchemaInquiry,
  SchemaLegalName,
  SchemaListing,
  SchemaListingType,
  SchemaLocation,
  SchemaMessage,
  SchemaPaymentAccount,
  SchemaPaypalDetails,
  SchemaPersonalInformation,
  SchemaProblemDetail,
  SchemaProfile,
  SchemaStartFuturePaymentSessionResponse,
} from "@/server/generated/cozi";

export interface SessionUser {
  id: number;
  email: string;
  name: string;
  role: AccountRole;
  profileId: number;
  profilePictureUrl?: string;
  settings: Settings;
}

// Account
export type Account = SchemaAccount;
export type Profile = SchemaProfile;
export type GlobalSettings = SchemaGlobalSettings;
export type EmailUniquenessResponse = SchemaEmailUniquenessResponse;
export type PersonalInformation = SchemaPersonalInformation;

export type LegalName = SchemaLegalName;
export type Email = PersonalInformation["email"];
export type PhoneNumber = PersonalInformation["phoneNumber"];
export type GovernmentId = PersonalInformation["governmentId"];
export type IdentityVerificationResponse = SchemaIdentityVerificationResponse;
export type Address = PersonalInformation["address"];
export type EmergencyContact = PersonalInformation["emergencyContact"];
export type AccountProjection = SchemaAccountProjection;

export type Settings = {
  preferredLanguage: string;
  preferredCurrency: string;
};

// Listings
export type Listing = SchemaListing;
export type ListingAmenity = SchemaAmenity;
export type ListingType = SchemaListingType;
export type ListingLocation = SchemaLocation;
export type ListingAvailability = SchemaAvailability;

// Bookings
export type Inquiry = SchemaInquiry;
export type Booking = SchemaBooking;

// Billing
export type PaymentAccount = SchemaPaymentAccount;
export type PaypalDetails = SchemaPaypalDetails;
export type CardDetails = SchemaCardDetails;
export type StartFuturePaymentSessionResponse =
  SchemaStartFuturePaymentSessionResponse;

// Conversations
export type Message = SchemaMessage;
export type Conversation = SchemaConversation;

// Other
export type ProblemDetail = SchemaProblemDetail;
