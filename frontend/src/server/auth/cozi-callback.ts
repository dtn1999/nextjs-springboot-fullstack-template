import { JWT } from "next-auth/jwt";
import axios, { type AxiosError } from "axios";
import { Account, type NextAuthConfig, Session } from "next-auth";

import { env } from "@/env";
import { Account as CozyAccount } from "@/server/types/domain";
import { coziApi } from "@/server/config";
import { ACCOUNT_HELPER } from "@/server/api/routers/account/helper";

type Callbacks = Exclude<NextAuthConfig["callbacks"], undefined>;

export const CozyCallbacks: Callbacks = {
  session: async ({ session, token }) => {
    if (token.error) {
      return {
        ...session,
        error: token.error,
      };
    }

    return getSessionData(token, session);
  },

  jwt: async ({ token, account }) => {
    if (account) {
      return validateAndReturnToken(account, token);
    }

    if (Date.now() < token.expires_at * 1000) {
      console.debug("access token is still valid");
      return token;
    } else {
      console.debug(
        "access token is expired, refreshing...",
        token.refresh_token
      );
      const response = await refreshAuth0AccessToken(token.refresh_token);
      if (response.success && response.data) {
        const { access_token, refresh_token, expires_in } = response.data;
        return {
          ...token,
          access_token,
          refresh_token: refresh_token ?? token.refresh_token,
          expires_at: Math.floor(Date.now() / 1000) + expires_in,
        };
      }

      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }
  },
};

export interface RefreshTokenResponse {
  success: boolean;
  data?: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
  error?: string;
}

async function getSessionData(token: JWT, session: Session): Promise<Session> {
  const { access_token: accessToken, refresh_token: refreshToken } = token;

  const { data, error } = await coziApi.GET("/accounts/whoami", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (data) {
    return ACCOUNT_HELPER.accountToSession(data as CozyAccount, session, token);
  }

  if (error.status === 404) {
    return {
      ...session,
      isUserRegistered: false,
      tokens: {
        accessToken,
        refreshToken,
      },
      error_description: error.detail,
    };
  }

  return {
    expires: session.expires,
    tokens: {
      accessToken,
      refreshToken,
    },
    error_description: error.detail,
  };
}

async function refreshAuth0AccessToken(
  refreshToken: string
): Promise<RefreshTokenResponse> {
  const options = {
    method: "POST",
    url: `${env.AUTH0_ISSUER}/oauth/token`,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    data: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: env.AUTH_AUTH0_ID,
      client_secret: env.AUTH_AUTH0_SECRET,
      refresh_token: refreshToken,
    }),
  };

  try {
    const { data } = await axios.request(options);
    return {
      success: true,

      data: {
        ...data,
      },
    };
  } catch (error) {
    const axiosError = (
      error as AxiosError<{ error: string; error_description: string }>
    ).response?.data;

    if (!axiosError) {
      return {
        success: false,
        error: "Unknown error",
      };
    }

    return {
      success: false,
      error: `${axiosError?.error}: ${axiosError?.error_description}`,
    };
  }
}

function validateAndReturnToken(account: Account, token: JWT): JWT {
  const { access_token, refresh_token, expires_at } = account;

  if (!access_token) {
    console.error("access_token is missing. >>", token);
    return {
      ...token,
      error: "AuthenticationError",
      error_description: "access_token is missing",
    };
  }

  if (!refresh_token) {
    console.log("refresh_token is missing. >>", token);
    return {
      ...token,
      error: "AuthenticationError",
      error_description: "refresh_token is missing",
    };
  }

  if (!expires_at) {
    console.log("expires_at is missing. >>", token);
    return {
      ...token,
      error: "AuthenticationError",
      error_description: "expires_at is missing",
    };
  }

  return {
    ...token,
    access_token,
    refresh_token,
    expires_at,
  };
}
