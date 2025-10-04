import { jobsTable } from "@/db/schema";
import Job from "@/types/class/Job";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle(process.env.DATABASE_URL!);

export default class JobRepository {
	public static async getList(): Promise<Job[]> {
		const results = await db.select().from(jobsTable);

		return results.map((r) => new Job(r));
	}
}
