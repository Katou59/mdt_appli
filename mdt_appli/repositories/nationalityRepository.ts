import { nationalitiesTable } from "@/db/schema";
import { KeyValueType } from "@/types/utils/keyValue";
import Repository from "./repository";

export default class NationalityRepository extends Repository {
    public static async getList(): Promise<KeyValueType<number, string>[]> {
        const query = NationalityRepository.db.select().from(nationalitiesTable);
        const resultsDb = await query;
        return resultsDb.map((x) => ({ key: x.id, value: x.name }));
    }
}
