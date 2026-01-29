import { config } from "dotenv";
import { expand } from "dotenv-expand";
import pc from "picocolors";
import * as z from "zod";

expand(config());

export const PUBLIC_ENV_PREFIX = "PUBLIC_";

/**
 * Load and validate environment variables using a Zod schema.
 */
export function loadEnv<T extends z.ZodTypeAny>(schema: T): z.infer<T> {
  const parsed = schema.safeParse(process.env);

  if (!parsed.success) {
    const flat = z.flattenError(parsed.error);

    console.log(pc.bold("\n❌ Invalid environment variables:"));
    for (const [key, messages] of Object.entries(flat)) {
      console.log(
        pc.red(
          `- ${pc.bold(key)}: ${pc.italic(
            Array.isArray(messages)
              ? messages.join(", ")
              : (JSON.stringify(messages) ?? "Unknown error"),
          )}`,
        ),
      );
    }

    console.log();
    process.exit(1);
  }

  return parsed.data;
}

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    DB_MIGRATING: z
      .string()
      .default("false")
      .transform((val) => val === "true"),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
  })
  .transform((env) => {
    return {
      ...env,
      PROD: env.NODE_ENV === "production",
      DEV: env.NODE_ENV === "development",
      TEST: env.NODE_ENV === "test",
    };
  });

export type Env = z.infer<typeof envSchema>;

export const env = loadEnv(envSchema);

/**
 * Extract public env keys.
 * - the result type keys will be without the `PUBLIC_` prefix
 */
type PublicKeys<T> = {
  [K in keyof T as K extends `PUBLIC_${infer Rest}` ? Rest : never]: T[K];
};

export type PublicEnv = PublicKeys<Env>;

function getPublicEnv(): PublicEnv {
  const publicEnv: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith(PUBLIC_ENV_PREFIX)) {
      publicEnv[key.slice(PUBLIC_ENV_PREFIX.length) as keyof PublicEnv] = value;
    }
  }

  return publicEnv as PublicEnv;
}

export const clientEnv: PublicEnv = getPublicEnv();
