import { drizzle } from "drizzle-orm/node-postgres";
import { jobsTable, ranksTable, usersTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { JobType } from "@/types/db/job";
import { RankType } from "@/types/db/rank";
import { RoleType } from "@/types/enums/roleType";
import User from "@/types/class/User";
import Rank from "@/types/class/Rank";
import { UserToCreateType } from "@/types/db/user";

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

    public static async getList(params?: { rankId?: number }): Promise<User[] | null> {
        const conditions = [];

        if (params?.rankId !== undefined) {
            conditions.push(eq(usersTable.rankId, params.rankId));
        }

        let query = db
            .select()
            .from(usersTable)
            .leftJoin(jobsTable, eq(jobsTable.id, usersTable.jobId))
            .leftJoin(ranksTable, eq(ranksTable.id, usersTable.rankId));

        if (conditions.length > 0) {
            // ici, query est encore un QueryBuilder
            query = query.where(and(...conditions)) as typeof query;
        }

        return (await query)
            .map((u) => {
                return User.getFromDb(u.users, u.ranks, u.jobs);
            })
            .filter((x) => x !== null);
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
