import {auth} from "@/auth";
import { drizzle } from "drizzle-orm/node-postgres";
import {UserType} from "@/types/db/user";
import {jobsTable, ranksTable, usersTable} from "@/db/schema";
import {eq} from "drizzle-orm";
import {JobType} from "@/types/db/job";
import {RankType} from "@/types/db/rank";

const db = drizzle(process.env.DATABASE_URL!);

export class UserRepository {    
    public static async get(discordId: string): Promise<UserType | null> {        
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
            Job: job
        }

        return {
            createdAt: userDb.createdAt,
            email: userDb.email,
            firstLogin: userDb.firstLogin,
            firstName: userDb.firstName,
            lastLogin: userDb.lastLogin,
            lastName: userDb.lastName,
            name: userDb.name,
            number: userDb.number,
            id: userDb.id,
            rank: rank,
        }
    }
}