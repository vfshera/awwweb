import { env } from "~/env.server";
import { db } from "../db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  basePath: "/api/auth",
  baseURL: env.BETTER_AUTH_URL,
  user: { modelName: "users" },
  session: { modelName: "sessions" },
  account: { modelName: "accounts" },
  verification: { modelName: "verifications" },
  emailAndPassword: { enabled: true },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
});

export type AuthType = typeof auth;

export type AuthSession = typeof auth.$Infer.Session;
