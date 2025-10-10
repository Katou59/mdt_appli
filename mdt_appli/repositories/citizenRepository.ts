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
import { eq, ilike, sql, or, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { alias } from "drizzle-orm/pg-core";

const db = drizzle(process.env.DATABASE_URL!);

export default class CitizenRepository {
    static async GetList(
        page: number,
        valuePerPage: number,
        search?: string
    ): Promise<Pager<Citizen, CitizenType>> {
        const offset = (page - 1) * valuePerPage;

        const updatedByUsers = alias(usersTable, "updated_by_users");
        const updatedByUsersJobs = alias(jobsTable, "updated_by_user_jobs");
        const updatedByUsersRanks = alias(ranksTable, "updated_by_user_ranks");
        const query = db
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
            .leftJoin(updatedByUsersRanks, eq(updatedByUsersRanks.id, updatedByUsers.rankId));

        if (search && /^[0-9]+$/.test(search.replace(/\s+/g, ""))) {
            query.where(
                ilike(
                    sql`regexp_replace(${citizensTable.phoneNumber}, '[^0-9]', '', 'g')`,
                    sql`'%' || regexp_replace(${search}, '[^0-9]', '', 'g') || '%'`
                )
            );
        } else if (search) {
            const terms = search.split(" ").filter(Boolean);

            const conditions = terms.map((term) =>
                or(
                    ilike(citizensTable.firstName, `%${term}%`),
                    ilike(citizensTable.lastName, `%${term}%`),

                    ilike(sql`cast(${citizensTable.id} as text)`, `%${term}%`)
                )
            );

            query.where(and(...conditions));
        }

        query
            .orderBy(citizensTable.firstName, citizensTable.lastName, citizensTable.birthDate)
            .limit(valuePerPage)
            .offset(offset);

        const dbCitizens = await query;

        const countQuery = db.select({ count: sql<number>`count(*)` }).from(citizensTable);

        if (search && /^[0-9]+$/.test(search.replace(/\s+/g, ""))) {
            countQuery.where(
                ilike(
                    sql`regexp_replace(${citizensTable.phoneNumber}, '[^0-9]', '', 'g')`,
                    sql`'%' || regexp_replace(${search}, '[^0-9]', '', 'g') || '%'`
                )
            );
        } else if (search) {
            const terms = search.split(" ").filter(Boolean);

            const conditions = terms.map((term) =>
                or(
                    ilike(citizensTable.firstName, `%${term}%`),
                    ilike(citizensTable.lastName, `%${term}%`),
                    ilike(sql`cast(${citizensTable.id} as text)`, `%${term}%`)
                )
            );

            countQuery.where(and(...conditions));
        }

        const [{ count }] = await countQuery;

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
