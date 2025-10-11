import { drizzle } from "drizzle-orm/node-postgres";
import { jobsTable, ranksTable, usersTable } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import User from "@/types/class/User";
import { UserToCreateType, UserType } from "@/types/db/user";
import Pager from "@/types/class/Pager";

const db = drizzle(process.env.DATABASE_URL!);

export class UserRepository {
    public static async get(discordId: string): Promise<User | null> {
        const users = await db
            .select()
            .from(usersTable)
            .leftJoin(jobsTable, eq(jobsTable.id, usersTable.jobId))
            .leftJoin(ranksTable, eq(ranksTable.id, usersTable.rankId))
            .where(eq(usersTable.id, discordId));

        const userDb = users[0]?.users;

        if (!userDb) return null;

        return User.getFromDb(users[0].users, users[0].ranks, users[0].jobs);
    }

    public static async getList(params: {
        rankId?: number;
        itemPerPage: number;
        page: number;
    }): Promise<Pager<User, UserType>> {
        const offset = (params.page - 1) * params.itemPerPage;

        const conditions = [];

        if (params?.rankId !== undefined) {
            conditions.push(eq(usersTable.rankId, params.rankId));
        }

        let query = db
            .select()
            .from(usersTable)
            .leftJoin(jobsTable, eq(jobsTable.id, usersTable.jobId))
            .leftJoin(ranksTable, eq(ranksTable.id, usersTable.rankId))
            .orderBy(usersTable.lastName, usersTable.firstName, usersTable.number)
            .limit(params.itemPerPage)
            .offset(offset);

        if (conditions.length > 0) {
            query = query.where(and(...conditions)) as typeof query;
        }

        const users = (await query)
            .map((user) => {
                return User.getFromDb(user.users, user.ranks, user.jobs);
            })
            .filter((user) => user !== null);

        const countQuery = db.select({ count: sql<number>`count(*)` }).from(usersTable);
        const [{ count }] = await countQuery;

        return new Pager(users, count, params.itemPerPage, params.page);
    }

    public static async update(user: User): Promise<void> {
        await db
            .update(usersTable)
            .set({ ...user, jobId: user.rank?.job?.id, rankId: user.rank?.id })
            .where(eq(usersTable.id, user.id));
    }

    public static async add(userToCreate: UserToCreateType): Promise<void> {
        await db.insert(usersTable).values({
            id: userToCreate.id,
            jobId: userToCreate.jobId,
            rankId: userToCreate.rankId,
        });
    }
}
