import {
    bloodTypesTable,
    citizenFinesTable,
    citizensTable,
    finesTable,
    gendersTable,
    jobsTable,
    nationalitiesTable,
    ranksTable,
    rolesTable,
    statusesTable,
    usersTable,
} from "@/db/schema";
import Citizen from "@/types/class/Citizen";
import CitizenFine from "@/types/class/CitizenFine";
import Pager from "@/types/class/Pager";
import User from "@/types/class/User";
import { CitizenToCreateType, CitizenToUpdateType, CitizenType } from "@/types/commons/citizen";
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
            .values({
                ...citizenToCreate,
                createdBy: user.id,
                updatedBy: user.id,
                photoId: citizenToCreate.photoUrl,
            })
            .returning({ id: citizensTable.id });

        return inserted.id;
    }

    public static async get(id: string): Promise<Citizen | null> {
        const updatedByUserTable = alias(usersTable, "updated_by_user");
        const updatedByUserJobTable = alias(jobsTable, "updated_by_user_job");
        const updatedByUserRankTable = alias(ranksTable, "updated_by_user_rank");
        const updatedByUserRoleTable = alias(rolesTable, "updated_by_user_role");

        const citizenQuery = CitizenRepository.db
            .select({
                citizen: citizensTable,
                gender: gendersTable,
                status: statusesTable,
                bloodType: bloodTypesTable,
                nationality: nationalitiesTable,
                createdByUser: usersTable,
                createdByJob: jobsTable,
                createdByRank: ranksTable,
                createdByRole: rolesTable,
                updatedByUser: updatedByUserTable,
                updatedByJob: updatedByUserJobTable,
                updatedByRank: updatedByUserRankTable,
                updatedByRole: updatedByUserRoleTable,
            })
            .from(citizensTable)
            .leftJoin(bloodTypesTable, eq(bloodTypesTable.id, citizensTable.bloodTypeId))
            .leftJoin(statusesTable, eq(statusesTable.id, citizensTable.statusId))
            .leftJoin(gendersTable, eq(gendersTable.id, citizensTable.genderId))
            .leftJoin(usersTable, eq(usersTable.id, citizensTable.createdBy))
            .leftJoin(jobsTable, eq(jobsTable.id, usersTable.jobId))
            .leftJoin(ranksTable, eq(ranksTable.id, usersTable.rankId))
            .leftJoin(rolesTable, eq(rolesTable.id, usersTable.roleId))
            .leftJoin(updatedByUserTable, eq(updatedByUserTable.id, citizensTable.updatedBy))
            .leftJoin(
                updatedByUserRankTable,
                eq(updatedByUserRankTable.id, updatedByUserTable.rankId)
            )
            .leftJoin(updatedByUserJobTable, eq(updatedByUserJobTable.id, updatedByUserTable.jobId))
            .leftJoin(
                updatedByUserRoleTable,
                eq(updatedByUserRoleTable.id, updatedByUserTable.roleId)
            )
            .leftJoin(nationalitiesTable, eq(citizensTable.nationalityId, nationalitiesTable.id))
            .where(eq(citizensTable.id, id))
            .limit(1);

        const userDb = (await citizenQuery)[0];
        if (!userDb) return null;

        const fineCreatedByTable = alias(usersTable, "fine_created_by");
        const fineCreatedByJobTable = alias(jobsTable, "fine_created_by_job");
        const fineCreatedByRankTable = alias(ranksTable, "fine_created_by_rank");
        const fineCreatedByRoleTable = alias(rolesTable, "fine_created_by_role");

        const finesQuery = CitizenRepository.db
            .select({
                citizenFine: citizenFinesTable,
                createdBy: usersTable,
                createdByJob: jobsTable,
                createdByRank: ranksTable,
                createdByRole: rolesTable,
                fine: finesTable,
                fineCreatedBy: fineCreatedByTable,
                fineCreatedByJob: fineCreatedByJobTable,
                fineCreatedByRank: fineCreatedByRankTable,
                fineCreatedByRole: fineCreatedByRoleTable,
            })
            .from(citizenFinesTable)
            .leftJoin(usersTable, eq(usersTable.id, citizenFinesTable.createdBy))
            .leftJoin(jobsTable, eq(usersTable.jobId, jobsTable.id))
            .leftJoin(ranksTable, eq(usersTable.rankId, ranksTable.id))
            .leftJoin(rolesTable, eq(usersTable.roleId, rolesTable.id))
            .leftJoin(finesTable, eq(citizenFinesTable.fineId, finesTable.id))
            .leftJoin(fineCreatedByTable, eq(fineCreatedByTable.id, finesTable.createdBy))
            .leftJoin(fineCreatedByJobTable, eq(fineCreatedByTable.jobId, fineCreatedByJobTable.id))
            .leftJoin(
                fineCreatedByRankTable,
                eq(fineCreatedByTable.rankId, fineCreatedByRankTable.id)
            )
            .leftJoin(
                fineCreatedByRoleTable,
                eq(fineCreatedByTable.roleId, fineCreatedByRoleTable.id)
            )
            .where(eq(citizenFinesTable.citizenId, id));

        const finesDb = await finesQuery;

        const citizenFines = finesDb.map((fine) =>
            CitizenFine.getFomDb(
                fine.citizenFine,
                fine.createdBy!,
                fine.createdByJob!,
                fine.createdByRank!,
                fine.createdByRole!,
                fine.fine!,
                fine.fineCreatedBy!,
                fine.fineCreatedByJob!,
                fine.fineCreatedByRank!,
                fine.fineCreatedByRole!
            )
        );

        const user = await Citizen.getFromDb(
            userDb.citizen,
            userDb.gender,
            userDb.status,
            userDb.bloodType,
            userDb.createdByUser!,
            userDb.createdByRank!,
            userDb.createdByJob!,
            userDb.createdByRole!,
            userDb.updatedByUser!,
            userDb.updatedByRank!,
            userDb.updatedByJob!,
            userDb.updatedByRole!,
            userDb.nationality!,
            citizenFines
        );

        return user;
    }

    public static async update(citizenToUpdate: CitizenToUpdateType, currentUser: User) {
        await CitizenRepository.db
            .update(citizensTable)
            .set({
                firstName: citizenToUpdate.firstName,
                lastName: citizenToUpdate.lastName,
                birthDate: citizenToUpdate.birthDate,
                phoneNumber: citizenToUpdate.phoneNumber,
                nationalityId: citizenToUpdate.nationalityId,
                genderId: citizenToUpdate.genderId,
                statusId: citizenToUpdate.statusId,
                bloodTypeId: citizenToUpdate.bloodTypeId,
                photoId: citizenToUpdate.photoUrl ?? citizenToUpdate.photoUrl ?? null,
                updatedBy: currentUser.id,
                updatedAt: new Date(),
                address: citizenToUpdate.address,
                birthPlace: citizenToUpdate.birthPlace,
                city: citizenToUpdate.city,
                description: citizenToUpdate.description,
                eyeColor: citizenToUpdate.eyeColor,
                hairColor: citizenToUpdate.hairColor,
                hasTattoo: citizenToUpdate.hasTattoo,
                height: citizenToUpdate.height,
                weight: citizenToUpdate.weight,
                isWanted: citizenToUpdate.isWanted,
                job: citizenToUpdate.job,
            })
            .where(eq(citizensTable.id, citizenToUpdate.id));
    }

    public static async getCount(): Promise<number> {
        const [{ count }] = await CitizenRepository.db
            .select({
                count: sql<number>`count(*)`,
            })
            .from(citizensTable);

        return count;
    }
}
