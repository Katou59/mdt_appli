import { statusesTable } from "@/db/schema";
import Repository from "./repository";
import { KeyValueType } from "@/types/utils/keyValue";

export default class StatusRepository extends Repository {
    public static async getList(): Promise<KeyValueType<number, string>[]> {
        const query = StatusRepository.db.select().from(statusesTable);
        const resultsDb = await query;
        return resultsDb.map((x) => ({ key: x.id, value: x.name }));
    }
}
