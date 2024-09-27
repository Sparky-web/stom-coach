import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .refine(
        (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
        "You forgot to change the default URL"
      ),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET: z.string(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url()
    ),
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_CLIENT_SECRET: z.string(),
    // NEXT_PUBLIC_STRAPI_URL: z.string().url(),
    STRAPI_TOKEN: z.string(),
    STRAPI_URL: z.string().url(),
    YMAPS_API_KEY: z.string(),
    EXOLVE_API_KEY: z.string(),
    SBER_LOGIN: z.string(),
    SBER_PASSWORD: z.string(),
    BASE_URL: z.string(),
    GOOGLE_API_KEY: z.string(),
    GOOGLE_API_EMAIL: z.string().email(),
    GOOGLE_SPREADSHEET_ID: z.string(),
    ENABLE_EMAILS: z.boolean(),
    SMTP_HOST: z.string(),
    SMTP_PORT: z.number(),
    SMPT_EMAIL: z.string().email(),
    SMTP_PASSWORD: z.string(),
    ENABLE_PAYMENTS: z.boolean(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_STRAPI_URL: z.string().url(),
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    STRAPI_TOKEN: process.env.STRAPI_TOKEN,
    STRAPI_URL: process.env.STRAPI_URL,
    YMAPS_API_KEY: process.env.YMAPS_API_KEY,
    EXOLVE_API_KEY: process.env.EXOLVE_API_KEY,
    SBER_LOGIN: process.env.SBER_LOGIN,
    SBER_PASSWORD: process.env.SBER_PASSWORD,
    BASE_URL: process.env.BASE_URL,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    GOOGLE_API_EMAIL: process.env.GOOGLE_API_EMAIL,
    GOOGLE_SPREADSHEET_ID: process.env.GOOGLE_SPREADSHEET_ID,
    ENABLE_EMAILS: process.env.ENABLE_EMAILS === "true" ? true : false,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: +process.env.SMTP_PORT,
    SMPT_EMAIL: process.env.SMTP_EMAIL,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    ENABLE_PAYMENTS: process.env.ENABLE_PAYMENTS === "true" ? true : false,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
