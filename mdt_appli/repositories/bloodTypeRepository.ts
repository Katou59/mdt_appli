import { bloodTypesTable } from "@/db/schema";
import { KeyValueType } from "@/types/utils/keyValue";
import Repository from "./repository";

export default class BloodTypeRepository extends Repository {
    public static async getList(): Promise<KeyValueType<number, string>[]> {
        const query = BloodTypeRepository.db.select().from(bloodTypesTable);
        const resultsDb = await query;
        return resultsDb.map((x) => ({ key: x.id, value: x.name }));
    }
}
