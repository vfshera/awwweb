import type { DefaultOmit } from "../types";
import { createdAtTimestamp, primaryKeyCuid2, updatedAtTimestamp } from "../utils";
import { relations } from "drizzle-orm";
import { boolean, index, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: primaryKeyCuid2,
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: createdAtTimestamp,
  updatedAt: updatedAtTimestamp,
});

export const userRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}));

export type User = typeof users.$inferSelect;

export type InsertUser = Omit<typeof users.$inferInsert, DefaultOmit>;

export const sessions = pgTable(
  "sessions",
  {
    id: primaryKeyCuid2,
    token: text("token").unique().notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    expiresAt: timestamp("expires_at", {
      mode: "date",
    }).notNull(),
    createdAt: createdAtTimestamp,
    updatedAt: updatedAtTimestamp,
  },
  (t) => [index("idx_session_user_id").on(t.userId)],
);

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export type Session = typeof sessions.$inferSelect;

export type InsertSession = Omit<typeof sessions.$inferInsert, DefaultOmit>;

export const accounts = pgTable(
  "accounts",
  {
    id: primaryKeyCuid2,
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("userId")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      mode: "date",
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      mode: "date",
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: createdAtTimestamp,
    updatedAt: updatedAtTimestamp,
  },
  (t) => [unique("unique_account").on(t.providerId, t.accountId)],
);

export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export type Account = typeof accounts.$inferSelect;

export type InsertAccount = Omit<typeof accounts.$inferInsert, DefaultOmit>;

export const verifications = pgTable("verifications", {
  id: primaryKeyCuid2,
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", {
    mode: "date",
  }).notNull(),
  createdAt: createdAtTimestamp,
  updatedAt: updatedAtTimestamp,
});

export type Verification = typeof verifications.$inferSelect;

export type InsertVerification = Omit<typeof verifications.$inferInsert, DefaultOmit>;
