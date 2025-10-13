import { drizzle } from "drizzle-orm/node-postgres";

export default class Repository {
    protected static db = drizzle(process.env.DATABASE_URL!);
}