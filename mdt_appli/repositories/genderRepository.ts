import { gendersTable } from "@/db/schema";
import Repository from "./repository";
import { KeyValueType } from "@/types/utils/keyValue";

export default class GenderRepository extends Repository {
    public static async GetList(): Promise<KeyValueType<number, string>[]> {
        const query = GenderRepository.db.select().from(gendersTable);
        const resultsDb = await query;
        return resultsDb.map((x) => ({ key: x.id, value: x.name }));
    }
}
