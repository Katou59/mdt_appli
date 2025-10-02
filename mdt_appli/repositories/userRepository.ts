import {drizzle} from "drizzle-orm/node-postgres";
import {jobsTable, ranksTable, usersTable} from "@/db/schema";
import {eq} from "drizzle-orm";
import {JobType} from "@/types/db/job";
import {RankType} from "@/types/db/rank";
import {RoleType} from "@/types/enums/roleType";
import User from "@/types/class/User";
import Rank from "@/types/class/Rank";

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

        const jobDb = users[0]?.jobs;
        const rankDb = users[0]?.ranks;

        const job: JobType | null = jobDb == null ? null : {
            id: jobDb?.id ?? null,
            name: jobDb?.name ?? null,
        }

        const rank: RankType | null = rankDb == null ? null : {
            id: rankDb?.id ?? null,
            name: rankDb?.name ?? null,
            job: job,
			order: rankDb.order
        }

        return new User({
            createdAt: new Date(userDb.createdAt),
            email: userDb.email,
            firstLogin: userDb.firstLogin,
            firstName: userDb.firstName,
            lastLogin: userDb.lastLogin,
            lastName: userDb.lastName,
            name: userDb.name,
            number: userDb.number,
            id: userDb.id,
            rank: rank,
            isDisable: userDb.isDisable ?? false,
            phoneNumber: userDb.phoneNumber,
            role: userDb?.role as RoleType,
        });
    }

    public static async getList(): Promise<User[] | null> {
        const users = await db
            .select()
            .from(usersTable)
            .leftJoin(jobsTable, eq(jobsTable.id, usersTable.jobId))
            .leftJoin(ranksTable, eq(ranksTable.id, usersTable.rankId));

        return users.map(u => {
            const jobDb = u.jobs;
            const rankDb = u.ranks;

            const job: JobType | null = jobDb == null ? null : {
                id: jobDb?.id ?? null,
                name: jobDb?.name ?? null,
            }

            const rank: RankType | null = rankDb == null ? null : {
                id: rankDb?.id ?? null,
                name: rankDb?.name ?? null,
                job: job,
				order: rankDb?.order
            };

            return new User({
                createdAt: u.users.createdAt,
                email: u.users.email,
                firstLogin: u.users.firstLogin,
                firstName: u.users.firstName,
                lastLogin: u.users.lastLogin,
                lastName: u.users.lastName,
                name: u.users.name,
                number: u.users.number,
                id: u.users.id,
                rank: rank ? new Rank(rank) : null,
                isDisable: u.users.isDisable ?? false,
                phoneNumber: u.users.phoneNumber,
                role: u.users.role as RoleType,
            });
        });
    }

    public static async update(user: User): Promise<User | null> {
        await db
            .update(usersTable)
            .set(user)
            .where(eq(usersTable.id, user.id));

        return await UserRepository.get(user.id);
    }
}