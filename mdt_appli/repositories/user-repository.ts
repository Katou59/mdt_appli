import { jobsTable, ranksTable, rolesTable, usersTable } from "@/db/schema";
import Pager from "@/types/class/Pager";
import User from "@/types/class/User";
import { UserToCreateType, UserType } from "@/types/db/user";
import { and, eq, ilike, or, sql } from "drizzle-orm";
import Repository from "./repository";

type FilterType = {
    searchTerm?: string;
    isDisable?: boolean;
    jobId?: number;
    rankId?: number;
    roleId?: number;
};

export class UserRepository extends Repository {
    public static async get(discordId: string): Promise<User | null> {
        const users = await UserRepository.db
            .select()
            .from(usersTable)
            .leftJoin(jobsTable, eq(jobsTable.id, usersTable.jobId))
            .leftJoin(ranksTable, eq(ranksTable.id, usersTable.rankId))
            .leftJoin(rolesTable, eq(rolesTable.id, usersTable.roleId))
            .where(eq(usersTable.id, discordId));

        const userDb = users[0]?.users;

        if (!userDb) return null;

        return User.getFromDb(users[0].users, users[0].ranks, users[0].jobs, users[0].roles!);
    }

    public static async getList(params: {
        rankId?: number;
        itemPerPage: number;
        page: number;
        filter?: FilterType;
    }): Promise<Pager<User, UserType>> {
        const offset = (params.page - 1) * params.itemPerPage;

        const conditions = [];

        if (params?.rankId !== undefined) {
            conditions.push(eq(usersTable.rankId, params.rankId));
        }
        if (params?.filter?.isDisable !== undefined) {
            conditions.push(eq(usersTable.isDisable, params.filter.isDisable));
        }
        if (params?.filter?.jobId !== undefined) {
            conditions.push(eq(usersTable.jobId, params.filter.jobId));
        }
        if (params?.filter?.rankId !== undefined) {
            conditions.push(eq(usersTable.rankId, params.filter.rankId));
        }
        if (params?.filter?.roleId !== undefined) {
            conditions.push(eq(usersTable.roleId, params.filter.roleId));
        }

        const orConditions = [];
        if (params?.filter?.searchTerm !== undefined) {
            orConditions.push(ilike(usersTable.id, `%${params.filter.searchTerm}%`));
            orConditions.push(ilike(usersTable.firstName, `%${params.filter.searchTerm}%`));
            orConditions.push(ilike(usersTable.lastName, `%${params.filter.searchTerm}%`));
            orConditions.push(ilike(usersTable.name, `%${params.filter.searchTerm}%`));
            orConditions.push(ilike(usersTable.email, `%${params.filter.searchTerm}%`));
            orConditions.push(ilike(usersTable.phoneNumber, `%${params.filter.searchTerm}%`));

            if (!isNaN(Number(params.filter.searchTerm))) {
                orConditions.push(
                    ilike(sql`CAST(${usersTable.number} AS TEXT)`, `%${params.filter.searchTerm}%`)
                );
            }
        }

        let query = UserRepository.db
            .select()
            .from(usersTable)
            .leftJoin(jobsTable, eq(jobsTable.id, usersTable.jobId))
            .leftJoin(ranksTable, eq(ranksTable.id, usersTable.rankId))
            .leftJoin(rolesTable, eq(rolesTable.id, usersTable.roleId))
            .orderBy(usersTable.lastName, usersTable.firstName, usersTable.number)
            .limit(params.itemPerPage)
            .offset(offset);

        const whereClause = [];

        if (conditions.length > 0 && orConditions.length > 0) {
            whereClause.push(and(...conditions));
            whereClause.push(or(...orConditions));
        } else if (conditions.length > 0) {
            whereClause.push(and(...conditions));
        } else if (orConditions.length > 0) {
            whereClause.push(or(...orConditions));
        }

        query = query.where(and(...whereClause)) as typeof query;

        const users = (await query)
            .map((user) => {
                return User.getFromDb(user.users, user.ranks, user.jobs, user.roles!);
            })
            .filter((user) => user !== null);

        let countQuery = UserRepository.db
            .select({ count: sql<number>`count(*)` })
            .from(usersTable);
        countQuery = countQuery.where(and(...whereClause)) as typeof countQuery;
        const [{ count }] = await countQuery;

        return new Pager(users, count, params.itemPerPage, params.page);
    }

    public static async update(user: User): Promise<void> {
        await UserRepository.db
            .update(usersTable)
            .set({
                ...user,
                jobId: user.rank?.job?.id,
                rankId: user.rank?.id,
                roleId: user.role.key,
            })
            .where(eq(usersTable.id, user.id));
    }

    public static async add(userToCreate: UserToCreateType): Promise<string> {
        const [inserted] = await UserRepository.db
            .insert(usersTable)
            .values({
                id: userToCreate.id,
                jobId: userToCreate.jobId,
                rankId: userToCreate.rankId,
            })
            .returning({ id: usersTable.id });

        return inserted.id;
    }

    public static async getCount(jobId: number): Promise<number> {
        const [{ count }] = await UserRepository.db
            .select({
                count: sql<number>`count(*)`,
            })
            .from(usersTable)
            .where(and(eq(usersTable.jobId, jobId), eq(usersTable.isDisable, false)));

        return count;
    }
}
