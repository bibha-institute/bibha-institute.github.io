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
}, (table) => [uniqueIndex("idx_interest_email").on(table.email)]);

export const feedback = sqliteTable("feedback", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at").notNull(),
  audience: text("audience").notNull(),
  rating: integer("rating").notNull(),
  message: text("message").notNull(),
});
