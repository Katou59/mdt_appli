import { jobsTable } from "@/db/schema";
import Job from "@/types/class/Job";
import Repository from "./repository";

export default class JobRepository extends Repository {
	public static async getList(): Promise<Job[]> {
		const results = await JobRepository.db.select().from(jobsTable);

		return results.map((r) => new Job(r));
	}
}
