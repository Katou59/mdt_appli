import { finesTable, jobsTable, ranksTable, rolesTable, usersTable } from "@/db/schema";
import Fine from "@/types/class/Fine";
import { eq } from "drizzle-orm";
import Repository from "./repository";

export default class FineRepository extends Repository {
    public static async getList() {
        const resultsDb = await FineRepository.db
            .select()
            .from(finesTable)
            .leftJoin(usersTable, eq(usersTable.id, finesTable.createdBy))
            .leftJoin(jobsTable, eq(jobsTable.id, usersTable.jobId))
            .leftJoin(ranksTable, eq(ranksTable.id, usersTable.rankId))
            .leftJoin(rolesTable, eq(rolesTable.id, usersTable.roleId));

        return resultsDb.map((result) =>
            Fine.getFromDb(result.fines, result.users!, result.jobs!, result.ranks!, result.roles!)
        );
    }
}
