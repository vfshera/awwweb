import { env } from "~/env.server";
import * as schema from "./schema/auth";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(env.DATABASE_URL, { schema });

export type DB = typeof db;
