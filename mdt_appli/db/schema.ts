import { boolean, integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core/columns/timestamp";

export const usersTable = pgTable("users", {
    id: varchar({ length: 50 }).primaryKey(),
    name: varchar({ length: 50 }),
    email: varchar({ length: 100 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    firstLogin: timestamp("first_login", { withTimezone: true }),
    lastLogin: timestamp("last_login", { withTimezone: true }),
    number: integer(),
    firstName: varchar("first_name", { length: 50 }),
    lastName: varchar("last_name", { length: 50 }),
    phoneNumber: varchar("phone_number", { length: 50 }),
    isDisable: boolean("is_disable").default(false),
    jobId: integer("job_id").references(() => jobsTable.id),
    rankId: integer("rank_id").references(() => ranksTable.id),
    role: integer("role")
        .default(0)
        .references(() => rolesTable.id),
});

export const jobsTable = pgTable("jobs", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 50 }).notNull(),
});

export const ranksTable = pgTable("ranks", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 50 }).notNull(),
    jobId: integer("job_id")
        .references(() => jobsTable.id)
        .notNull()
        .default(1),
    order: integer("order").notNull(),
});
// Relation: Un utilisateur (usersTable) peut créer plusieurs citoyens (citizensTable)

export const citizensTable = pgTable("citizens", {
    id: uuid("id").primaryKey().defaultRandom(),
    firstName: varchar("first_name", { length: 50 }).notNull(),
    lastName: varchar("last_name", { length: 50 }).notNull(),
    birthDate: varchar("birth_date", { length: 20 }),
    birthPlace: varchar("birth_place", { length: 100 }),
    nationalityId: integer("nationality_id").references(() => nationalitiesTable.id),
    height: integer("height"),
    weight: integer("weight"),
    phoneNumber: varchar("phone_number", { length: 50 }),
    licenseId: varchar("license_id", { length: 50 }),
    job: varchar("job", { length: 50 }),
    address: varchar("address", { length: 250 }),
    city: varchar("city", { length: 100 }),
    isWanted: boolean("is_wanted").default(false),
    note: varchar("note", { length: 255 }),
    photoUrl: varchar("photo_url", { length: 255 }),
    createdBy: varchar("created_by", { length: 50 })
        .references(() => usersTable.id)
        .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    updatedBy: varchar("updated_by", { length: 50 })
        .references(() => usersTable.id)
        .notNull(),
    statusId: integer("status_id").references(() => statusesTable.id),
    bloodTypeId: integer("blood_type_id").references(() => bloodTypesTable.id),
    genderId: integer("gender_id").references(() => gendersTable.id),
});

// Tables de référence pour les citoyens
export const statusesTable = pgTable("statuses", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 30 }).notNull(),
    enumLabel: varchar("enum_label", { length: 30 }),
});

export const bloodTypesTable = pgTable("blood_types", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 10 }).notNull(),
    enumLabel: varchar("enum_label", { length: 30 }),
});

export const gendersTable = pgTable("genders", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 20 }).notNull(),
    enumLabel: varchar("enum_label", { length: 30 }),
});

export const rolesTable = pgTable("roles", {
    id: integer("id").primaryKey(),
    name: varchar("name", { length: 20 }).notNull(),
    enumLabel: varchar("enum_label", { length: 30 }),
});

export const nationalitiesTable = pgTable("nationalities", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 50 }).notNull(),
});
