import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const interestSignups = sqliteTable("interest_signups", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  location: text("location").notNull(),
  interests: text("interests").notNull(),
  contribution: text("contribution"),
  consent: integer("consent").notNull().default(1),
  consentVersion: text("consent_version").notNull().default("2026-08-bibha-v2.1"),
  status: text("status").notNull().default("new"),
  adminNote: text("admin_note"),
  followedUpAt: integer("followed_up_at"),
  updatedAt: integer("updated_at"),
  source: text("source"),
  confirmationEmailStatus: text("confirmation_email_status").notNull().default("not_configured"),
  ownerEmailStatus: text("owner_email_status").notNull().default("not_configured"),
}, (table) => [uniqueIndex("idx_interest_email").on(table.email)]);

export const feedback = sqliteTable("feedback", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at").notNull(),
  audience: text("audience").notNull(),
  rating: integer("rating").notNull(),
  message: text("message").notNull(),
  email: text("email"),
  status: text("status").notNull().default("new"),
  source: text("source"),
  notificationEmailStatus: text("notification_email_status").notNull().default("not_configured"),
});

export const submissionLimits = sqliteTable("submission_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(1),
  expiresAt: integer("expires_at").notNull(),
});

export const founderAuthCodes = sqliteTable("founder_auth_codes", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  codeHash: text("code_hash").notNull(),
  createdAt: integer("created_at").notNull(),
  expiresAt: integer("expires_at").notNull(),
  attempts: integer("attempts").notNull().default(0),
  consumedAt: integer("consumed_at"),
}, (table) => [index("idx_founder_auth_codes_email_created").on(table.email, table.createdAt)]);

export const founderSessions = sqliteTable("founder_sessions", {
  tokenHash: text("token_hash").primaryKey(),
  email: text("email").notNull(),
  createdAt: integer("created_at").notNull(),
  expiresAt: integer("expires_at").notNull(),
  lastSeenAt: integer("last_seen_at").notNull(),
}, (table) => [index("idx_founder_sessions_expires").on(table.expiresAt)]);
