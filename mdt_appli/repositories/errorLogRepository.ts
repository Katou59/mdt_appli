import { errorLogsTable } from "@/db/schema";
import Repository from "./repository";
import { ErrorLogToAddType } from "@/types/db/errorLog";

export default class ErrorLogRepository extends Repository {
    public static async Add(errorLog: ErrorLogToAddType){
        await ErrorLogRepository.db.insert(errorLogsTable).values(errorLog);
    }
}