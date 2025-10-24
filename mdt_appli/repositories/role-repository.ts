import { rolesTable } from "@/db/schema";
import { KeyValueType } from "@/types/utils/key-value";
import Repository from "./repository";

export default class RoleRepository extends Repository {
    public static async getList(): Promise<KeyValueType<number, string>[]> {
        const query = RoleRepository.db.select().from(rolesTable).orderBy(rolesTable.id);
        const ranks = await query;

        return ranks.map((x) => ({ key: x.id, value: x.name }));
    }
}
