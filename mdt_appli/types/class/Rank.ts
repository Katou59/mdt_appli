import { RankType } from "@/types/db/rank";
import Job from "./Job";

export default class Rank {
	id: number | null;
	name: string | null;
	job: Job | null;
	order: number | null;

	constructor(rank?: RankType) {
		if (!rank) {
			this.id = null;
			this.name = null;
			this.job = null;
			this.order = null;

			return;
		}

		this.id = rank?.id;
		this.name = rank?.name;
		this.job = rank?.job ? new Job(rank.job) : null;
		this.order = rank.order;
	}

	toRankType(): RankType {
		return {
			id: this.id,
			name: this.name,
			job: this.job?.toJobType() ?? null,
			order: this.order
		} as RankType;
	}
}
