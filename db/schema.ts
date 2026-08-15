import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

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
  consentVersion: text("consent_version").notNull().default("2026-08-v2.1"),
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
