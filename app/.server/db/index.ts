import * as schema from "./schema";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

const sqlite = new Database("sqlite.db");

export const db = drizzle({ client: sqlite, schema });

export type DB = typeof db;
