import {
  Address,
  EmergencyContact,
  LegalName,
  PhoneNumber,
} from "@/server/types/domain";
import { format } from "date-fns";
import { formatPhoneNumberIntl } from "react-phone-number-input";

export const formatter = {
  getFirstCharacter: (name: LegalName) => {
    if (!name) {
      return "";
    }

    if (name.firstName && name.firstName.length > 0) {
      return name.firstName[0];
    }

    if (name.lastName && name.lastName.length > 0) {
      return name.lastName[0];
    }
  },

  legalName: (name?: LegalName) => {
    if (!name) {
      return undefined;
    }

    return `${name.firstName} ${name.lastName}`;
  },

  email: (email?: string, masked?: boolean) => {
    if (!email || email.trim() === "") {
      return "";
    }

    if (!email.includes("@")) {
      return email;
    }

    const [user, domain] = email.split("@");

    // Ensure the user part is long enough to mask
    if (masked && user && user.length >= 3) {
      return `${user.slice(0, 3)}***@${domain}`;
    }

    return email;
  },

  address: (address?: Address) => {
    if (
      !address?.country ||
      !address?.state ||
      !address?.city ||
      !address?.zipCode ||
      !address?.street
    ) {
      return undefined;
    }

    return `${address?.country} ${address?.state} ${address?.city} ${address?.zipCode} ${address?.street}`;
  },

  phoneObject: (phone?: PhoneNumber) => {
    if (!phone) {
      return undefined;
    }
    return formatPhoneNumberIntl(`${phone.countryCode} ${phone.number}`);
  },

  phoneString: (phone?: string) => {
    if (!phone) {
      return undefined;
    }
    return `${formatPhoneNumberIntl(phone)}`;
  },

  emergencyContact: (contact?: EmergencyContact) => {
    if (!contact?.name) {
      return undefined;
    }
    return `${contact?.name}`;
  },

  verificationDate: (date?: string) => {
    if (!date) {
      return undefined;
    }
    return format(date, "dd MMMM yyyy 'at' HH:mm");
  },
};
