import { historiesTable } from "@/db/schema";
import { HistoryToAddType } from "@/types/db/history";
import Repository from "./repository";

export default class HistoryRepository extends Repository {
    public static async add(history: HistoryToAddType): Promise<void> {
        await HistoryRepository.db.insert(historiesTable).values(history);
    }
}
