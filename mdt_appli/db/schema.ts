import {bigint, integer, pgTable, varchar} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id:   varchar({ length: 50 }).primaryKey(),
    name: varchar({ length: 50 }),
    email: varchar({ length: 100 }),
});