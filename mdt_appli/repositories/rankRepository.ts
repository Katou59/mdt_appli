import { drizzle } from "drizzle-orm/node-postgres";
import { jobsTable, ranksTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { RankType } from "@/types/db/rank";
import Rank from "@/types/class/Rank";

const db = drizzle(process.env.DATABASE_URL!);

export default class RankRepository {
	static async GetList(): Promise<Rank[]> {
		const ranks = await db
			.select()
			.from(ranksTable)
			.leftJoin(jobsTable, eq(jobsTable.id, ranksTable.jobId));

		return ranks.map((rank) => {
			return new Rank({
				id: rank.ranks.id ?? null,
				name: rank.ranks.name,
				job: { id: rank.jobs?.id, name: rank.jobs?.name },
				order: rank.ranks.order,
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
}
