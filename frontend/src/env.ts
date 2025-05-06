import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    SENDGRID_API_KEY: z.string().min(1),
    AUTH0_SCOPE: z
      .string()
      .min(1)
      .default("openid context email offline_access"),
    AUTH0_ISSUER: z.string().min(1),
    AUTH0_AUDIENCE: z.string().min(1),
    AUTH_AUTH0_ID: z.string().min(1),
    AUTH_AUTH0_SECRET: z.string().min(1),
    CLOUDINARY_API_SECRET: z.string().min(1),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_AUTH0_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_EMAIL_SENDER: z.string().email(),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
    NEXT_PUBLIC_CLOUDINARY_API_KEY: z.string().min(1),
    NEXT_PUBLIC_API_GATEWAY_URL: z.string().url(),
    NEXT_PUBLIC_STRIPE_PB_KEY: z.string().min(1),
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    AUTH0_ISSUER: process.env.AUTH0_ISSUER,
    AUTH0_SCOPE: process.env.AUTH0_SCOPE,
    AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
    AUTH_AUTH0_ID: process.env.AUTH_AUTH0_ID,
    AUTH_AUTH0_SECRET: process.env.AUTH_AUTH0_SECRET,
    NEXT_PUBLIC_STRIPE_PB_KEY: process.env.NEXT_PUBLIC_STRIPE_PB_KEY,
    NEXT_PUBLIC_API_GATEWAY_URL: process.env.NEXT_PUBLIC_API_GATEWAY_URL,
    NEXT_PUBLIC_AUTH0_DOMAIN: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
    NEXT_PUBLIC_EMAIL_SENDER: process.env.NEXT_PUBLIC_EMAIL_SENDER,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: true,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
