import { env } from "~/env.server";
import { db } from "../db";
import * as schema from "../db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  basePath: "/api/auth",
  baseURL: env.BETTER_AUTH_URL,
  account: {
    accountLinking: { enabled: true, trustedProviders: ["github"] },
  },
  emailAndPassword: { enabled: true },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema,
  }),
});

export type AuthType = typeof auth;

export type AuthSession = typeof auth.$Infer.Session;
