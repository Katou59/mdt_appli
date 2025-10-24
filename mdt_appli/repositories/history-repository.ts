import { HistoryToAddType } from "@/types/db/history";
import Repository from "./repository";
import { historiesTable } from "@/db/schema";

export default class HistoryRepository extends Repository {
    public static async Add(history: HistoryToAddType): Promise<void> {
        await HistoryRepository.db.insert(historiesTable).values(history);
    }
}
