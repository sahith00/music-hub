import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core"

/** Public profile only — no passwords, emails, or other sensitive fields. */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  displayName: varchar("display_name", { length: 80 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})
