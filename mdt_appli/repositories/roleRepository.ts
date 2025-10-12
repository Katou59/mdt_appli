import { rolesTable } from "@/db/schema";
import { KeyValueType } from "@/types/utils/keyValue";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle(process.env.DATABASE_URL!);

export default class RoleRepository {
    public static async getList(): Promise<KeyValueType<number, string>[]> {
        const query = db.select().from(rolesTable).orderBy(rolesTable.id);
        const ranks = await query;

        return ranks.map((x) => ({ key: x.id, value: x.name }));
    }
}
