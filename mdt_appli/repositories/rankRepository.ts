import { drizzle } from "drizzle-orm/node-postgres";
import { jobsTable, ranksTable, usersTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { RankType } from "@/types/db/rank";
import Rank from "@/types/class/Rank";

const db = drizzle(process.env.DATABASE_URL!);

export default class RankRepository {
	static async GetList(): Promise<Rank[]> {
		const ranks = await db
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
					await db
						.update(ranksTable)
						.set({
							jobId: rank.job?.id ?? 1,
							name: rank.name ?? "",
							order: rank.order ?? 0,
						})
						.where(eq(ranksTable.id, rank.id));
				} else {
					// Insert
					await db.insert(ranksTable).values({
						name: rank.name ?? "",
						order: rank.order ?? 0,
						jobId: rank.job?.id ?? 1,
					});
				}
			})
		);
	}

	public static async delete(id: number) {
		await db.delete(ranksTable).where(eq(ranksTable.id, id));
	}
}
