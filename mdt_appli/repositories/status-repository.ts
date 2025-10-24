import { statusesTable } from "@/db/schema";
import { KeyValueType } from "@/types/utils/key-value";
import Repository from "./repository";

export default class StatusRepository extends Repository {
    public static async getList(): Promise<KeyValueType<number, string>[]> {
        const query = StatusRepository.db.select().from(statusesTable);
        const resultsDb = await query;
        return resultsDb.map((x) => ({ key: x.id, value: x.name }));
    }
}
