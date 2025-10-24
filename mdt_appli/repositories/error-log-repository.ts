import { errorLogsTable } from "@/db/schema";
import { ErrorLogToAddType } from "@/types/db/error-log";
import Repository from "./repository";

export default class ErrorLogRepository extends Repository {
    public static async Add(errorLog: ErrorLogToAddType) {
        await ErrorLogRepository.db.insert(errorLogsTable).values(errorLog);
    }
}
