import {
    bloodTypesTable,
    citizensTable,
    gendersTable,
    jobsTable,
    nationalitiesTable,
    ranksTable,
    rolesTable,
    statusesTable,
    usersTable,
} from "@/db/schema";
import Citizen from "@/types/class/Citizen";
import Pager from "@/types/class/Pager";
import User from "@/types/class/User";
import { CitizenToCreateType, CitizenType } from "@/types/db/citizen";
import { and, eq, ilike, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import Repository from "./repository";

export default class CitizenRepository extends Repository {
    static async getList(
        page: number,
        valuePerPage: number,
        search?: string
    ): Promise<Pager<Citizen, CitizenType>> {
        const offset = (page - 1) * valuePerPage;

        const updatedByUsers = alias(usersTable, "updated_by_users");
        const updatedByUsersJobs = alias(jobsTable, "updated_by_user_jobs");
        const updatedByUsersRanks = alias(ranksTable, "updated_by_user_ranks");
        const updatedByUsersRoles = alias(rolesTable, "updated_by_user_roles");
        const query = CitizenRepository.db
            .select()
            .from(citizensTable)
            .leftJoin(bloodTypesTable, eq(bloodTypesTable.id, citizensTable.bloodTypeId))
            .leftJoin(statusesTable, eq(statusesTable.id, citizensTable.statusId))
            .leftJoin(gendersTable, eq(gendersTable.id, citizensTable.genderId))
            .leftJoin(usersTable, eq(usersTable.id, citizensTable.createdBy))
            .leftJoin(jobsTable, eq(jobsTable.id, usersTable.jobId))
            .leftJoin(ranksTable, eq(ranksTable.id, usersTable.rankId))
            .leftJoin(rolesTable, eq(rolesTable.id, usersTable.roleId))
            .leftJoin(updatedByUsers, eq(updatedByUsers.id, citizensTable.updatedBy))
            .leftJoin(updatedByUsersJobs, eq(updatedByUsersJobs.id, updatedByUsers.jobId))
            .leftJoin(updatedByUsersRanks, eq(updatedByUsersRanks.id, updatedByUsers.rankId))
            .leftJoin(updatedByUsersRoles, eq(updatedByUsersRoles.id, updatedByUsers.roleId))
            .leftJoin(nationalitiesTable, eq(citizensTable.nationalityId, nationalitiesTable.id));
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
            .orderBy(citizensTable.lastName, citizensTable.firstName, citizensTable.birthDate)
            .limit(valuePerPage)
            .offset(offset);

        const dbCitizens = await query;

        const countQuery = CitizenRepository.db
            .select({ count: sql<number>`count(*)` })
            .from(citizensTable);

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

        const citizensData = await Promise.all(
            dbCitizens.map(async (dbCitizen) =>
                Citizen.getFromDb(
                    dbCitizen.citizens,
                    dbCitizen.genders,
                    dbCitizen.statuses,
                    dbCitizen.blood_types,
                    dbCitizen.users!,
                    dbCitizen.ranks!,
                    dbCitizen.jobs!,
                    dbCitizen.roles!,
                    dbCitizen.updated_by_users!,
                    dbCitizen.updated_by_user_ranks!,
                    dbCitizen.updated_by_user_jobs!,
                    dbCitizen.updated_by_user_roles!,
                    dbCitizen.nationalities!
                )
            )
        );

        const citizens = citizensData.filter((x): x is Citizen => x !== null);

        return new Pager(citizens, count, valuePerPage, page);
    }

    public static async add(citizenToCreate: CitizenToCreateType, user: User): Promise<string> {
        const [inserted] = await CitizenRepository.db
            .insert(citizensTable)
            .values({ ...citizenToCreate, createdBy: user.id, updatedBy: user.id })
            .returning({ id: citizensTable.id });

        return inserted.id;
    }

    public static async get(id: string): Promise<Citizen | null> {
        const updatedByUsers = alias(usersTable, "updated_by_users");
        const updatedByUsersJobs = alias(jobsTable, "updated_by_user_jobs");
        const updatedByUsersRanks = alias(ranksTable, "updated_by_user_ranks");
        const updatedByUsersRoles = alias(rolesTable, "updated_by_user_roles");

        const query = CitizenRepository.db
            .select()
            .from(citizensTable)
            .leftJoin(bloodTypesTable, eq(bloodTypesTable.id, citizensTable.bloodTypeId))
            .leftJoin(statusesTable, eq(statusesTable.id, citizensTable.statusId))
            .leftJoin(gendersTable, eq(gendersTable.id, citizensTable.genderId))
            .leftJoin(usersTable, eq(usersTable.id, citizensTable.createdBy))
            .leftJoin(jobsTable, eq(jobsTable.id, usersTable.jobId))
            .leftJoin(ranksTable, eq(ranksTable.id, usersTable.rankId))
            .leftJoin(rolesTable, eq(rolesTable.id, usersTable.roleId))
            .leftJoin(updatedByUsers, eq(updatedByUsers.id, citizensTable.updatedBy))
            .leftJoin(updatedByUsersJobs, eq(updatedByUsersJobs.id, updatedByUsers.jobId))
            .leftJoin(updatedByUsersRanks, eq(updatedByUsersRanks.id, updatedByUsers.rankId))
            .leftJoin(updatedByUsersRoles, eq(updatedByUsersRoles.id, updatedByUsers.roleId))
            .leftJoin(nationalitiesTable, eq(citizensTable.nationalityId, nationalitiesTable.id))
            .where(eq(citizensTable.id, id));

        const userDb = (await query)[0];
        if (!userDb) return null;

        const user = Citizen.getFromDb(
            userDb.citizens,
            userDb.genders,
            userDb.statuses,
            userDb.blood_types,
            userDb.users!,
            userDb.ranks!,
            userDb.jobs!,
            userDb.roles!,
            userDb.updated_by_users!,
            userDb.updated_by_user_ranks!,
            userDb.updated_by_user_jobs!,
            userDb.updated_by_user_roles!,
            userDb.nationalities!
        );

        return user;
    }
}
