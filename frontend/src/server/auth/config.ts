import { type NextAuthConfig } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

import { env } from "@/env";
import { CozyCallbacks } from "./cozi-callback";

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  debug: true,
  secret: env.NEXTAUTH_SECRET,
  providers: [
    Auth0Provider({
      issuer: env.AUTH0_ISSUER || "",
      authorization: {
        params: {
          scope: "openid context email offline_access",
          audience: env.AUTH0_AUDIENCE ?? "",
          prompt: "login", // force login prompt
        },
      },
    }),
  ],
  callbacks: CozyCallbacks,
} satisfies NextAuthConfig;
