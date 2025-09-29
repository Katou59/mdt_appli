import {bigint, boolean, integer, pgTable, varchar} from "drizzle-orm/pg-core";
import {timestamp} from "drizzle-orm/pg-core/columns/timestamp";

export const usersTable = pgTable("users", {
    id: varchar({length: 50}).primaryKey(),
    name: varchar({length: 50}),
    email: varchar({length: 100}),
    createdAt: timestamp("created_at", {withTimezone: true}).defaultNow().notNull(),
    firstLogin: timestamp("first_login", {withTimezone: true}),
    lastLogin: timestamp("last_login", {withTimezone: true}),
    number: integer(),
    firstName: varchar("first_name", {length: 50}),
    lastName: varchar("last_name", {length: 50}),
    phoneNumber: varchar("phone_number", {length: 50}),
    isDisable: boolean("is_disable").default(false),
    jobId: integer("job_id").references(() => jobsTable.id),
    rankId: integer("rank_id").references(() => ranksTable.id),
    role: integer("role").default(0),
});

export const jobsTable = pgTable("jobs", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({length: 50}).notNull(),
});

export const ranksTable = pgTable("ranks", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({length: 50}).notNull(),
    jobId: integer("job_id").references(() => jobsTable.id).notNull().default(1)
});