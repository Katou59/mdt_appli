import { jobsTable, ranksTable, usersTable } from "@/db/schema";
import Rank from "@/types/class/Rank";
import { RankType } from "@/types/commons/rank";
import { eq, sql } from "drizzle-orm";
import Repository from "./repository";

export default class RankRepository extends Repository {
    static async getList(jobId?: number): Promise<Rank[]> {
        const query = RankRepository.db
            .select({
                id: ranksTable.id,
                name: ranksTable.name,
                order: ranksTable.order,
                jobId: ranksTable.jobId,
                jobName: jobsTable.name,
                userCount: sql<number>`count(${usersTable.id})`,
            })
            .from(ranksTable)
            .leftJoin(jobsTable, eq(jobsTable.id, ranksTable.jobId))
            .leftJoin(usersTable, eq(usersTable.rankId, ranksTable.id))
            .groupBy(
                ranksTable.id,
                ranksTable.name,
                ranksTable.order,
                ranksTable.jobId,
                jobsTable.name
            )
            .orderBy(ranksTable.order);

        if (jobId !== undefined) query.where(eq(ranksTable.jobId, jobId));

        const ranks = await query;

        return ranks.map((rank) => {
            return new Rank({
                id: rank.id,
                name: rank.name,
                job: rank.jobId ? { id: rank.jobId, name: rank.jobName } : null,
                order: rank.order,
                userCount: rank.userCount, // 👈 tu peux l’ajouter dans RankType
            } as RankType);
        });
    }

    static async AddOrUpdateList(ranks: Rank[]): Promise<void> {
        await Promise.all(
            ranks.map(async (rank) => {
                if (rank.id) {
                    // Update
                    await RankRepository.db
                        .update(ranksTable)
                        .set({
                            jobId: rank.job?.id ?? 1,
                            name: rank.name ?? "",
                            order: rank.order ?? 0,
                        })
                        .where(eq(ranksTable.id, rank.id));
                } else {
                    // Insert
                    await RankRepository.db.insert(ranksTable).values({
                        name: rank.name ?? "",
                        order: rank.order ?? 0,
                        jobId: rank.job?.id ?? 1,
                    });
                }
            })
        );
    }

    public static async Delete(id: number) {
        await RankRepository.db.delete(ranksTable).where(eq(ranksTable.id, id));
    }

    public static async get(id: number) {
        const rankDb = await RankRepository.db
            .select({
                id: ranksTable.id,
                name: ranksTable.name,
                order: ranksTable.order,
                jobId: ranksTable.jobId,
                jobName: jobsTable.name,
                userCount: sql<number>`count(${usersTable.id})`,
            })
            .from(ranksTable)
            .leftJoin(jobsTable, eq(jobsTable.id, ranksTable.jobId))
            .leftJoin(usersTable, eq(usersTable.rankId, ranksTable.id))
            .groupBy(
                ranksTable.id,
                ranksTable.name,
                ranksTable.order,
                ranksTable.jobId,
                jobsTable.name
            )
            .orderBy(ranksTable.order)
            .where(eq(ranksTable.id, id));

        const rank = rankDb[0];

        return new Rank({
            id: rank.id,
            name: rank.name,
            job: rank.jobId ? { id: rank.jobId, name: rank.jobName } : null,
            order: rank.order,
        } as RankType);
    }
}
