import {
    bloodTypesTable,
    citizensTable,
    gendersTable,
    jobsTable,
    ranksTable,
    statusesTable,
    usersTable,
} from "@/db/schema";
import Citizen from "@/types/class/Citizen";
import Pager from "@/types/class/Pager";
import { CitizenType } from "@/types/db/citizen";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { alias } from "drizzle-orm/pg-core";

const db = drizzle(process.env.DATABASE_URL!);

export default class CitizenRepository {
    static async GetList(page: number, valuePerPage: number): Promise<Pager<Citizen, CitizenType>> {
        const offset = (page - 1) * valuePerPage;

        const updatedByUsers = alias(usersTable, "updated_by_users");
        const updatedByUsersJobs = alias(jobsTable, "updated_by_user_jobs");
        const updatedByUsersRanks = alias(ranksTable, "updated_by_user_ranks");
        const dbCitizens = await db
            .select()
            .from(citizensTable)
            .leftJoin(bloodTypesTable, eq(bloodTypesTable.id, citizensTable.bloodTypeId))
            .leftJoin(statusesTable, eq(statusesTable.id, citizensTable.statusId))
            .leftJoin(gendersTable, eq(gendersTable.id, citizensTable.genderId))
            .leftJoin(usersTable, eq(usersTable.id, citizensTable.createdBy))
            .leftJoin(jobsTable, eq(jobsTable.id, usersTable.jobId))
            .leftJoin(ranksTable, eq(ranksTable.id, usersTable.rankId))
            .leftJoin(updatedByUsers, eq(updatedByUsers.id, citizensTable.updatedBy))
            .leftJoin(updatedByUsersJobs, eq(updatedByUsersJobs.id, updatedByUsers.jobId))
            .leftJoin(updatedByUsersRanks, eq(updatedByUsersRanks.id, updatedByUsers.rankId))
            .orderBy(citizensTable.firstName, citizensTable.lastName)
            .limit(valuePerPage)
            .offset(offset);

        const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(citizensTable);

        const citizens = dbCitizens
            .map((dbCitizen) =>
                Citizen.getFromDb(
                    dbCitizen.citizens,
                    dbCitizen.genders,
                    dbCitizen.statuses,
                    dbCitizen.blood_types,
                    dbCitizen.users!,
                    dbCitizen.ranks!,
                    dbCitizen.jobs!,
                    dbCitizen.updated_by_users!,
                    dbCitizen.updated_by_user_ranks!,
                    dbCitizen.updated_by_user_jobs!
                )
            )
            .filter((x): x is Citizen => x !== null);

        return new Pager(citizens, count, valuePerPage, page);
    }
}
