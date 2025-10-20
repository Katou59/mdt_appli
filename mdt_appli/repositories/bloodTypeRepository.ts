import { bloodTypesTable } from "@/db/schema";
import Repository from "./repository";
import { KeyValueType } from "@/types/utils/keyValue";

export default class BloodTypeRepository extends Repository {
    public static async GetList(): Promise<KeyValueType<number, string>[]> {
        const query = BloodTypeRepository.db.select().from(bloodTypesTable);
        const resultsDb = await query;
        return resultsDb.map((x) => ({ key: x.id, value: x.name }));
    }
}
