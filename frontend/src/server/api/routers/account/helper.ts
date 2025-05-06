import { Account } from "@/server/types/domain";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export const ACCOUNT_HELPER = {
  extractProfileUrl: (account?: Account | null) => {
    if (account) {
      return account?.profile.profilePictureUrl;
    }
  },
  accountToSession: (
    account: Account,
    session: Session,
    token: JWT
  ): Session => {
    const { lastName, firstName } = account?.personalInformation.legalName ?? {
      lastName: null,
      firstName: null,
    };

    const email = account?.personalInformation.email ?? null;

    const profilePictureUrl = account?.profile.profilePictureUrl;

    const settings = account?.settings.global ?? {
      defaultLanguage: "en",
      defaultCurrency: "USD",
      defaultTimeZone: "Berlin/Europe",
    };

    if (!lastName || !firstName || !email) {
      return {
        ...session,
        error: "UserNotRegisteredError",
        error_description: `User's personal details are missing (firstname or lastname or email).`,
      };
    }

    return {
      ...session,
      isUserRegistered: true,
      user: {
        id: account.id,
        profileId: account.profile.id,
        role: account.role,
        name: `${firstName} ${lastName}`,
        email,
        profilePictureUrl,
        settings: {
          preferredCurrency: settings.defaultCurrency,
          preferredLanguage: settings.defaultLanguage,
        },
      },
      tokens: {
        accessToken: token.access_token,
        refreshToken: token.refresh_token,
      },
    };
  },
};
