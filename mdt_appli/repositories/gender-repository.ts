import { gendersTable } from "@/db/schema";
import { KeyValueType } from "@/types/utils/key-value";
import Repository from "./repository";

export default class GenderRepository extends Repository {
    public static async getList(): Promise<KeyValueType<number, string>[]> {
        const query = GenderRepository.db.select().from(gendersTable);
        const resultsDb = await query;
        return resultsDb.map((x) => ({ key: x.id, value: x.name }));
    }
}
